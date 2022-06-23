import { getEnvVariables, queryBuilder } from "./utils";

export const createParams = (state, challenge) => {
  const { loginUrl, clientId, baseUrl } = getEnvVariables();
  const obj = {
    authUrl: loginUrl + "/oauth2/auth",
    scope: "openid",
    response_type: "code",
    client_id: clientId,
    redirect_uri: baseUrl + "/public",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
  };
  return obj;
};

export const errorUrl = (message, code) => {
  const { redirect_uri } = createParams();
  return `${redirect_uri}?error=${message}&error_description=${code}`;
};

export const authUrl = function (state, challenge, nonce) {
  const { loginUrl, clientId, baseUrl } = getEnvVariables();
  const base = loginUrl + "/oauth2/auth?";
  const queryObj = {
    scope: "openid email",
    response_type: "code",
    client_id: clientId,
    redirect_uri: baseUrl + "/public",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
    nonce,
  };
  return queryBuilder(base, queryObj);
};

export const requestToken = async (code, verifier) => {
  const { loginUrl, baseUrl, clientId } = getEnvVariables();
  const url = loginUrl + "/oauth2/token";
  const params = new URLSearchParams([
    ["grant_type", "authorization_code"],
    ["redirect_uri", baseUrl + "/public"],
    ["client_id", clientId],
    ["code", code],
    ["code_verifier", verifier],
  ]);
  return await fetch(url, {
    method: "POST",
    body: params,
  });
};

export const userInfo = async (accessToken) => {
  const { loginUrl } = getEnvVariables();
  const url = loginUrl + "/oauth2/userinfo";
  return await fetch(url, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ access_token: accessToken }),
  });
};
