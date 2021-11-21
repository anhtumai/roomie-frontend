import { useState } from "react";

import { useHistory } from "react-router-dom";

import { IconButton, Button } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import RenameDialog from "./RenameDialog";
import MemberDisplay from "../TaskDetail/MemberDisplay";

import useAuth from "../../contexts/auth";

import "./style.css";

function ApartmentDetail({ apartment }: { apartment: Apartment }) {
  const history = useHistory();
  const { authState } = useAuth() as { authState: UserWithToken };

  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const isAdmin = authState.id === apartment.admin.id;

  function handleRename() {
    setOpenRenameDialog(true);
  }

  async function handleRemoveMember(memberId: number) {
    console.log("hihihaha");
  }

  return (
    <div className="apartment-detail">
      <div
        style={{
          marginLeft: "1.5rem",
        }}
      >
        <div className="apartment-detail__header">
          <h2>{apartment.name}</h2>
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
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
        </div>
      </div>
      <RenameDialog
        open={openRenameDialog}
        setOpen={setOpenRenameDialog}
        apartment={apartment}
      />
    </div>
  );
}

export default ApartmentDetail;
