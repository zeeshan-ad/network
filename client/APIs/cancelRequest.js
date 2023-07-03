import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const cancelRequest = async (userId) => {
  const { cancel_request } = APIconfig;
  const config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${cancel_request}?userId=${userId}`,
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