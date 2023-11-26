import React, { FC, useState } from "react";

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
	console.log('file', file);

	const handleChange = (event: any) => {
		console.log('event', event);
		const { name, value } = event.target;
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	};

	const handleSubmit = async () => {
		console.log('formData', formData);
	};

	return (
		<>
			<h1>{!isCompleted ? 'Upload your file' : 'Your parsed data'}</h1>

			{!isCompleted ? <>
				{file ?
					<UploadStepper file={file} fileType={fileType} setIsCompleted={setIsCompleted} />
					:
					<div className="d-flex">
						<UploadFile setFile={setFile} selectedFile={file} setFileType={setFileType} />
						<UploadFile isXls={false} setFile={setFile} selectedFile={file} setFileType={setFileType} />
					</div>
				}
			</> : <>
				<DataTable />
				<div className="mt-3">
					<h2>Conclusion</h2>
					<form action="submitForm mt-3">
						<div className="form-floating">
							<textarea className="form-control" name="input" id="floatingTextarea2" style={{ height: '100px' }} onChange={handleChange}></textarea>
							<label htmlFor="floatingTextarea2">Conclusion</label>
						</div>
						<div className="d-flex justify-content-md-end">
							<button type="button" className="btn btn-primary mt-5" onClick={handleSubmit}>Analyse</button>
						</div>
					</form>
				</div>
			</>
			}
		</>
	);
};
