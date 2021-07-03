import { getEnvVariables, queryBuilder } from "./utils";

const { loginUrl, baseUrl, clientId } = getEnvVariables();

export const authUrl = function (state, challenge) {
  const { loginUrl, clientId, baseUrl } = getEnvVariables();
  const base = loginUrl + "/oauth2/auth?";
  const queryObj = {
    scope: "openid",
    response_type: "code",
    client_id: clientId,
    redirect_uri: baseUrl + "/public",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
  };
  return queryBuilder(base, queryObj);
};

export const requestToken = async (code, verifier) => {
  const url = loginUrl + "/oauth2/token";
  return await fetch(url, {
    method: "POST",
    body: JSON.parse({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: baseUrl + "/public",
      code_verifier: verifier,
    }),
  });
};
