import axios from "axios";

import { constructConfig } from "./utils";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/apartments`;

async function create(token: string, apartmentName: string) {
  const config = constructConfig(token);
  const response = await axios.post(baseUrl, { name: apartmentName }, config);
  return response.data;
}

const apartmentService = {
  create,
};

export default apartmentService;
