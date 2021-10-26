import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useQueryClient,
  useMutation,
  UseMutationResult,
} from "react-query";
import { toast } from "react-toastify";

import useAuth from "../contexts/auth";
import meService from "../services/me";

interface ApartmentContextType {
  isLoading: boolean;
  error: unknown;
  apartment: Apartment | "" | undefined;
  leaveApartmentMutation: UseMutationResult<
    never,
    unknown,
    void,
    {
      previousApartment: Apartment | "" | undefined;
    }
  >;
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
  const leaveApartmentMutation = useMutation(
    () => meService.deleteApartment(authState.token),
    {
      onMutate: async () => {
        await queryClient.cancelQueries("apartment");
        const previousApartment = queryClient.getQueryData<Apartment | "">(
          "apartment",
        );

        if (previousApartment !== undefined) {
          queryClient.setQueryData("apartment", "");
        }

        return { previousApartment };
      },
      onError: (err, variables, context) => {
        console.log(err);
        if (context?.previousApartment) {
          queryClient.setQueryData<Apartment | "">(
            "apartment",
            context.previousApartment,
          );
        }
        toast.error("Fail to leave apartment", {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries("apartment");
      },
    },
  );
  return (
    <ApartmentContext.Provider
      value={{
        isLoading,
        error,
        apartment: data,
        leaveApartmentMutation,
      }}
    >
      {children}
    </ApartmentContext.Provider>
  );
}

export default function useApartment() {
  return useContext(ApartmentContext);
}
