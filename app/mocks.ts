import { GridColDef, GridRowsProp } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
	{ 	field: 'color',
		headerName: 'Color',
		width: 150,
		editable: true,
		type: 'singleSelect',
		valueOptions: ['OK', 'Warning', 'Danger'],
	},
	{ field: 'col1', headerName: 'Index', width: 150 },
	{ field: 'col2', headerName: 'Chrom', width: 150 },
	{ field: 'col3', headerName: 'Pos', width: 150 },
	{ field: 'col4', headerName: 'Coverage', width: 150 },
	{ field: 'col5', headerName: 'Ref', width: 150 },
	{ field: 'col6', headerName: 'Mutant Allele Frequency', width: 150 },
	{ field: 'col7', headerName: 'Ins%', width: 150 },
	{ field: 'col8', headerName: 'Del%', width: 150 },
	{ field: 'col9', headerName: 'Overall Score', width: 150 },
	{ field: 'col10', headerName: 'Mutation Call:Genomic', width: 150 },
];

export const rows: GridRowsProp = [{ id: 1, col1: 'Lorem', col2: 'ipsum', col3: 'Lorem', col4: 'ipsum', col5: 'Lorem', col6: 'ipsum', col7: 'Lorem', col8: 'ipsum', col9: 'Lorem', col10: 'ipsum' }];
