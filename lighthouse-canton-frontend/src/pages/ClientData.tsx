import MarginOverviewCard from "@/components/MarginOverviewCard";
import PortfolioOverviewCard from "@/components/PortfolioOverviewCard";
import { PortfolioPieChart } from "@/components/PortfolioPieChart";
import PositionDataTable from "@/components/PositionDataTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { currencyFormatter } from "@/lib/constants";
import { ClientResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import React from "react";
import { useParams, NavLink } from "react-router-dom";

const fetchClientData = async ({
  queryKey,
}: {
  queryKey: (string | undefined)[];
}) => {
  const [, clientId] = queryKey;
  const VITE_REACT_APP_API_URL =
    import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8080/api";
  const response = await axios.get(
    `${VITE_REACT_APP_API_URL}/clients/${clientId}`
  );
  return response.data as ClientResponse;
};

const ClientData: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();

  const {
    data: clientData = { success: false, data: {} } as ClientResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["client", clientId],
    queryFn: fetchClientData,
    enabled: !!clientId,
    retry: false,
    refetchInterval: 5000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) {
    console.error("Error fetching client data:", error);
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <NavLink to="/" className="text-blue-500 hover:underline">
          &larr; Back to Dashboard
        </NavLink>
      </div>
      <h1 className="text-2xl font-bold mb-4">
        Client Profile - {clientData.data.name}
      </h1>
      {clientData.data.marginCallTriggered && (
        <Alert
          variant={"destructive"}
          className="w-full mb-2 border-red-500 bg-red-50"
        >
          <AlertCircle className="h-8 w-8" />
          <AlertTitle className="">Margin Call Triggered</AlertTitle>
          <AlertDescription className="inline font-light">
            Margin shortfall of{" "}
            <span className="font-bold">
              {currencyFormatter.format(clientData.data.marginShortfall)}{" "}
            </span>
            detected. Please take immediate action to resolve this issue.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-3 gap-2 my-4">
        <PortfolioPieChart
          className={"w-full"}
          netEquity={clientData.data.netEquity}
          loanAmount={clientData.data.loanAmount}
        />
        <div className="grid grid-rows-2 gap-2">
          <PortfolioOverviewCard
            portfolioMarketValue={clientData.data.portfolioMarketValue}
            netEquity={clientData.data.netEquity}
            loanAmount={clientData.data.loanAmount}
            marketValueChange={clientData.data.marketValueChange}
          />
          <MarginOverviewCard
            marginRequirement={clientData.data.totalMarginRequirement}
            marginShortfall={clientData.data.marginShortfall}
            marginCallTriggered={clientData.data.marginCallTriggered}
          />
        </div>
      </div>
      <PositionDataTable clientId={clientId} />
    </div>
  );
};

export default ClientData;
