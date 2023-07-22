import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const getMomentIdDate = async (date, userId, timezone) => {
  const { get_moments_by_date_Id } = APIconfig;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${get_moments_by_date_Id}?date=${date}&userId=${userId}&timezone=${timezone}`,
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