import { Avatar } from "@mui/material";

import { getAbbreviation } from "../../../utils/common";

import "./style.css";

function MemberDisplay({ member }: { member: Member }) {
  const abbreviation = getAbbreviation(member.name);
  return (
    <div className="member-display">
      <Avatar sx={{ width: 28, height: 28 }} className="member-display__avatar">
        {abbreviation}
      </Avatar>
      <p>{member.name}</p>
    </div>
  );
}

export default MemberDisplay;
