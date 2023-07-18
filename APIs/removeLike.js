import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const removeLike = async (postId, postType) => {
  const { remove_like } = APIconfig;

  const config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${remove_like}`,
    data: {
      postId,
      postType
    },
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