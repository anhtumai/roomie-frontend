import { useState } from "react";

import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { IconButton, Button } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import RenameDialog from "./RenameDialog";
import MemberDisplay from "components/TaskDetail/MemberDisplay";

import useAuth from "contexts/auth";
import useApartment from "contexts/apartment";
import meService from "services/me";

import "./style.css";

function ApartmentDetail({ apartment }: { apartment: Apartment }) {
  const history = useHistory();
  const { authState } = useAuth() as { authState: UserWithToken };
  const { invalidateApartment } = useApartment();

  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const isAdmin = authState.id === apartment.admin.id;

  function handleRename() {
    setOpenRenameDialog(true);
  }

  async function handleRemoveMember(member: { id: number; username: string }) {
    const decision = window.confirm(`Remove member ${member.username} ?`);
    if (!decision) return;
    try {
      await meService.removeMember(authState.token, member.id);
      toast.success(`Remove member ${member.username}`, {
        position: toast.POSITION.TOP_CENTER,
      });
      invalidateApartment();
    } catch (err) {
      console.log(err);
      const errMessage = `Fail to remove member ${member.username}`;
      toast.error(errMessage, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  return (
    <div className="apartment-detail">
      <div className="apartment-detail__header">
        <div
          style={{
            flexGrow: 1,
          }}
        ></div>
        {isAdmin && (
          <IconButton onClick={handleRename}>
            <EditIcon htmlColor="#505f78" />
            <span>Rename</span>
          </IconButton>
        )}
        <IconButton onClick={() => history.goBack()}>
          <KeyboardReturnIcon htmlColor="#505f78" />
          <span>Go back</span>
        </IconButton>
      </div>
      <h2>{apartment.name}</h2>
      <div>
        <h4>Admin</h4>
        <MemberDisplay member={apartment.admin} />
        <h4>Normal Members</h4>
        {apartment.members
          .filter((member) => member.id !== apartment.admin.id)
          .map((member) => (
            <div
              key={member.id}
              className="apartment-detail__member-display-wrapper"
            >
              <div className="apartment-detail__member-display">
                <MemberDisplay member={member} />
              </div>
              {isAdmin && (
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleRemoveMember(member)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
      </div>
      <RenameDialog open={openRenameDialog} setOpen={setOpenRenameDialog} />
    </div>
  );
}

export default ApartmentDetail;
