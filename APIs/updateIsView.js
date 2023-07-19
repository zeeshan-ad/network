import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';


export const updateIsView = async (post_id, post_type, interaction_type) => {
  const { set_is_view } = APIconfig;

  const config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${set_is_view}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      post_id: post_id,
      post_type: post_type,
      interaction_type: interaction_type,
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