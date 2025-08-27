import { request } from "../client";
import { BASE_URLS } from "../config";

export const filesApi = {
  get: (path) =>
    request({
      base: BASE_URLS.files,
      path,
    }),

  post: (path, data, isMultipart = false) =>
    request({
      base: BASE_URLS.files,
      path,
      method: "POST",
      data,
      isMultipart,
    }),

  delete: (path) =>
    request({
      base: BASE_URLS.files,
      path,
      method: "DELETE",
    }),
};
