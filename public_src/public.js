import {
  createElement,
  getQueries,
  hashB64,
  randomString,
  parseJWT,
} from "./utils";
import {
  setStateCode,
  getStateCode,
  setVerifier,
  getVerifier,
  setNonce,
  getNonce,
} from "./storage";
import { authUrl, errorUrl, requestToken, createParams } from "./services";

const {
  code,
  error,
  state,
  error_description: errorDescription,
} = getQueries();

const mainElement = document.querySelector(".main");
const group = createElement("div", {}, ["group"]);
const createInput = (value, textContent) => {
  const name = textContent.trim().split(" ").join("_").toLowerCase();
  const label = createElement("label", { textContent });
  const input = createElement("input", { value, name });
  const br = createElement("br");
  group.appendChild(label);
  group.appendChild(input);
  group.appendChild(br);
  mainElement.appendChild(group);
};

(async function () {
  if (error) {
    const { redirect_uri } = createParams();
    const message = createElement("p", { textContent: "Error: " + error });
    const description = createElement("p", {
      textContent: "Description: " + errorDescription,
    });
    const button = createElement("button", { textContent: "Try Again" });

    group.appendChild(message);
    group.appendChild(description);
    group.appendChild(button);
    button.addEventListener("click", () => {
      window.location.replace(redirect_uri);
    });
    mainElement.appendChild(group);
  } else if (!code) {
    const params = createParams();
    const button = createElement("button", { textContent: "Make Request" });

    const verifier = randomString(16);
    const challenge = hashB64(verifier);
    const state = randomString(16);
    const nonce = randomString(16);
    setVerifier(verifier);
    setStateCode(state);
    setNonce(nonce);

    const p = createElement("p", {
      textContent: `Your current verifier code is ${verifier}`,
    });
    const form = createElement("form", {
      method: "GET",
      action: params.authUrl,
    });

    group.appendChild(p);
    createInput(params.redirect_uri, "Redirect URI");
    createInput(params.client_id, "Client ID");
    createInput(params.scope, "Scope");
    createInput(params.response_type, "Response Type");
    createInput(state, "State");
    createInput(nonce, "Nonce");
    createInput(challenge, "Code Challenge");
    createInput(params.code_challenge_method, "Code Challenge Method");
    group.appendChild(button);
    form.appendChild(group);
    mainElement.appendChild(form);

    button.addEventListener("click", () => {
      const url = authUrl(state, challenge, nonce);
      window.location.replace(url);
    });
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

      const authCodePre = createElement(
        "p",
        { textContent: "Authorization Code: " },
        ["center"]
      );
      const authCode = createElement("p", { textContent: idToken }, ["limit"]);

      const p = createElement("p", { textContent: "ID token: " }, ["center"]);
      const pre = createElement("pre", {}, ["align-self-center"]);
      const button = createElement("button", { textContent: "Try Again" });
      pre.textContent = JSON.stringify(payload, null, 2);
      button.addEventListener("click", () => {
        window.location.replace(redirect_uri);
      });
      group.appendChild(authCodePre);
      group.appendChild(authCode);
      group.appendChild(p);
      group.appendChild(pre);
      group.appendChild(button);
      mainElement.appendChild(group);
    } else {
      window.location.replace(
        errorUrl(data.message || "id_token request error", data.code || "error")
      );
    }
  }
})();
