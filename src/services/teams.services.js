//import { setItem, clearStorage } from "../utils/storage";
import { request } from "./verb.services";

export const getAllTeams = async () => {
  return request("teams", "get", null, false)
    .then(async ({ data }) => {
      return data;
    })
    .catch(function (error) {
      if (error.response.request.status === "401") {
      } else {
      }
    });
};

export const getTeamsByTeamID = async (teamId, onSucess, onError) => {
  return request(`teams/${teamId}`, "get", null, false)
    .then(async ({ data }) => {
      onSucess(data);
    })
    .catch(function (error) {
      if (error.response) {
        onError();
      } else {
      }
    });
};

export const LogoutUser = () => {
  localStorage.clear();
};
