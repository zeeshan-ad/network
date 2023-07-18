import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';


export const postMemos = async (Memo) => {

  const { user_posts_memos } = APIconfig;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${user_posts_memos}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: { Memo: Memo }
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