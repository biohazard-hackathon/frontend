import React, { FC, useState } from "react";

import { DataTable } from "../components/DataTable";
import { UploadFile } from "../components/UploadFile";
import { UploadStepper } from "../components/UploadStepper";
import { useNavigate, useParams } from "react-router-dom";

interface Props {

}

export const Analyse: FC<Props> = () => {
	const [file, setFile] = useState<File>();
	const [fileType, setFileType] = useState<string>();
	const [isCompleted, setIsCompleted] = useState(true);

	const params = useParams();
	console.log('userId', params.id);
	const [uuid, setUUid] = useState<string>(params.id ?? '');


	const navigate = useNavigate();

	console.log('isCompleted', isCompleted);
	console.log('file', file);

	const handleFinished = (completedUuid: string) => {
		setUUid(completedUuid)
		navigate(`/analyse/${completedUuid}`);
	}


	const showDetail = isCompleted || uuid;
console.log('showDetail', showDetail)
	return (
		<>
			<h1>{!showDetail ? 'Upload your file' : 'Your parsed data'}</h1>
			{showDetail ? <DataTable /> :
			<>
			{file && !isCompleted ?
				<UploadStepper file={file} fileType={fileType} setIsCompleted={setIsCompleted} setUuid={handleFinished} />
				:
				<div className="d-flex">
					<UploadFile setFile={setFile} selectedFile={file} setFileType={setFileType} />
					<UploadFile isXls={false} setFile={setFile} selectedFile={file} setFileType={setFileType} />
				</div>
			}
			</>}
		</>
	);
};
