import { Route, Routes as ReactRoutes } from "react-router-dom";
import Home from "@/Home";
import { AgreementOnboarding } from "@/AgreementOnboarding.tsx";
import { NewDbProvider } from "@/NewDbProvider";
import { UserAgreements } from "@/UserAgreements";
import { ProviderDashboard } from "@/ProviderDashboard";

export default function Routes() {
  return (
    <ReactRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/getDbProvider" element={<AgreementOnboarding />} />
      <Route path="/getUserAgreements" element={<UserAgreements />} />
      <Route path="/newDbProvider" element={<NewDbProvider />} />
      <Route path="/providerDashboard" element={<ProviderDashboard />} />
    </ReactRoutes>
  );
}
