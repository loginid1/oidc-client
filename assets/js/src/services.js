import { getEnvVariables } from "./utils";

const { loginUrl, baseUrl, clientId } = getEnvVariables();

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
