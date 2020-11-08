import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// Pages
import CreateDenunciation from "./pages/CreateDenunciation";

function Routes() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={CreateDenunciation} />
			</Switch>
		</BrowserRouter>
	);
}

export default Routes;
