import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const getMood = async () => {
  const { get_mood } = APIconfig;


  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${get_mood}`,
    headers: {
      'Content-Type': 'application/json'
    },
  };

  const res = await axiosInstanceAuth.request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  return res;
}
