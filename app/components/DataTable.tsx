import React, { FC, useEffect, useState } from "react";
import { columns } from "../mocks";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Annotation, AnnotationStatus, IBiopsyResult, IGeneInfo, IRelevantReport } from "../types";
import BackendApi from "../api/BackendApi";
import { useParams } from "react-router-dom";

interface Props {

}

export const DataTable: FC<Props> = () => {
	const [biopsy, setBiopsy] = useState<IBiopsyResult>();
	const [rows, setRows] = useState<IGeneInfo[]>([]);
	const [formData, setFormData] = useState({});
	const [relevantData, setRelevantData] = useState<IRelevantReport[]>();

	useEffect(() => {
		handleUpload();
	}, [])

	async function handleUpload() {
		try {
			if (!rows?.length) {
				const bio = await BackendApi.getBiopsyResult('b8149b1e-8684-47c7-b7f3-6421e425afa3');


				if (bio) {
					const bb: {[key: string]: IGeneInfo} = JSON.parse(bio.results! as unknown as string);
					console.log('bb', bb);

					setRows(Object.values(bb).map((item, index) => ({ annotation: undefined, id: index + 1, ...item })))
					setBiopsy({...bio, results: bb});
					getRelevantData(bio);
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	const getRelevantData = async (bio: IBiopsyResult) => {
		console.log('biopsy results', bio?.results);
		if (bio?.results) {
		try {
			const codingRegionChanges = Object.values(bio?.results).map(result => result.codingRegionChange);
			const relevantData = await BackendApi.getRelevantReports(codingRegionChanges);
			setRelevantData(relevantData)
			console.log('relevantData', relevantData);
		} catch (error) {
			console.log(error);

		}
	}
	}

	const getRedBiopsyColumns = () => {

	}

	const handleChange = (event: any) => {
		console.log('event', event);
		const { name, value } = event.target;
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	};

	const handleGenerate = async () => {
		// console.log('formData', formData);
	};

	console.log('biopsy', biopsy);
	// console.log('rows', rows);

	return (
		<>
			<div className="bg-white shadow rounded-lg p-5">
				<DataGrid
					rows={rows}
					columns={columns}
					getRowClassName={(params) => {
						// console.log('params', params);
						return `color-table-${AnnotationStatus[params.row.annotation as Annotation]}` ?? '' }}
					getCellClassName={(params) => {
						// console.log('cellClassName', params);
						return params.value === 'Warning' ? 'bg-warning' : '' }}

					slots={{ toolbar: GridToolbar }}
					slotProps={{
						toolbar: {
						showQuickFilter: true,
						},
					}}
				/>
			</div>
			<div className="mt-3">
				<h2>Conclusion</h2>
				<form action="submitForm mt-3">
					<div className="form-floating">
						<textarea className="form-control" name="input" id="floatingTextarea2" style={{ height: '100px' }} onChange={handleChange}></textarea>
						<label htmlFor="floatingTextarea2">Conclusion</label>
					</div>
					<div className="d-flex justify-content-md-end">
						<button type="button" className="btn btn-primary mt-5" onClick={handleGenerate}>Export</button>
					</div>
				</form>
			</div>
		</>
	)
}
