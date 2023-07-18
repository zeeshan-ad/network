import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const getComments = async (postId, postType) => {
  const { get_comments } = APIconfig;


  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${get_comments}?postId=${postId}&postType=${postType}`,
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