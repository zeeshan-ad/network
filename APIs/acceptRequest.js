import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const acceptRequest = async (userId) => {
  const { accept_request } = APIconfig;
  const config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${accept_request}?userId=${userId}`,
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