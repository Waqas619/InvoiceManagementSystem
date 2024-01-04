import { getItem } from "../utils/storage";
import { request } from "./verb.services";

export const getAllInvoices = () => {
  const user = getItem("user");
  return request(`invoices/${user.userId}`, "get", null, true)
    .then(async ({ data }) => {
      return data;
    })
    .catch(function (error) {
      if (error.response.request.status === "401") {
      } else {
      }
    });
};

export const getInvoiceByInvoiceId = (invoiceId) => {
  const user = getItem("user");
  return request(`invoices//${invoiceId}/${user.userId}`, "get", null, true)
    .then(async ({ data }) => {
      return data;
    })
    .catch(function (error) {
      if (error.response.request.status === "401") {
      } else {
      }
    });
};

export const validateJiraHours = (body) => {
  return request("worklogs/fetch", "post", body, true)
    .then(async ({ data }) => {
      return data;
    })
    .catch(function (error) {
      if (error.response.request.status == "401") {
      } else {
      }
    });
};

export const createInvoice = (body) => {
  return request("invoices", "post", body, true)
    .then(async ({ data }) => {
      return data;
    })
    .catch(function (error) {
      if (error.response.request.status == "401") {
      } else {
      }
    });
};
