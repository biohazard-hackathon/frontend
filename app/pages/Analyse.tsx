import React, { FC, useState } from "react";

import BackendApi from '../api/BackendApi';
import { DataTable } from "../components/DataTable";
import { UploadFile } from "../components/UploadFile";
import { UploadStepper } from "../components/UploadStepper";

interface Props {

}

export const Analyse: FC<Props> = () => {
	const [formData, setFormData] = useState({});
	const [file, setFile] = useState<File>();
	const [fileType, setFileType] = useState<string>();
	const [isCompleted, setIsCompleted] = useState(false);

	console.log('isCompleted', isCompleted);
	const handleChange = (event: any) => {
		console.log('event', event);
		const { name, value } = event.target;
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	};

	const handleSubmit = async () => {
		console.log('formData', formData);
		const output = await BackendApi.healthCheck();
		console.log(output);
	};

	return (
		<>
			{!isCompleted && (
				<>
					<h1>Upload your file</h1>

					{file ?
						<UploadStepper file={file} fileType={fileType} setIsCompleted={setIsCompleted} />
						:
						<div className="d-flex">
							<UploadFile setFile={setFile} selectedFile={file} setFileType={setFileType} />
							<UploadFile isXls={false} setFile={setFile} selectedFile={file} setFileType={setFileType} />
						</div>
					}
				</>
			)}

			{/* <form action="submitForm">
				<div className="form-floating">
					<textarea className="form-control" name="input" id="floatingTextarea2" style={{ height: '100px' }} onChange={handleChange}></textarea>
					<label htmlFor="floatingTextarea2">Input text</label>
				</div>
				<div className="d-flex justify-content-md-end">
					<button type="button" className="btn btn-primary mt-5" onClick={handleSubmit}>Analyse</button>
				</div>
			</form> */}

			{isCompleted &&
				<DataTable />
			}
		</>
	);
};
