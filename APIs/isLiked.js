import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const isLiked = async (postId, postType) => {
  const { is_liked } = APIconfig;


  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${is_liked}?postId=${postId}&postType=${postType}`,
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