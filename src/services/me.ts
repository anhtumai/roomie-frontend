import axios from "axios";

import { constructConfig } from "./utils";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/me`;

async function getProfile(token: string): Promise<User> {
  const config = constructConfig(token);
  const response = await axios.get(baseUrl, config);
  return response.data;
}

async function getApartment(token: string): Promise<Apartment | ""> {
  const config = constructConfig(token);
  const response = await axios.get(`${baseUrl}/apartment`, config);
  return response.data;
}

async function deleteApartment(token: string) {
  const config = constructConfig(token);
  const response = await axios.delete(`${baseUrl}/apartment`, config);
  return response.data;
}

async function getInvitations(token: string): Promise<InvitationCollection> {
  const config = constructConfig(token);
  const response = await axios.get(`${baseUrl}/invitations`, config);
  return response.data;
}

async function removeMember(token: string, memberId: number) {
  const config = constructConfig(token);
  const response = await axios.delete(
    `${baseUrl}/apartment/members/${memberId}`,
    config,
  );
  return response.data;
}

const meService = {
  getProfile,
  getApartment,
  deleteApartment,
  getInvitations,
  removeMember,
};

export default meService;
