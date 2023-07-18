import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';

export const addComment = async (postId, postType, comment) => {
  const { add_comment } = APIconfig;

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${add_comment}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      postId: postId,
      postType: postType,
      comment: comment,
    }
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