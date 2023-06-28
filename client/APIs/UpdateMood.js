import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';


export const updateMood = async (text) => {
  const { update_mood } = APIconfig;

  const data = {
    text: text,
  };

  let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${update_mood}`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
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

