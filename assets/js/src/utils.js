import { CryptoJS, KJUR } from "jsrsasign";

export const getEnvVariables = function () {
  const elm = document.getElementById("env");
  return {
    loginUrl: elm.dataset.loginUrl,
    clientId: elm.dataset.clientId,
    baseUrl: elm.dataset.baseUrl,
  };
};

export const queryBuilder = function (baseUrl, queryObj) {
  const base = new URL(baseUrl);
  const url = Object.entries(queryObj).reduce((acc, [prop, value]) => {
    acc.searchParams.append(prop, value);
    return acc;
  }, base);
  return url.toString();
};

export const randomString = function (length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const hashB64 = function (payload = "") {
  return CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(payload))
    .toString()
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const getQueries = function () {
  const queriesString = window.location.search;
  const urlSearchParams = new URLSearchParams(queriesString);
  return Object.fromEntries(urlSearchParams.entries());
};

export const createElement = function (name, props = {}, classes = []) {
  const elm = document.createElement(name);
  classes.forEach((elmClass) => {
    elm.classList.add(elmClass);
  });
  Object.entries(props).forEach(([key, value]) => {
    elm[key] = value;
  });
  return elm;
};

export const parseJWT = function (jwt) {
  const parsed = KJUR.jws.JWS.parse(jwt);
  return {
    header: parsed.headerObj,
    payload: parsed.payloadObj || {},
  };
};
