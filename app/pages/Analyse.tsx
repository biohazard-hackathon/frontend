import React, { FC, useState } from "react"

interface Props {

}

export const Analyse: FC<Props> = () => {
	const [formData, setFormData] = useState({})

	const handleChange = (event: any) => {
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
					<textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: '100px' }} onChange={handleChange}></textarea>
					<label htmlFor="floatingTextarea2">Input text</label>
				</div>
				<button type="button" className="btn btn-primary" onClick={handleSubmit}>Primary</button>
			</form>
		</>
	)
}
