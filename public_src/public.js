import { getQueries, hashB64, randomString, parseJWT } from "./utils";
import { authUrl, errorUrl, requestToken, createParams } from "./services";
import {
  setStateCode,
  getStateCode,
  setVerifier,
  getVerifier,
  setNonce,
  getNonce,
} from "./storage";

const {
  code,
  error,
  state,
  error_description: errorDescription,
} = getQueries();

(async function () {
  if (error) {
    const group = document.getElementById("error-group");
    const errorMessageElm = group.querySelector(".error");
    const errorDescriptionElm = group.querySelector(".error-description");
    const button = group.querySelector("button");
    const { redirect_uri } = createParams();

    errorMessageElm.textContent = "Error: " + error;
    errorDescriptionElm.textContent = "Description: " + errorDescription;

    button.addEventListener("click", () => {
      window.location.replace(redirect_uri);
    });

    group.classList.remove("hidden");
  } else if (!code) {
    const form = document.getElementById("request-group");
    const button = form.querySelector("button");
    const p = form.querySelector("p");
    const [
      redirectInput,
      clientIdInput,
      scopeInput,
      responseTypeInput,
      stateInput,
      nonceInput,
      codeChallengeInput,
      codeChallengeMethodInput,
    ] = Array.from(form.querySelectorAll("input"));

    const params = createParams();
    const verifier = randomString(16);
    const challenge = hashB64(verifier);
    const state = randomString(16);
    const nonce = randomString(16);
    setVerifier(verifier);
    setStateCode(state);
    setNonce(nonce);

    p.textContent += " " + verifier;
    form.action = params.authUrl;

    redirectInput.value = params.redirect_uri;
    clientIdInput.value = params.client_id;
    scopeInput.value = params.scope;
    responseTypeInput.value = params.response_type;
    stateInput.value = state;
    nonceInput.value = nonce;
    codeChallengeInput.value = challenge;
    codeChallengeMethodInput.value = params.code_challenge_method;

    button.addEventListener("click", () => {
      const url = authUrl(state, challenge, nonce);
      window.location.replace(url);
    });

    form.classList.remove("hidden");
  } else if (code && state) {
    const { redirect_uri } = createParams();
    const sessionState = getStateCode();
    const verifier = getVerifier();

    if (state !== sessionState) {
      window.location.replace(errorUrl("State is not the same", "state_error"));
    }

    const res = await requestToken(code, verifier);
    const data = await res.json();

    if (res.ok) {
      const { id_token: idToken } = data;
      const { payload } = parseJWT(idToken);

      if (payload.nonce && payload.nonce !== getNonce()) {
        window.location.replace(
          errorUrl("Nonce is not the same", "nonce_error")
        );
      }

      const group = document.getElementById("success-group");
      const codeElem = group.querySelector(".code");
      const idTokenElm = group.querySelector(".id-token");
      const button = group.querySelector("button");

      codeElem.textContent = code;
      idTokenElm.textContent = JSON.stringify(payload, null, 2);

      button.addEventListener("click", () => {
        window.location.replace(redirect_uri);
      });

      group.classList.remove("hidden");
    } else {
      window.location.replace(
        errorUrl(data.message || "id_token request error", data.code || "error")
      );
    }
  }
})();
