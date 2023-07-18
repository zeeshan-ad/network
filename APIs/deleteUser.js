import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';


export const deleteUser = async () => {
  const { delete_user } = APIconfig;

  const config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${delete_user}`,
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
    }
    )

  return result;
}
