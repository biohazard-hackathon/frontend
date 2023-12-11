import React, { FC, useEffect, useState } from "react";
import Stepper from 'bs-stepper';
import "bs-stepper/dist/css/bs-stepper.min.css";
import Icon from "./Icon";
import { createUUID } from "../helpers";
import BackendApi from "../api/BackendApi";
import { IIngestionProgress, IngestionStatus } from "../types";
import axios from 'axios';

interface Props {
	file: File | undefined;
	fileType: string | undefined;
	setIsCompleted: (completed: boolean) => void;
	setUuid: (uuid: string) => void;
}

const IngestionStatusToSteps = {
	ERROR: 0,
	STARTED: 1,
	SHEET_LOADED: 2,
	SHEET_PARSED: 3,
	SHEET_VALIDATED: 4,
	COMPLETED: 5,
};

export const UploadStepper: FC<Props> = ({ file, fileType, setIsCompleted }) => {

	const [stepper, setStepper] = useState<Stepper>();
	const [activeStep, setActiveStep] = useState(IngestionStatusToSteps.STARTED);
	const [activeSignal, setSignal] = useState<IIngestionProgress>();
	const [rawHeadings, setRawHeadings] = useState<string[]>([]);
	const [transformedHeadings, setTransformedHeadings] = useState<string[]>([]);

	async function handleUpload() {
		const uuid = createUUID();
		console.log(`Starting subscription for ${uuid}`);

		try {
			const presignedS3Url = await BackendApi.getPresignedLinkForUpload(uuid);

			const options = { headers: { 'Content-Type': "vnd.ms-excel" } };
			await axios.put(presignedS3Url, file, options);
			await BackendApi.onProgressUpdateSubscription(uuid, setSignal);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		const element = document.querySelector('#stepper1');
		if (element) {
			const stepp = new Stepper(element, {
				linear: true,
				animation: true,
			});

			setStepper(stepp);
		}
		if (file) {
			(async () => await handleUpload())();
		}
	}, []);

	useEffect(() => {
		console.log('activeSignal', activeSignal);
		if (activeSignal) {
			const signalStatus = activeSignal.status;
			const signal = IngestionStatusToSteps[signalStatus];
			if (signalStatus === IngestionStatus.COMPLETED) {
				setActiveStep(signal);

				// setTimeout(() => {
					setIsCompleted(true);
					window.location.replace(`/biopsies/${activeSignal.id}`)
				// }, 3000);
			}
			else if (activeStep < signal) {
				setActiveStep(signal);
			}
			console.log('signal', signal);
			stepper?.to(signal);
		}
	}, [activeSignal]);

	const handleNext = () => {
		stepper?.next()
		setActiveStep(activeStep + 1)
	}

	const handleSubmit = () => {

	}

	const parsedColumns: string[] = activeSignal?.output ? JSON.parse(activeSignal.output).split('],') : [];

	if (activeStep === IngestionStatusToSteps.SHEET_VALIDATED) {
		const rawHeadingsParsed = parsedColumns.length ? parsedColumns.filter((column) => column.startsWith(' usingTab='))[0]?.split('..,')[1] : '';
		const rawHeadingsToArray = rawHeadingsParsed?.substring(14, rawHeadingsParsed.length).split(', ');
		rawHeadingsToArray?.length && !rawHeadings.length && setRawHeadings(rawHeadingsToArray);
		const transformedHeadingsParsed = parsedColumns.length ? parsedColumns.filter((column) => column.startsWith(' transformedHeadings=['))[0] : '';
		const transformedHeadingsToArray = transformedHeadingsParsed?.substring(22, transformedHeadingsParsed.length).split(', ');
		transformedHeadingsToArray?.length && !transformedHeadings.length && setTransformedHeadings(transformedHeadingsToArray);
	}

	return <div id="stepper1" className="bs-stepper bg-white shadow rounded-lg p-5">
		<div className="bs-stepper-header">
			<div className="step" data-target="#step-started">
				<button className="step-trigger">
					<span className="bs-stepper-circle"><Icon name="cloud-arrow-up" /></span>
					<span className="bs-stepper-label">UPLOADING</span>
				</button>
			</div>
			<div className="line" />
			<div className="step" data-target="#step-sheet-loaded">
				<button className="step-trigger">
					<span className="bs-stepper-circle"><img src="/images/sheet-loaded.png" /></span>
					<span className="bs-stepper-label">SHEET LOADED</span>
				</button>
			</div>
			<div className="line" />
			<div className="step" data-target="#step-sheet-parsed">
				<button className="step-trigger">
					<span className="bs-stepper-circle"><img src="/images/sheet-parsed.png" /></span>
					<span className="bs-stepper-label">SHEET PARSED</span>
				</button>
			</div>

			<div className="line" />
			<div className="step" data-target="#step-sheet-validated">
				<button className="step-trigger">
					<span className="bs-stepper-circle"><img src="/images/sheet-validated.png" /></span>
					<span className="bs-stepper-label">SHEET VALIDATED</span>
				</button>
			</div>

			<div className="line" />
			<div className="step" data-target="#step-completed">
				<button className="step-trigger">
					<span className="bs-stepper-circle"><Icon name="check" /></span>
					<span className="bs-stepper-label">COMPLETED</span>
				</button>
			</div>
		</div>
		<div className="bs-stepper-content">
			{/* <div className="btn btn-primary" onClick={handleNext}>Next</div> */}
			<form onSubmit={handleSubmit}>
				<div id="step-started" className="content container p-3 text-center">
					<div className="form-group">
						{file && <div className="p-2">
							<div className="color-primary rounded-circle p-5 mx-auto w-25">
								<img
									src={fileType === 'excel' ? "/images/upload_xls.png" : "/images/fasta_file_extension.png"}
									alt="" className="d-block w-100 icon-position mx-auto" />
							</div>
						</div>}
						<div>
							<div className="spinner-grow text-info" role="status" />
							<h2 className="text-muted">Uploading file ..</h2>
						</div>
					</div>
				</div>

				<div id="step-sheet-parsed" className="content container p-3 text-center">
					<div className="p-2">
						<div className="color-primary rounded-circle p-5 mx-auto w-25 mb-4">
							<img src="/images/sheet-parsed.png" className="d-block w-100 icon-position mx-auto" />
						</div>
					</div>
					<div>
						<div className="spinner-grow text-info" role="status" />
						<h2 className="text-muted">Sheet is parsed ..</h2>
					</div>
				</div>

				<div id="step-sheet-loaded" className="content container p-3 text-center">
					<div className="p-2">
						<div className="color-primary rounded-circle p-5 mx-auto w-25 mb-4">
							<img src="/images/sheet-loaded.png" className="d-block w-100 icon-position mx-auto" />
						</div>
					</div>
					<div>
						<div className="spinner-grow text-info" role="status" />
						<h2 className="text-muted">Sheet is loaded ..</h2>
					</div>
				</div>

				<div id="step-sheet-validated" className="content container p-3 text-center">
					<div className="p-2 d-flex align-items-center">
						<div className="color-primary rounded-circle p-5 mx-auto w-25 mb-4">
							<img src="/images/sheet-shield.png" className="d-block w-100 icon-position mx-auto" />
						</div>
						<span className="display-3">&</span>
						<div className="color-primary rounded-circle p-5 mx-auto w-25 mb-4">
							<img src="/images/sheet-validated.png" className="d-block w-100 icon-position mx-auto" />
						</div>
					</div>
					<div>
						<div className="spinner-grow text-info" role="status" />
						<h2 className="text-muted">Sheet is validated ..</h2>
						<div className="d-flex justify-content-around mt-3">
							{rawHeadings?.length && (
								<div>
									<h3>Raw Headings</h3>
									<div className="gap-2">
										{rawHeadings.map(rawHeading => (
											<div className="p-3 bg-white shadow rounded-lg">{rawHeading}</div>
										))}
									</div>
								</div>)}
							{transformedHeadings?.length && (
								<div>
									<h3>Transformed Headings</h3>
									<div className="gap-3">
										{transformedHeadings.map(transformedHeading => (
											<div className="p-3 bg-white shadow rounded-lg">{transformedHeading}</div>
										))}
									</div>
								</div>)}
						</div>
						{/* <ul>{.map((item: string) => <li>{item}</li>) : ''}</ul> */}
					</div>
				</div>

				<div id="step-completed" className="content">
					<div className="form-group text-center p-3">
						<div className="color-primary rounded-circle p-5 mx-auto w-25 mb-4">
							<img src="/images/all-set.png" className="d-block w-100 icon-position mx-auto" />
						</div>
						<div>
							<div className="spinner-grow text-info" role="status" />
							<h2>All set.. Generating table ..</h2>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>;
};
