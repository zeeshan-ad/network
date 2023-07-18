import { axiosInstance } from "../util/api";
import APIconfig from '../util/api.config.json';


export const verifyOTP = async (email, otp) => {
  const { verify_otp } = APIconfig;

  let data = JSON.stringify({
    email: email,
    otp: otp
  });

  let config = {
    method: 'post',
    url: `${verify_otp}`,
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