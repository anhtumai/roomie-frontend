import { Button } from "@mui/material";

import "../style.css";

function ReceivedInvitation({
  invitation,
  handleAccept,
  handleReject,
}: {
  invitation: Invitation;
  handleAccept: (id: number) => Promise<void>;
  handleReject: (id: number) => void;
}) {
  return (
    <div className="invitation">
      <p>
        {invitation.invitor.username} ({invitation.invitor.name}) invites you to{" "}
        {invitation.apartment.name}
      </p>
      <div className="invitation__button-wrapper">
        <Button
          size="small"
          color="success"
          variant="outlined"
          className="invitation__accept-button"
          onClick={() => handleAccept(invitation.id)}
        >
          Accept
        </Button>
        <Button
          size="small"
          color="error"
          variant="outlined"
          className="invitation__reject-button"
          onClick={() => handleReject(invitation.id)}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}

export default ReceivedInvitation;
