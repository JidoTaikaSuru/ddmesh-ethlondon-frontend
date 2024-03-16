import { BrowserRouter, Route, Routes as ReactRoutes } from 'react-router-dom';
import Home from "@/Home";
import {DbProviderOnboarding} from "@/DbProviderOnboarding";
import {NewDbProvider} from "@/NewDbProvider";

export default function Routes() {

	return (
		<BrowserRouter>
			<ReactRoutes>
				<Route path='/' element={<Home/>}/>
				<Route path='/getDbProvider' element={<DbProviderOnboarding/>}/>
				<Route path='/newDbProvider' element={<NewDbProvider/>}/>
			</ReactRoutes>
		</BrowserRouter>
	)
}
