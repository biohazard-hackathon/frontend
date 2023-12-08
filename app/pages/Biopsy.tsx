import React, { FC } from "react"
import { DataTable } from "../components/DataTable"


interface Props {

}

export const Biopsy: FC<Props> = ({}) => {

	return (
		<div className="container">
			<h1 className="my-2">Parsed data</h1>
			<DataTable />
		</div>
	)
}
