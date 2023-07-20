import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const getBlockedList = async () => {

  const { get_blocked_users } = APIconfig;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${get_blocked_users}`,
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