import {Route, Routes as ReactRoutes} from "react-router-dom";
import Home from "@/Home";
import { DbProviderOnboarding } from "@/DbProviderOnboarding";
import { NewDbProvider } from "@/NewDbProvider";
import { DeployDbProvider } from "@/DeployDbProvider";
import { UserAgreements } from "@/UserAgreements";
import {ProviderDashboard} from "@/ProviderDashboard";

export default function Routes() {
  return (
    <ReactRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/getDbProvider" element={<DbProviderOnboarding />} />
        <Route path="/getUserAgreements" element={<UserAgreements />} />
        <Route path="/deployDbProvider" element={<DeployDbProvider />} />
        <Route path="/newDbProvider" element={<NewDbProvider />} />
        <Route path="/providerDashboard" element={<ProviderDashboard />} />
      </ReactRoutes>

  );
}
