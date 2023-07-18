import axiosInstanceAuth from "../util/api";
import APIconfig from "../util/api.config.json";

export const getFeed = async () => {
  const { get_feed } = APIconfig;

  const config = {
    method: "get",
    url: `${get_feed}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const result = await axiosInstanceAuth
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  return result;

}