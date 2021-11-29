import { createContext, ReactNode, useContext } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "react-query";
import { toast } from "react-toastify";

import useAuth from "contexts/auth";
import meService from "services/me";
import taskService from "services/task";

interface ApartmentContextType {
  isLoading: boolean;
  error: unknown;
  apartment: Apartment | "" | undefined;
  setApartment: (x: Apartment | "") => void;
  invalidateApartment: () => void;
  deleteTaskMutation: UseMutationResult<
    never,
    unknown,
    Task,
    {
      previousApartment: Apartment;
    }
  >;
  cancelApartmentQueries: () => void;
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

  function cancelApartmentQueries() {
    queryClient.cancelQueries("apartment");
  }

  const deleteTaskMutation = useMutation(
    (task: Task) => taskService.deleteOne(authState.token, task.id),
    {
      onMutate: async (task: Task) => {
        cancelApartmentQueries();
        const apartment = data as Apartment;
        const updatedTaskRequests = apartment.task_requests.filter(
          (taskRequest) => taskRequest.task.id !== task.id,
        );
        const updatedTaskAssignments = apartment.task_assignments.filter(
          (taskAssignment) => taskAssignment.task.id !== task.id,
        );
        setApartment({
          ...apartment,
          task_requests: updatedTaskRequests,
          task_assignments: updatedTaskAssignments,
        });

        return { previousApartment: apartment };
      },
      onError: (err, variables, context) => {
        console.log(err);
        if (context?.previousApartment) {
          setApartment(context.previousApartment);
        }
        const errMessage =
          (err as any).response?.data.erro || "Fail to delete task";
        toast.error(errMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      onSuccess: (data, variables, context) => {
        toast.success(`Delete task ${variables.name}`, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      onSettled: (data, error, variables, context) => {
        invalidateApartment();
      },
    },
  );

  return (
    <ApartmentContext.Provider
      value={{
        isLoading,
        error,
        apartment: data,
        setApartment,
        invalidateApartment,
        deleteTaskMutation,
        cancelApartmentQueries,
      }}
    >
      {children}
    </ApartmentContext.Provider>
  );
}

export default function useApartment() {
  return useContext(ApartmentContext);
}
