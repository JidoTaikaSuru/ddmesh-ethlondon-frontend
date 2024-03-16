import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          ddMesh
        </h2>
      </div>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Decentralized Database marketplace
      </p>
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        "Like filecoin but for structured databases"
      </blockquote>
      <div>
        <Button onClick={() => navigate(`/getDbProvider`)}>Get a DB</Button>
        <Button onClick={() => navigate(`/getUserAgreements`)}>
          User Agreements
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/newDbProvider`)}>
          Become a Provider
        </Button>
      </div>
    </>
  );
}
