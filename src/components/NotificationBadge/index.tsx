import { Badge, IconButton, Tooltip } from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";

import { useHistory } from "react-router";

import useApartment from "../../contexts/apartment";
import useInvitations from "../../contexts/invitations";
import useAuth from "../../contexts/auth";

const badgeSx = {
  color: "white",
};

const tooltipSx = {
  marginRight: "0.3rem",
};

function NotificationBadge() {
  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment } = useApartment();
  const { invitationCollection } = useInvitations();

  const history = useHistory();

  if (apartment === undefined || invitationCollection === undefined)
    return null;

  if (apartment === "") {
    const receivedNum = invitationCollection.received.length;
    const title = `You have ${receivedNum} ${
      receivedNum > 1 ? "invitations" : "invitation"
    }`;
    return (
      <Tooltip
        title={title}
        placement="bottom-start"
        sx={tooltipSx}
        onClick={() => history.push("/invitations")}
      >
        <IconButton>
          <Badge badgeContent={receivedNum} sx={badgeSx}>
            <PersonAddAltTwoToneIcon />
          </Badge>
        </IconButton>
      </Tooltip>
    );
  }

  const taskRequestNum = apartment.task_requests.filter((taskRequest) =>
    taskRequest.requests.find(
      (request) => request.assigner.id === authState.id,
    ),
  ).length;
  const title = `You have ${taskRequestNum} task ${
    taskRequestNum > 1 ? "requests" : "request"
  }`;

  return (
    <Tooltip
      title={title}
      placement="bottom-start"
      onClick={() => history.push("/task_requests")}
      sx={tooltipSx}
    >
      <IconButton>
        <Badge badgeContent={taskRequestNum} sx={badgeSx}>
          <AssignmentOutlinedIcon htmlColor="white" />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}

export default NotificationBadge;
