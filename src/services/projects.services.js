import { request } from "./verb.services";

export const getAllProjects = () => {
  return request("projects", "get", null, true)
    .then(async ({ data }) => {
      return data;
    })
    .catch(function (error) {
      if (error.response.request.status == "401") {
      } else {
      }
    });
};
