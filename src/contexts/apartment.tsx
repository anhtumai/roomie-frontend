import { createContext, ReactNode, useContext } from "react";
import { useQuery, useQueryClient } from "react-query";

import useAuth from "../contexts/auth";
import meService from "../services/me";

interface ApartmentContextType {
  isLoading: boolean;
  error: unknown;
  apartment: Apartment | "" | undefined;
  setApartment: (x: Apartment | "") => void;
  invalidateApartment: () => void;
}

const ApartmentContext = createContext<ApartmentContextType>(
  {} as ApartmentContextType,
);

export function ApartmentProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const queryClient = useQueryClient();
  const { authState } = useAuth() as { authState: UserWithToken };
  const { isLoading, error, data } = useQuery("apartment", () =>
    meService.getApartment(authState.token),
  );

  function setApartment(updatedApartment: Apartment | "") {
    queryClient.setQueryData("apartment", updatedApartment);
  }

  function invalidateApartment() {
    queryClient.invalidateQueries("apartment");
  }

  return (
    <ApartmentContext.Provider
      value={{
        isLoading,
        error,
        apartment: data,
        setApartment,
        invalidateApartment,
      }}
    >
      {children}
    </ApartmentContext.Provider>
  );
}

export default function useApartment() {
  return useContext(ApartmentContext);
}
