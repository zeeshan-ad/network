import APIconfig from '../util/api.config.json';
import { axiosInstance } from '../util/api';
import axios from 'axios';

export const createAccount = async (SignupCred) => {
  const { create_account } = APIconfig;
  const data = JSON.stringify({
    firstname: SignupCred.firstname.trim(),
    lastname: SignupCred.lastname.trim(),
    email: SignupCred.email.trim(),
    password: SignupCred.password,
    created_at: new Date(),
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `http://http://192.168.0.187:9000${create_account}`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  axios.request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}