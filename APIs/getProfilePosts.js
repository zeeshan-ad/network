import axiosInstanceAuth from "../util/api";
import APIconfig from "../util/api.config.json";

export const getProfilePosts = async (userId, timezone) => {
  const { user_profile_posts } = APIconfig;

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${user_profile_posts}?userId=${userId}&timezone=${timezone}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const result = await axiosInstanceAuth.request(config)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });

  return result;
};
