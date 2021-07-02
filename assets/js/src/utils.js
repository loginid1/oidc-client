import { CryptoJS } from "jsrsasign";

const loginUrl = process.env.LOGIN_URL;
const clientId = process.env.PUBLIC_CLIENT_ID;
const baseUrl = process.env.BASE_URL;

export const oauth2AuthURL = function (state, challenge) {
  const base = loginUrl + "/oauth2/auth?";
  const queriesObj = {
    scope: "openid",
    response_type: "code",
    client_id: clientId,
    redirect_uri: baseUrl,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
  };
  const queries = Object.entries(queriesObj)
    .map(([prop, value]) => prop + "=" + value)
    .join("&");
  return base + queries;
  //query serialization does not work
  /*
  const baseUrl = new URL(loginUrl + "/oauth2/auth?");
  const queriesObj = {
    scope: "openid",
    response_type: "code",
    client_id: clientId,
    redirect_uri: baseUrl,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
  };
  const url = Object.entries(queriesObj).reduce((acc, [prop, value]) => {
    acc.searchParams.append(prop, value);
    return acc;
  }, baseUrl);
  return url.toString();
*/
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
