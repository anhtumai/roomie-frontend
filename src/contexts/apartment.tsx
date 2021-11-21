import { createContext, ReactNode, useContext } from "react";
import { useQuery } from "react-query";

import useAuth from "../contexts/auth";
import meService from "../services/me";

interface ApartmentContextType {
  isLoading: boolean;
  error: unknown;
  apartment: Apartment | "" | undefined;
}

const ApartmentContext = createContext<ApartmentContextType>(
  {} as ApartmentContextType,
);

export function ApartmentProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { authState } = useAuth() as { authState: UserWithToken };
  const { isLoading, error, data } = useQuery("apartment", () =>
    meService.getApartment(authState.token),
  );

  return (
    <ApartmentContext.Provider
      value={{
        isLoading,
        error,
        apartment: data,
      }}
    >
      {children}
    </ApartmentContext.Provider>
  );
}

export default function useApartment() {
  return useContext(ApartmentContext);
}
