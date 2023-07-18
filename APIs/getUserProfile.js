import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const getUserProfile = async (userId) => {
  const { other_user } = APIconfig;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${other_user}?userId=${userId}`,
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