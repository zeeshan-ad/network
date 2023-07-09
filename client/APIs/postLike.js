import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const postLike = async (postId, postType) => {
  const { like_posts } = APIconfig;

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${like_posts}`,
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