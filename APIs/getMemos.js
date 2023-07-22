import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const getMemos = async () => {

  const { get_user_memos } = APIconfig;

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${get_user_memos}`,
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






