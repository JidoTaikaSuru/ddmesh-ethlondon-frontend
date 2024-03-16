import { BrowserRouter, Route, Routes as ReactRoutes } from 'react-router-dom';
import Home from "@/Home";
import {DbProviderOnboarding} from "@/DbProviderOnboarding";
import {NewDbProvider} from "@/NewDbProvider";
import {DeployDbProvider} from "@/DeployDbProvider";

export default function Routes() {

	return (
		<BrowserRouter>
			<ReactRoutes>
				<Route path='/' element={<Home/>}/>
				<Route path='/getDbProvider' element={<DbProviderOnboarding/>}/>
				<Route path='/deployDbProvider' element={<DeployDbProvider/>}/>
				<Route path='/newDbProvider' element={<NewDbProvider/>}/>
			</ReactRoutes>
		</BrowserRouter>
	)
}
