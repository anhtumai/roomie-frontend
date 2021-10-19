import axios from "axios";

import { constructConfig } from "./utils";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/accounts`;

async function create(token: string, account: Account) {
  const config = constructConfig(token);
  const response = await axios.post(baseUrl, account, config);
  return response.data;
}

const accountService = {
  create,
};

export default accountService;
