//import { setItem, clearStorage } from "../utils/storage";
import { request } from "./verb.services";

export const getAllTeams = async (onSuccess, onError) => {
  return request("teams", "get", null, false)
    .then(async ({ data }) => {
      onSuccess(data);
    })
    .catch(function (error) {
      onError(error);
    });
};

export const getTeamsByTeamID = async (teamId, onSucess, onError) => {
  return request(`teams/${teamId}`, "get", null, false)
    .then(async ({ data }) => {
      onSucess(data);
    })
    .catch(function (error) {
      onError(error);
    });
};

export const deleteTeam = (id, onSucess, onError) => {
  return request(`teams/${id}`, "Delete", null, true)
    .then(async ({ data }) => {
      onSucess();
      return data;
    })
    .catch(function (error) {
      onError(error);
    });
};
