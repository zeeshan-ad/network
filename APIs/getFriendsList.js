import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const getFriendsList = async (userId) => {
  const { get_Friends_list } = APIconfig;

  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${get_Friends_list}?userId=${userId}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const result = await axiosInstanceAuth
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return result;

}