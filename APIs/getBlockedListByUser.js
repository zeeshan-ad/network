import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';


export const getBlockedListByUser = async (userId) => {
  const { get_blocked_users_by_user_id } = APIconfig;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${get_blocked_users_by_user_id}?user_id=${userId}`,
    headers: {
      'Content-Type': 'application/json',
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