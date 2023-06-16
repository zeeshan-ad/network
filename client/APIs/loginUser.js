import APIconfig from '../util/api.config.json';
import { BASE_URL } from '../util/constants';
import axios from 'axios';


export const loginUser = async ({ email, password }) => {
  const { login_user } = APIconfig;

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BASE_URL}${login_user}?email=${email}&password=${password}`,
    headers: {
      'Content-Type': 'application/json'
    },
  };


  const res = await axios.request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error?.response?.data

    });

  return res;
}


