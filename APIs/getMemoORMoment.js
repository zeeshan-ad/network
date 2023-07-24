import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';


export const getMemoORMoment = async (post_id, post_type, timezone) => {
  const { getMemo_OR_Moment } = APIconfig;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getMemo_OR_Moment}?post_id=${post_id}&post_type=${post_type}&timezone=${timezone}`,
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
