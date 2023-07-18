import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';


export const deleteMoment = async (momentId) => {
  const { delete_moment } = APIconfig;

  const config = {
    method: 'delete',
    url: `${delete_moment}?momentId=${momentId}`,
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