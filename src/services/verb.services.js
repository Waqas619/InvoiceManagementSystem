import axios from "axios";
import apiObj from "../utils/api";
import { getItem } from "../utils/storage";
const api = apiObj.url;

export const fetchToken = async () => {
  const tokenContainer = await getItem("tokenContainer");
  return tokenContainer && `${tokenContainer.token}`;
};

export const request = (
  url,
  type,
  data,
  headers,
  params,
  extraOptions = null
) =>
  new Promise(async (resolve, reject) => {
    const requestObj = {
      method: type,
      url: api + url,
      ...extraOptions,
    };
    if (headers) {
      requestObj.headers = {
        Authorization: await fetchToken(),
      };
      if (headers.contentType) {
        requestObj.headers["content-type"] = headers.contentType;
      }
    }
    type !== "get" && (requestObj.data = data);
    params && (requestObj.params = params);
    console.log(requestObj);
    if (!requestObj.url.includes("refresh")) {
      axios(requestObj).then(resolve, reject);
    }
  });
