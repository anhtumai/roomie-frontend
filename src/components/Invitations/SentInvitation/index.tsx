import { Button } from "@mui/material";

import "../style.css";

function SentInvitation({
  invitation,
  handleDelete,
}: {
  invitation: Invitation;
  handleDelete: (id: number) => void;
}) {
  return (
    <div className="invitation">
      <p>
        You sent an invitation to {invitation.invitee.username} (
        {invitation.invitee.name}){" "}
      </p>
      <div className="invitation__button-wrapper invitation__cancel-button">
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleDelete(invitation.id)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default SentInvitation;
