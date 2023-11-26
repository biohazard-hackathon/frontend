import React from "react";
import { rows, columns } from "../mocks";
import { DataGrid } from '@mui/x-data-grid';

export const DataTable = () => {

	return (
		<DataGrid
			rows={rows}
			columns={columns}
			getRowClassName={(params) => {console.log('params', params); return `bg-danger`}}
		/>
	)
}
