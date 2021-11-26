import { createContext, ReactNode, useContext } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "react-query";
import { toast } from "react-toastify";

import useAuth from "../contexts/auth";
import meService from "../services/me";
import taskService from "../services/task";

interface ApartmentContextType {
  isLoading: boolean;
  error: unknown;
  apartment: Apartment | "" | undefined;
  setApartment: (x: Apartment | "") => void;
  invalidateApartment: () => void;
  deleteTaskMutation: UseMutationResult<
    never,
    unknown,
    number,
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
    (taskId: number) => taskService.deleteOne(authState.token, taskId),
    {
      onMutate: async (taskId: number) => {
        cancelApartmentQueries();
        const apartment = data as Apartment;
        const updatedTaskRequests = apartment.task_requests.filter(
          (taskRequest) => taskRequest.task.id !== taskId,
        );
        const updatedTaskAssignments = apartment.task_assignments.filter(
          (taskAssignment) => taskAssignment.task.id !== taskId,
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
        if (context?.previousApartment) {
          const { task_requests, task_assignments } = context.previousApartment;
          const tasks = [
            ...task_requests.map((taskRequest) => taskRequest.task),
            ...task_assignments.map((taskAssignment) => taskAssignment.task),
          ];
          const deletedTask = tasks.find((task) => task.id === variables);
          if (deletedTask) {
            console.log("Delete task id", variables, deletedTask.id);
            toast.success(`Delete task ${deletedTask?.name}`, {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        }
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
