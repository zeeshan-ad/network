import axiosInstanceAuth from '../util/api';
import APIconfig from '../util/api.config.json';


export const getProfileData = async () => {
  const { profile } = APIconfig;
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${profile}`,
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
    });

  return result;


}