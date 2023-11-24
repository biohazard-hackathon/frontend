import React, { FC, useState } from "react"

interface Props {

}

export const Analyse: FC<Props> = () => {
	const [formData, setFormData] = useState({})

	const handleChange = (event: any) => {
		console.log('event', event);
		const {name, value} = event.target;
		setFormData((prevFormData) => ({...prevFormData, [name]: value}))
	}

	const handleSubmit = () => {
		console.log('formData', formData)
	}

	return (
		<>
			<h1>Analyse</h1>
			<form action="submitForm">
				<div className="form-floating">
					<textarea className="form-control" name="input" id="floatingTextarea2" style={{ height: '100px' }} onChange={handleChange}></textarea>
					<label htmlFor="floatingTextarea2">Input text</label>
				</div>
				<div className="d-flex justify-content-md-end">
					<button type="button" className="btn btn-primary mt-5" onClick={handleSubmit}>Analyse</button>
				</div>
			</form>

			<div className="container">
				{Object.values(formData).map((item) => <div className="">{item}</div>)}
			</div>
		</>
	)
}
