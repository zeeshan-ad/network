import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';


export const AddRepliedComment = async (comment_user_id, replied_user_id, post_id, post_type,) => {
  const {add_replied_comment_notification} = APIconfig;

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${add_replied_comment_notification}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      commentUserId: comment_user_id,
      repliedUserId: replied_user_id,
      postId: post_id,
      postType: post_type,
    }
  };

  const result = await axiosInstanceAuth.request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    })

  return result;
}
