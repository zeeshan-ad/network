import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const getRequestStatus = async (userId) => {
  const { get_requests_status } = APIconfig;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${get_requests_status}?userId=${userId}`,
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