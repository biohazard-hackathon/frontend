import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router";

interface Props {

}
export const AfterLogin: FC<Props> = () => {
	const navigate = useNavigate();

	useEffect(() => {
		navigate('/analyse')
	})
	return (
		<></>
	)
}
