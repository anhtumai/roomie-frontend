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

async function deleteById(token: string, invitationId: number) {
  const config = constructConfig(token);
  const response = await axios.delete(`${baseUrl}/${invitationId}`, config);
  return response.data;
}

async function accept(token: string, invitationId: number) {
  const config = constructConfig(token);
  const response = await axios.post(
    `${baseUrl}/${invitationId}/accept`,
    undefined,
    config,
  );
  return response.data;
}

async function reject(token: string, invitationId: number) {
  const config = constructConfig(token);
  const response = await axios.post(
    `${baseUrl}/${invitationId}/reject`,
    undefined,
    config,
  );
  return response.data;
}

const invitationService = {
  create,
  deleteById,
  accept,
  reject,
};

export default invitationService;
