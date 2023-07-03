import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const sendRequest = async (userId) => {
  const { send_request } = APIconfig;
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${send_request}?userId=${userId}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const result = await axiosInstanceAuth.request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return result;
}