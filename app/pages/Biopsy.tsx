import React, { FC } from "react"
import { DataTable } from "../components/DataTable"


interface Props {

}

export const Biopsy: FC<Props> = ({}) => {

	return (
		<>
		<h1>Your parsed data</h1>
		<DataTable />
		</>
	)
}
