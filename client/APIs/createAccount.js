import { useState } from 'react';
import APIconfig from '../util/api.config.json';
// import { axiosInstance } from '../util/api';
import { ip } from '../util/constants';
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
    url: `http://${ip}:3000${create_account}`,
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