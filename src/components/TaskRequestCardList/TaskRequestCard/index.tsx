import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-query";

import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import IconButton from "@mui/material/IconButton";

import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";

import useAuth from "contexts/auth";
import useApartment from "contexts/apartment";
import taskService from "services/task";
import { getAbbreviation } from "utils/common";

import "./style.css";

const stateDisplay = {
  accepted: <span className="task-request-card__accepted-span">Accepted</span>,
  rejected: <span className="task-request-card__rejected-span">Rejected</span>,
  pending: <span className="task-request-card__pending-span">Pending</span>,
};

function TaskRequestCard({ taskRequest }: { taskRequest: TaskRequest }) {
  const history = useHistory();

  const { authState } = useAuth() as { authState: UserWithToken };
  const apartmentContext = useApartment();
  const { apartment } = apartmentContext as {
    apartment: Apartment;
  };

  const {
    setApartment,
    invalidateApartment,
    deleteTaskMutation,
    cancelApartmentQueries,
  } = apartmentContext;

  const { task, requests } = taskRequest;
  const assigneeNames = requests.map((_request) => _request.assignee.name);

  const taskCreator = apartment.members.find(
    (member) => member.id === taskRequest.task.creator_id,
  );

  const taskRequestId = Number(
    taskRequest.requests.find((request) => request.assignee.id === authState.id)
      ?.id,
  );
  const requestState = requests.find(
    (_request) => _request.assignee.username === authState.username,
  )?.state as RequestState;

  const acceptTaskMutation = useMutation(
    () => taskService.accept(authState.token, taskRequestId),
    {
      onMutate: async () => {
        cancelApartmentQueries();
        const acceptedState = "accepted" as const;
        const updatedRequests = taskRequest.requests.map((_request) =>
          _request.id === taskRequestId
            ? { ..._request, state: acceptedState }
            : _request,
        );
        const updatedTaskRequests: TaskRequest[] = apartment.task_requests.map(
          (element) =>
            element.task.id === taskRequest.task.id
              ? { ...element, requests: updatedRequests }
              : element,
        );
        setApartment({ ...apartment, task_requests: updatedTaskRequests });
        return { previousApartment: apartment };
      },

      onError: (err, variables, context) => {
        console.log(err);
        if (context?.previousApartment) {
          setApartment(context.previousApartment);
        }
        const errMessage =
          (err as any).response?.data.erro || "Fail to accept task request";
        toast.error(errMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
    },
  );

  const rejectTaskMutation = useMutation(
    () => taskService.reject(authState.token, taskRequestId),
    {
      onMutate: async () => {
        cancelApartmentQueries();
        const rejectedState = "rejected" as const;
        const updatedRequests = taskRequest.requests.map((_request) =>
          _request.id === taskRequestId
            ? { ..._request, state: rejectedState }
            : _request,
        );
        const updatedTaskRequests: TaskRequest[] = apartment.task_requests.map(
          (element) =>
            element.task.id === taskRequest.task.id
              ? { ...element, requests: updatedRequests }
              : element,
        );
        setApartment({ ...apartment, task_requests: updatedTaskRequests });
        return { previousApartment: apartment };
      },

      onError: (err, variables, context) => {
        console.log(err);
        if (context?.previousApartment) {
          setApartment(context.previousApartment);
        }
        const errMessage =
          (err as any).response?.data.erro || "Fail to reject task request";
        toast.error(errMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      onSettled: (data, error, variables, context) => {
        invalidateApartment();
      },
    },
  );

  function handleRedirectTaskPage() {
    history.push(`/tasks/${task.id}`);
  }

  async function handleDelete() {
    const decision = window.confirm(`Delete task ${task.name} ?`);
    if (decision) {
      deleteTaskMutation.mutate(task);
    }
  }

  function handleAccept() {
    acceptTaskMutation.mutate();
  }

  function handleReject() {
    rejectTaskMutation.mutate();
  }
  return (
    <div className="task-request-card">
      <div className="task-request-card__header">
        <div className="task-request-card__titles">
          <div className="task-request-card__title">
            {stateDisplay[requestState]}: {task.name}
          </div>
          <div className="task-request-card__sub-title">
            By {taskCreator?.name}
          </div>
        </div>
        <div className="task-request-card__icon-buttons">
          {(taskCreator?.id === authState.id ||
            apartment.admin.id === authState.id) && (
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          )}
          <IconButton onClick={handleRedirectTaskPage}>
            <InfoIcon />
          </IconButton>
        </div>
      </div>
      <div className="task-request-card__content">
        <AvatarGroup>
          {assigneeNames.map((name) => (
            <Avatar
              key={name}
              sx={{ width: "2rem", height: "2rem", fontSize: "1rem" }}
            >
              {getAbbreviation(name)}
            </Avatar>
          ))}
        </AvatarGroup>
        <div className="task-request-card__action">
          <Button
            size="small"
            color="success"
            variant="outlined"
            className="invitation__accept-button"
            onClick={handleAccept}
            disabled={requestState === "accepted"}
          >
            Accept
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            className="invitation__reject-button"
            onClick={handleReject}
            disabled={requestState === "rejected"}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TaskRequestCard;
