import React, { FC } from "react"
import { DataTable } from "../components/DataTable"


interface Props {

}

export const Biopsy: FC<Props> = ({}) => {

	return (
		<div className="">
			<h1 className="my-5 mx-5">Parsed data</h1>
			<DataTable />
		</div>
	)
}
