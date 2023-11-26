import React, {FC, useEffect, useState} from "react";
import Stepper from 'bs-stepper';
import "bs-stepper/dist/css/bs-stepper.min.css";
import Icon from "./Icon";
import {createUUID} from "../helpers";
import BackendApi from "../api/BackendApi";
import {IIngestionProgress, IngestionStatus} from "../types";
import axios from 'axios';
import { useNavigate } from "react-router";

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

export const UploadStepper: FC<Props> = ({file, fileType, setIsCompleted}) => {

	const [stepper, setStepper] = useState<Stepper>();
	const [activeStep, setActiveStep] = useState(IngestionStatusToSteps.STARTED);
	const [activeSignal, setSignal] = useState<IIngestionProgress>();
	const navigate = useNavigate()

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

				setTimeout(() => {
					setIsCompleted(true);
					navigate(`/analyse/${activeSignal.id}`)
				}, 3000);
			}
			if (activeStep < signal) {
				setActiveStep(signal);
			}
			console.log('signal', signal);
			stepper?.to(signal);
		}
	}, [activeSignal]);

	const onSubmit = () => {

	};

	const handleNext = () => {
		stepper?.next()
		setActiveStep(activeStep + 1)
	}

	// const handleNext = () => {
	// 	stepper?.next()
	// 	setActiveStep(activeStep + 1)
	// }
	// STARTED = 'STARTED',
    // COMPLETED = 'COMPLETED',
    // ERROR = 'ERROR',
	// SHEET_LOADED = 'SHEET_LOADED',
	// SHEET_PARSED = 'SHEET_PARSED',
	// SHEET_VALIDATED = 'SHEET_VALIDATED'

	// console.log('activeStep', activeStep);
	// console.log('activeSignal', activeSignal);
	return <div id="stepper1" className="bs-stepper bg-white shadow rounded-lg p-5">
		<div className="bs-stepper-header">
			<div className="step" data-target="#step-started">
				<button className="step-trigger">
					<span className="bs-stepper-circle"><Icon name="cloud-arrow-up"/></span>
					<span className="bs-stepper-label">Uploading</span>
				</button>
			</div>
			<div className="line" />
			<div className="step" data-target="#step-sheet-loaded">
				<button className="step-trigger">
					<span className="bs-stepper-circle"><Icon name="spinner" /></span>
					<span className="bs-stepper-label">Sheet loaded</span>
				</button>
			</div>
			<div className="line" />
			<div className="step" data-target="#step-sheet-parsed">
				<button className="step-trigger">
					<span className="bs-stepper-circle"><Icon name="tachometer-alt" /></span>
					<span className="bs-stepper-label">Sheet parsed</span>
				</button>
			</div>

			<div className="line" />
			<div className="step" data-target="#step-sheet-validated">
				<button className="step-trigger">
					<span className="bs-stepper-circle"><Icon name="check" /></span>
					<span className="bs-stepper-label">Sheet validated</span>
				</button>
			</div>

			<div className="line"/>
			<div className="step" data-target="#step-completed">
				<button className="step-trigger">
					<span className="bs-stepper-circle"><Icon name="check"/></span>
					<span className="bs-stepper-label">Completed</span>
				</button>
			</div>
		</div>
		<div className="bs-stepper-content">
			{/* <div className="btn btn-primary" onClick={handleNext} /> */}
			<form onSubmit={onSubmit}>
				<div id="step-started" className="content container p-3 text-center">
					<div className="form-group">
						{file && <div className="p-2">
							<img
								src={fileType === 'excel' ? "/images/upload_xls.png" : "/images/fasta_file_extension.png"}
								alt="" className="d-block w-25 mx-auto mb-4"/>
							<div>
								<h2>File Details:</h2>
								<p>
									File Name:{" "}
									{file.name}
								</p>

								<p>
									File Type:{" "}
									{file.type}
								</p>
							</div>
						</div>}
						<div className="spinner-grow text-info" role="status">
							{/* <span className="sr-only">Loading...</span> */}
						</div>
						<div className="text-muted">Uploading file ..</div>
					</div>
				</div>


				<div id="step-sheet-parsed" className="content container p-3 text-center">
					<div className="p-2">
						<img src="/images/parsed_sheet.png" className="d-block w-25 mx-auto mb-4"/>
					</div>
					<div>
						<h2 className="text-muted">Sheet is parsed ..</h2>
					</div>
				</div>

				<div id="step-sheet-loaded" className="content container p-3 text-center">
					<div className="p-2">
						<img src="/images/loaded_sheet.png" className="d-block w-25 mx-auto mb-4"/>
					</div>
					<div>
						<h2 className="text-muted">Sheet is loaded ..</h2>
						{activeSignal?.output && <p>File size: {activeSignal?.output ? JSON.parse(activeSignal.output).size : ''}</p>}
					</div>
				</div>

				<div id="step-sheet-validated" className="content container p-3 text-center">
					<div className="p-2 d-flex align-items-center">
						<img src="/images/encrypt-icon.png" className="d-block w-25 h-25 mx-auto mb-4"/>
						<span className="display-3">&</span>
						<img src="/images/checklist.png" className="d-block w-25 mx-auto mb-4"/>
					</div>
					<div>
						<h2 className="text-muted">Sheet is validated ..</h2>
						<p>Available tab names:</p>
						<ul>{activeSignal?.output ? JSON.parse(activeSignal.output).split(', ').map((item: string) => <li>{item}</li>) : ''}</ul>
					</div>
				</div>

				<div id="step-completed" className="content">
					<div className="form-group text-center p-3">
						<Icon name="check" size="3x" />
						<h3>All set.. Generating table ..</h3>
					</div>
				</div>
			</form>
		</div>
	</div>;
};
