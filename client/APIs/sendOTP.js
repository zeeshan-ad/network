import { axiosInstance } from "../util/api";
import APIconfig from '../util/api.config.json';


export const sendOTP = async (email) => {
  const { forgot_password } = APIconfig;

  let config = {
    method: 'post',
    url: `${forgot_password}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: email
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
