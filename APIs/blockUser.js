import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const blockUser = async (user_id) => {
  const { block_user } = APIconfig;

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${block_user}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      blocked_user_id: user_id,
    }
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