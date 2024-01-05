import { request } from "./verb.services";

export const getAllProjects = (onSucess, onError) => {
  return request("projects", "get", null, true)
    .then(async ({ data }) => {
      onSucess(data);
      return data;
    })
    .catch(function (error) {
      onError();
    });
};
