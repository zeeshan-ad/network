import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';



export const getNotifications = async () => {
  const { get_notifs } = APIconfig;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${get_notifs}`,
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
