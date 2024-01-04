import { setItem, clearStorage } from "../utils/storage";
import { request } from "./verb.services";

export const loginUser = async (payload, onSucess, onError) => {
  return request("auth/authenticate", "post", payload, false)
    .then(async ({ data }) => {
      await setItem("user", data);
      await setItem("tokenContainer", { token: data.token });
      //   await setItem(
      //     "Avatar",
      //     data.user.firstName[0].toUpperCase() +
      //       data.user.lastName[0].toUpperCase()
      //   );
      onSucess();
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
