import { axiosInstance } from "../util/api";
import APIconfig from '../util/api.config.json';


export const sendOTP = async (email) => {
  const { forgot_password } = APIconfig;

  let data = JSON.stringify({
    email: email
  });

  let config = {
    method: 'post',
    url: `${forgot_password}`,
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
