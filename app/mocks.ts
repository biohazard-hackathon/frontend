import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { AnnotationStatus } from './types';

export const columns: GridColDef[] = [
	{ 	field: 'annotation',
		headerName: 'Annotation',
		width: 150,
		editable: true,
		type: 'singleSelect',
		valueOptions: Object.keys(AnnotationStatus),
	},
	{ field: 'id', headerName: 'ID', width: 150 },
	{ field: 'allele', headerName: 'Allele', width: 150 },
	{ field: 'aminoAcidChange', headerName: 'AminoAcidChange', width: 150 },
	{ field: 'averageQuality', headerName: 'AverageQuality', width: 150 },
	{ field: 'chromosome', headerName: 'Chromosome', width: 150 },
	{ field: 'codingRegionChange', headerName: 'CodingRegionChange', width: 150 },
	{ field: 'count', headerName: 'Count', width: 150 },
	{ field: 'coverage', headerName: 'Coverage', width: 150 },
	{ field: 'exonNumber', headerName: 'ExonNumber', width: 150 },
	{ field: 'forwardReverseBalance', headerName: 'ForwardReverseBalance', width: 150 },
	{ field: 'frequency', headerName: 'Frequency', width: 150 },
	{ field: 'geneName', headerName: 'GeneName', width: 150 },
	{ field: 'length', headerName: 'Length', width: 150 },
	{ field: 'reference', headerName: 'Reference', width: 150 },
	{ field: 'region', headerName: 'Region', width: 150 },
	{ field: 'type', headerName: 'Type', width: 150 },
	{ field: 'typeOfMutation', headerName: 'TypeOfMutation', width: 150 },
];


// export const rows: GridRowsProp = [
// 	{
// 		id: 1,
// 		allele: 'Lorem',
// 		aminoAcidChange: 'ipsum', col3: 'Lorem', col4: 'ipsum', col5: 'Lorem', col6: 'ipsum', col7: 'Lorem', col8: 'ipsum', col9: 'Lorem', col10: 'ipsum' }
// ];
