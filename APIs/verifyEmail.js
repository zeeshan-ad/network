import APIconfig from '../util/api.config.json';
import { axiosInstance } from '../util/api';

export const verifyEmail = async (email) => {
  const { verify_email } = APIconfig;

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${verify_email}?email=${email}`,
    headers: {
      'Content-Type': 'application/json'
    },
  }; 


  const res = await axiosInstance.request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error?.response?.data

    });

  return res;
}


