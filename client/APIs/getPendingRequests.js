import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const getPendingRequests = async () => {
  const { notify_pending_requests } = APIconfig;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${notify_pending_requests}`,
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