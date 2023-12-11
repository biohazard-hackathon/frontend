import React, { FC, useState } from "react";

interface Props {
	isXls?: boolean;
	setFile?: (file: File) => void;
	selectedFile: File | undefined;
	setFileType: (type: string) => void;
}

export const UploadFile: FC<Props> = ({ setFile, isXls = true, selectedFile, setFileType }) => {

	function readURL(event: any) {
		console.log('event', event)
		console.log('files', event.target.files)

		setFile && setFile(event.target.files[0])
		setFileType(isXls ? 'excel' : 'fasta');
		// if (input.files && input.files[0]) {
		// 	var reader = new FileReader();

		// 	reader.onload = function (e) {
		// 		$('#imageResult')
		// 			.attr('src', e.target.result);
		// 	};
		// 	reader.readAsDataURL(input.files[0]);
		// }
	}

	return (
		<section>
			<div className="container p-4">
				<div className="row">
					<div className="mx-auto">
						<div className="p-5 bg-white shadow rounded-lg"><img src={isXls ? "/images/upload_xls.png" : "/images/fasta_file_extension.png"} alt="" className="d-block w-25 mx-auto mb-4" />
							<h6 className="text-center mb-4 text-muted">
								{isXls ? 'You can upload your Excel file' : 'You can upload your FASTA file'}
							</h6>
							<div className="input-group mb-3 px-2 py-2 rounded-pill bg-white shadow-sm">
								<input id="upload" type="file" onChange={readURL} className="form-control border-0" />
								<label id="upload-label" htmlFor="upload" className="font-weight-light text-muted">Choose file</label>
								<div className="input-group-append">
									<label htmlFor="upload" className="btn btn-light m-0 rounded-pill px-4"> <i className="fa fa-cloud-upload mr-2 text-muted"></i><small className="text-uppercase font-weight-bold text-muted">Choose file</small></label>
								</div>
							</div>

							<h6 className="text-center mb-4 text-muted">
								{isXls ? 'Accept only .xls and .xlsx formats' : 'Accept only .xfasta format'}
							</h6>

						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
