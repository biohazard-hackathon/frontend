import React, { FC, useEffect, useState } from "react"
import BackendApi from "../api/BackendApi";
import { IBiopsyResult } from "../types";

interface Props {

}

export const BiopsyList: FC<Props> = ({}) => {

	const [biopsyResults, setBiopsyResults] = useState<IBiopsyResult[]>()

	async function getResults() {
		let reports: IBiopsyResult[] = [];
		try {
			reports = await BackendApi.listUniqueReports();

			if (!biopsyResults?.length) {
				setBiopsyResults(reports);
			}
		} catch (error) {
			console.log(error);
		}

		return reports;
	}

	useEffect(() => {
		getResults()
	}, [])

	console.log('biopsyResults', biopsyResults)

	return (
		<div className="container">
			<h1 className="my-5">Biopsies</h1>
			<div className="row">
				<div className="col-md-12">
					<div className="mt-3">
						<ul className="list list-inline">
							{biopsyResults?.map(biopsyResult => (
								<li className="d-flex justify-content-between">
									<div className="d-flex flex-row align-items-center">
										<div className="ml-2">
											<h6 className="mb-0">{biopsyResult.blockId}</h6>
											<div className="d-flex flex-row mt-1 text-black-50 date-time">
												<div><i className="fa fa-calendar-o"></i><span className="ml-2">ID: {biopsyResult.id}</span></div>
											</div>
										</div>
									</div>
									<div className="d-flex flex-row align-items-center">
										<div className="d-flex flex-column mr-2">
											<div className="profile-image">
											<a href={`/biopsies/${biopsyResult.id}`} className="btn btn-info" role="button">Show detail</a>
											</div>
											{/* <span className="date-time">11/4/2020 12:55</span> */}
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}
