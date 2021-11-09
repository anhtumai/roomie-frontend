import axios from "axios";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/accounts`;

async function create(account: Account) {
  const response = await axios.post(baseUrl, account);
  return response.data;
}

const accountService = {
  create,
};

export default accountService;
