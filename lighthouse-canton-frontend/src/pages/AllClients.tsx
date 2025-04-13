import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AllClientsResponse } from "@/lib/types";
import AllClientsDataTable from "@/components/AllClientsDataTable";
import { VITE_REACT_APP_API_URL } from "@/lib/constants";

const fetchClients = async () => {
  const response = await axios.get(`${VITE_REACT_APP_API_URL}/clients`);
  return response.data as AllClientsResponse;
};

const AllClients: React.FC = () => {
  const {
    data: clients = { success: false, data: [] } as AllClientsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
    retry: false,
    refetchInterval: 5000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) {
    console.error("Error fetching clients:", error);
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Clients</h1>
      <AllClientsDataTable clients={clients.data} />
    </div>
  );
};

export default AllClients;
