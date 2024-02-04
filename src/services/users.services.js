import { request } from "./verb.services";

export const getAllUsers = (onSucess, onError) => {
  return request("jira/users", "get", null, true)
    .then(async ({ data }) => {
      onSucess(data);
    })
    .catch(function (error) {
      onError(error);
    });
};

export const getAllUserRoles = (onSucess, onError) => {
  return request("roles", "get", null, true)
    .then(async ({ data }) => {
      onSucess(data);
    })
    .catch(function (error) {
      onError(error);
    });
};
