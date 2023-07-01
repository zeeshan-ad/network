import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';


export const search = async (searchTerm, offset) => {
  const { search_user } = APIconfig;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${search_user}?search=${searchTerm}&offset=${offset}`,
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


