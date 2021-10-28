import { Badge, IconButton, Tooltip } from "@mui/material";
import AssignmentTwoToneIcon from "@mui/icons-material/AssignmentTwoTone";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";

import { useHistory } from "react-router";

import useApartment from "../../contexts/apartment";
import useInvitations from "../../contexts/invitations";
import useAuth from "../../contexts/auth";

function NotificationBadge() {
  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment } = useApartment();
  const { invitationCollection } = useInvitations();

  const history = useHistory();

  if (apartment === undefined || invitationCollection === undefined)
    return null;

  if (apartment === "") {
    const receivedNum = invitationCollection.received.length;
    const title = `You have ${receivedNum} invitations`;
    return (
      <Tooltip
        title={title}
        placement="bottom-start"
        onClick={() => history.push("/invitations")}
      >
        <IconButton>
          <Badge badgeContent={receivedNum}>
            <PersonAddAltTwoToneIcon />
          </Badge>
        </IconButton>
      </Tooltip>
    );
  }

  const title = "Task Request";
  const taskRequestNum = apartment.task_requests.filter((taskRequest) =>
    taskRequest.requests.find(
      (request) => request.assigner.id === authState.id,
    ),
  ).length;
  return (
    <Tooltip
      title={title}
      placement="bottom-start"
      onClick={() => history.push("/task_requests")}
    >
      <IconButton>
        <Badge badgeContent={taskRequestNum}>
          <AssignmentTwoToneIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}

export default NotificationBadge;
