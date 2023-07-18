import axiosInstanceAuth from "../util/api";
import APIconfig from '../util/api.config.json';


export const reportUser = async (reportedUserId, ReportReason) => {
  const { report_user } = APIconfig;

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${report_user}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      reportedUserId: reportedUserId,
      ReportReason: ReportReason,
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