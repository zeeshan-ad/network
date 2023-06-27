import axiosInstanceAuth from "../util/api";
import APIconfig from "../util/api.config.json";

export const updateProfileData = async (editProfile) => {
  const { profile_update, upload_dp } = APIconfig;

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


  const formData = new FormData();

  if (editProfile.image !== null) {
    formData.append("profile_pic", {
      name: editProfile?.image?.split("/").pop(),
      uri: editProfile?.image,
      type: /\.(\w+)$/.exec(editProfile?.image) ? `image/${/\.(\w+)$/.exec(editProfile?.image)?.[1]}` : 'image'
    });

  }

  const config2 = {
    method: "put",
    url: `${upload_dp}`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  };


  const result2 = await axiosInstanceAuth
    .request(config2)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });


  const result = await axiosInstanceAuth
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  if (editProfile?.image) {
    if (result2?.status === 200 && result?.status === 200) {
      return { status: 200, message: 'Profile Updated Successfully' }
    }
    else {
      return { status: 400, message: 'Bad Request' }
    }
  } else {
    return result;
  }

}