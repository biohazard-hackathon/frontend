import {useLocation, useNavigate, useParams} from 'react-router-dom';
import React, {ComponentType} from 'react';
import {NavigateFunction} from 'react-router/dist/lib/hooks';
import * as H from 'history';

interface Router {
	location: H.Location,
	navigate: NavigateFunction,
	params: Record<string, string>,
}

export interface WithRouter {
	router: Router,
}

export default function withRouter(Component: ComponentType<any>) {
	function ComponentWithRouterProp(props: any) {
		const location = useLocation();
		const navigate = useNavigate();
		const params = useParams();

		return <Component {...props} router={{ location, navigate, params } as Router}/>;
	}

	return ComponentWithRouterProp;
}
