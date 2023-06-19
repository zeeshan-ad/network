import APIconfig from '../util/api.config.json';
import { axiosInstance } from '../util/api';



export const loginUser = async ({ email, password }) => {
  const { login_user } = APIconfig;

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${login_user}?email=${email}&password=${password}`,
    headers: {
      'Content-Type': 'application/json'
    },
  };


  const res = await axiosInstance.request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;

    });

  return res;
}


