import axiosInstanceAuth from '../util/api';
import APIconfig from '../util/api.config.json';


export const logoutUser = async () => {

  const { logout_user } = APIconfig;

  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${logout_user}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };


  const result = axiosInstanceAuth.request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return result;
}