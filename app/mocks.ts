import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { AnnotationStatus } from './types';
import { Link } from 'react-router-dom';

const cols = [
	'annotation',
	'id',
	'allele',
	'aminoAcidChange',
	'averageQuality',
	'chromosome',
	'codingRegionChange',
	'count',
	'coverage',
	'exonNumber',
	'forwardReverseBalance',
	'frequency',
	'geneName',
	'length',
	'reference',
	'region',
	'type',
	'typeOfMutation',
	'comment'
];

export const columns: GridColDef[] = [
	{ 	field: 'annotation',
		headerName: 'Annotation',

		editable: true,
		type: 'singleSelect',
		valueOptions: Object.keys(AnnotationStatus),
	},
	{ field: 'id', headerName: 'ID'},
	{ field: 'allele', headerName: 'Allele'},
	{ field: 'aminoAcidChange', headerName: 'AminoAcidChange'},
	{ field: 'averageQuality', headerName: 'AverageQuality'},
	{ field: 'chromosome', headerName: 'Chromosome'},
	{
		field: 'codingRegionChange',
		headerName: 'CodingRegionChange',
		width: 150,
		renderCell: (params) => {return params.value},
	 },
	{ field: 'count', headerName: 'Count'},
	{ field: 'coverage', headerName: 'Coverage'},
	{ field: 'exonNumber', headerName: 'ExonNumber'},
	{ field: 'forwardReverseBalance', headerName: 'ForwardReverseBalance'},
	{ field: 'frequency', headerName: 'Frequency'},
	{ field: 'geneName', headerName: 'GeneName'},
	{ field: 'length', headerName: 'Length'},
	{ field: 'reference', headerName: 'Reference'},
	{ field: 'region', headerName: 'Region'},
	{ field: 'type', headerName: 'Type'},
	{ field: 'typeOfMutation', headerName: 'TypeOfMutation'},
	{
		field: 'comment',
		headerName: 'TypeOfMutation',
		editable: true,
		width: 150
	},
];


// export const rows: GridRowsProp = [
// 	{
// 		id: 1,
// 		allele: 'Lorem',
// 		aminoAcidChange: 'ipsum', col3: 'Lorem', col4: 'ipsum', col5: 'Lorem', col6: 'ipsum', col7: 'Lorem', col8: 'ipsum', col9: 'Lorem', col10: 'ipsum' }
// ];
