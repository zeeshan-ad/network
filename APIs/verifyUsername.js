import { axiosInstance } from "../util/api";
import APIconfig from '../util/api.config.json';


export const verifyUsername = async (username) => {
  const { verify_username } = APIconfig;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${verify_username}?username=${username}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const result = await axiosInstance.request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return result;
}