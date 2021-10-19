import axios from "axios";

import { constructConfig } from "./utils";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/invitations`;

async function create(token: string, inviteeUsername: string) {
  const config = constructConfig(token);
  const response = await axios.post(
    baseUrl,
    { username: inviteeUsername },
    config,
  );
  return response.data;
}

const invitationService = {
  create,
};

export default invitationService;
