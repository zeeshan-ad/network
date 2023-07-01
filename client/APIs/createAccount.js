import APIconfig from '../util/api.config.json';
// import { axiosInstance } from '../util/api';
import { BASE_URL } from '../util/constants';
import axios from 'axios';
import { convertDateFormat } from '../util/functions';


export const createAccount = async (UserDetails) => {
  const { create_account } = APIconfig;

  const data = JSON.stringify({
    name: UserDetails?.name.trim(),
    email: UserDetails?.email.trim(),
    password: UserDetails?.password,
    dob: convertDateFormat(UserDetails?.dob),
    username: UserDetails?.username.trim(),
    created_at: new Date(),
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BASE_URL}${create_account}`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };


  const res = await axios.request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response.data
    });

  return res;
}