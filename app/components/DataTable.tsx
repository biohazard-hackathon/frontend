import React, {FC, useEffect, useState} from "react";
import {columns} from "../tableConfig";
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {Annotation, AnnotationStatus, IBiopsyResult, IGeneInfo} from "../types";
import BackendApi from "../api/BackendApi";
import {useParams} from "react-router-dom";

interface Props {
}

export const DataTable: FC<Props> = () => {
	const [biopsy, setBiopsy] = useState<IBiopsyResult>();
	const [rows, setRows] = useState<IGeneInfo[]>([]);
	const [formData, setFormData] = useState({});
	const params = useParams();

	const uuid = params.id;
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const codingRegionChange = urlParams.get('codingRegionChange');

	async function handleUpload() {
		try {
			if (!rows?.length && uuid) {
				const bio = await BackendApi.getBiopsyResult(uuid);

				if (bio) {
					const bb: { [key: string]: IGeneInfo } = JSON.parse(bio.results! as unknown as string);
					console.log('bb', bb);

					setBiopsy({...bio, results: bb});
					const codingRegionChanges = Object.keys(bio?.results);
					const relevantReportsData = await BackendApi.getRelevantReports(codingRegionChanges);
					const mutationsWithReports = relevantReportsData.map(mutation => mutation.codingRegionChange);

					setRows(Object.values(bb).map((item, index) => {
						if (mutationsWithReports.includes(item.codingRegionChange)) {
							return ({
								annotation: Annotation.NONE,
								id: index + 1, ...item,
								relevantReports: relevantReportsData.filter(report => report.codingRegionChange === item.codingRegionChange),
							});
						}
						return ({annotation: undefined, id: index + 1, ...item, relevantReports: []});
					}));
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		handleUpload();
	}, []);

	const handleChange = (event: any) => {
		console.log('event', event);
		const {name, value} = event.target;
		setFormData((prevFormData) => ({...prevFormData, [name]: value}));
	};

	const handleGenerate = async () => {
		// console.log('formData', formData);
	};

	console.log('biopsy', biopsy);
	// console.log('rows', rows);

	return (
		<>
			<div className="bg-white shadow rounded-lg p-5 mx-5">
				{!rows.length ?
					<p>...Loading</p> :
					<DataGrid
						rows={rows}
						columns={columns}
						rowHeight={25}
						getRowClassName={(params) => {
							return `color-table-${AnnotationStatus[params.row.annotation as Exclude<Annotation, Annotation.NONE>]}` ?? '';
						}}
						getCellClassName={(params) => {
							return params.value === 'Warning' ? 'bg-warning' : '';
						}}

						slots={{toolbar: GridToolbar}}
						slotProps={{
							toolbar: {
								showQuickFilter: true,
							},
						}}
						initialState={{
							filter: {
								...(codingRegionChange && {filterModel: {
									items: [{ field: 'codingRegionChange', operator: 'equals', value: codingRegionChange }],
							  }}),
							},
						  }}
					/>
				}
			</div>
			<div className="mx-5 mt-3">
				<h2>Conclusion</h2>
				<form action="submitForm mt-3">
					<div className="form-floating">
						<textarea className="form-control" name="input" id="floatingTextarea2" style={{height: '100px'}}
								  onChange={handleChange}></textarea>
						<label htmlFor="floatingTextarea2">Conclusion</label>
					</div>
					<div className="d-flex justify-content-md-end">
						<button type="button" className="btn btn-primary mt-5" onClick={handleGenerate}>Export</button>
					</div>
				</form>
			</div>
		</>
	);
};
