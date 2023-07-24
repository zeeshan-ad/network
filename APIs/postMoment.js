import axiosInstanceAuth from "../util/api";
import APIconfig from "../util/api.config.json";

export const postMoment = async (momentPath, Caption, GroupBy) => {
  const { post_moments } = APIconfig;

  const formData = new FormData();

  if (momentPath !== null) {
    formData.append("moment", {
      name: momentPath?.split("/").pop(),
      uri: momentPath,
      type: /\.(\w+)$/.exec(momentPath) ? `image/${/\.(\w+)$/.exec(momentPath)?.[1]}` : 'image'
    });
  }

  const config = {
    method: "post",
    url: `${post_moments}?caption=${Caption}&group_by=${GroupBy}`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
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