import { axiosInstance } from "../util/api";
import APIconfig from '../util/api.config.json';


export const resetPassword = async (email, password) => {
  const { reset_password } = APIconfig;

  let data = JSON.stringify({
    email: email,
    password: password
  });

  let config = {
    method: 'post',
    url: `${reset_password}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data
  }

  const result = await axiosInstance.request(config)
    .then((response) => {
      return response;
    }
    ).catch((error) => {
      return error;
    }
    );

  return result;
}
