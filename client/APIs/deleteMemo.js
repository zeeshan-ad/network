import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';


export const deleteMemo = async (memoId) => {
  const { delete_memo } = APIconfig;

  const config = {
    method: 'delete',
    url: `${delete_memo}?memoId=${memoId}`,
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