import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';


export const unblockUser = async (blocked_user_id) => {
  const { unblock_user } = APIconfig;

  const config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${unblock_user}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      blocked_user_id: blocked_user_id,
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