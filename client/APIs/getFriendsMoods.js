import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const getFriendsMoods = async () => {
  const { friends_mood } = APIconfig;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${friends_mood}`,
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