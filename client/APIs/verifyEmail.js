import APIconfig from '../util/api.config.json';
import { BASE_URL } from '../util/constants';
import axios from 'axios';


export const verifyEmail = async (email) => {
  const { verify_email } = APIconfig;

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BASE_URL}${verify_email}?email=${email}`,
    headers: {
      'Content-Type': 'application/json'
    },
  }; 


  const res = await axios.request(config)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => {
      return error?.response?.data

    });

  return res;
}


