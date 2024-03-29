import { getItem } from "../utils/storage";
import { request } from "./verb.services";

export const getAllInvoices = (onSucess, onError) => {
  const user = getItem("user");
  return request(`invoices/${user.userId}`, "get", null, true)
    .then(async ({ data }) => {
      onSucess(data);
      return data;
    })
    .catch(function (error) {
      onError();
    });
};

export const getInvoiceByInvoiceId = (invoiceId, onSucess, onError) => {
  const user = getItem("user");
  return request(`invoices/${invoiceId}/${user.userId}`, "get", null, true)
    .then(async ({ data }) => {
      onSucess(data);
      return data;
    })
    .catch(function (error) {
      onError();
    });
};

export const validateJiraHours = (body, onSucess, onError) => {
  return request("worklogs/fetch", "post", body, true)
    .then(async ({ data }) => {
      onSucess(data);
      return data;
    })
    .catch(function (error) {
      onError();
    });
};

export const createInvoice = (body, onSuccess, onError) => {
  return request("invoices", "post", body, true)
    .then(async ({ data }) => {
      onSuccess(data);
    })
    .catch(function (error) {
      onError(error);
    });
};

export const updateInvoiceStatus = (id, action, body, onSucess, onError) => {
  return request(`invoices/${id}/${action}`, "post", body, true)
    .then(async ({ data }) => {
      onSucess();
      return data;
    })
    .catch(function (error) {
      onError();
    });
};

export const deleteInvoice = (id, onSucess, onError) => {
  return request(`invoices/${id}`, "Delete", null, true)
    .then(async ({ data }) => {
      onSucess();
      return data;
    })
    .catch(function (error) {
      onError();
    });
};

export const updateInvoice = (id, body, onSucess, onError) => {
  return request(`invoices/${id}`, "put", body, true)
    .then(async ({ data }) => {
      onSucess();
      return data;
    })
    .catch(function (error) {
      onError();
    });
};
