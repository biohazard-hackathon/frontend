import React, { FC, useEffect, useState } from "react"
import Stepper from 'bs-stepper'
import "bs-stepper/dist/css/bs-stepper.min.css";
import Icon from "./Icon";
import { createUUID } from "../helpers";
import BackendApi from "../api/BackendApi";
import { UploadFile } from "./UploadFile";
import { IIngestionProgress, IngestionStatus } from "../types";

interface Props {
	file: File | undefined;
	fileType: string | undefined;
	setIsCompleted: (completed: boolean) => void
}

const IngestionStatusToSteps = {
    STARTED: 1,
    COMPLETED: 5,
    ERROR: 0,
    SHEET_LOADED: 2,
    SHEET_PARSED: 4,
    SHEET_VALIDATED: 3
}

export const UploadStepper: FC<Props> = ({file, fileType, setIsCompleted}) => {

	const [stepper, setStepper] = useState<Stepper>();
	const [activeStep, setActiveStep] = useState(IngestionStatusToSteps.STARTED);
	const [activeSignal, setSignal] = useState<IIngestionProgress>();

	useEffect(() => {
		const element = document.querySelector('#stepper1')
		if (element) {
			const stepp = new Stepper(element, {
				linear: true,
				animation: true
			})

			setStepper(stepp)
		}
		handleUpload();
	}, []);

	useEffect(() => {
		if (activeSignal) {
			const signalStatus = activeSignal.status;
			const signal = IngestionStatusToSteps[signalStatus];
			if (signalStatus === IngestionStatus.COMPLETED) {

				setTimeout(() => {
					setIsCompleted(true);
				  }, 3000);
			}
			setActiveStep(signal);
			console.log('signal', signal);
			stepper?.to(signal);
		}
	}, [activeSignal])

	const onSubmit = () => {

	}

	async function handleUpload () {
		const uuid = createUUID();
		console.log(`Starting subscription for ${uuid}`);

		try {
			await BackendApi.onProgressUpdateSubscription(uuid, setSignal);
		} catch (error) {
			console.log(error);
		}
	}

	// const handleNext = () => {
	// 	stepper?.next()
	// 	setActiveStep(activeStep + 1)
	// }

	console.log('activeStep', activeStep);
	console.log('activeSignal', activeSignal);
	return <div id="stepper1" className="bs-stepper bg-white shadow rounded-lg p-5">
		<div className="bs-stepper-header">
			<div className="step" data-target="#upload-step-1">
				<button className="step-trigger">
					<span className="bs-stepper-circle"><Icon name="cloud-arrow-up" /></span>
					<span className="bs-stepper-label">Uploading</span>
				</button>
			</div>
			<div className="line" />
			<div className="step" data-target="#upload-step-2">
				<button className="step-trigger">
					<span className="bs-stepper-circle">2</span>
					<span className="bs-stepper-label">Something</span>
				</button>
			</div>
			<div className="line" />
			<div className="step" data-target="#upload-step-3">
				<button className="step-trigger">
					<span className="bs-stepper-circle">3</span>
					<span className="bs-stepper-label">Something</span>
				</button>
			</div>

			<div className="line" />
			<div className="step" data-target="#upload-step-4">
				<button className="step-trigger">
					<span className="bs-stepper-circle">4</span>
					<span className="bs-stepper-label">Something</span>
				</button>
			</div>

			<div className="line" />
			<div className="step" data-target="#step-completed">
				<button className="step-trigger">
					<span className="bs-stepper-circle"><Icon name="check" /></span>
					<span className="bs-stepper-label">Completed</span>
				</button>
			</div>
		</div>
		<div className="bs-stepper-content">
			<form onSubmit={onSubmit}>
				<div id="upload-step-1" className="content container p-5 text-center">
					<div className="form-group">
						{file && <div className="p-2">
							<img src={fileType === 'excel' ? "/images/upload_xls.png" : "/images/fasta_file_extension.png"} alt="" className="d-block w-25 mx-auto mb-4" />
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
						<div className="">Uploading file...</div>
					</div>
				</div>

				<div id="upload-step-2" className="content">
					<div className="form-group">
						<label htmlFor="exampleInputPassword1">Password</label>
						<input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
					</div>
					<button className="btn btn-primary" onClick={() => stepper?.next()}>Next</button>
				</div>

				<div id="upload-step-3" className="content text-center">
					<button type="submit" className="btn btn-primary mt-5">Submit</button>
				</div>

				<div id="upload-step-4" className="content">
					<div className="form-group">
						<Icon name="biohazard" spin fixedWidth size="md" />
					</div>
					<button className="btn btn-primary" onClick={() => stepper?.next()}>Next</button>
				</div>

				<div id="step-completed" className="content">
					<div className="form-group text-center p-5">
						<Icon name="check" size="3x" />
						<h3>All set</h3>
					</div>
				</div>
			</form>
		</div>
	</div>
}
