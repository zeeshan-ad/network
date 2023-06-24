import axiosInstanceAuth from "../util/api";
import APIconfig from "../util/api.config.json";

export const updateProfileData = async (editProfile) => {
  const { profile_update } = APIconfig;


  const data = {
    bio: editProfile?.bio,
    theme: editProfile?.theme,
    is_public: editProfile?.is_public,
  };

  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${profile_update}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
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