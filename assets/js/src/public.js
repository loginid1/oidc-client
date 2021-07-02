import {
  createElement,
  getQueries,
  hashB64,
  oauth2AuthURL,
  randomString,
} from "./utils";
import {
  setStateCode,
  getStateCode,
  setVerifier,
  getVerifier,
} from "./storage";
import { requestToken } from "./services";

const mainElement = document.querySelector(".main");
const {
  code,
  error,
  state,
  error_description: errorDescription,
} = getQueries();

const handleLogin = () => {
  const verifier = randomString(16);
  const challenge = hashB64(verifier);
  const state = randomString(16);
  const url = oauth2AuthURL(state, challenge);
  setVerifier(verifier);
  setStateCode(state);
  window.location.replace(url);
};

const group = createElement("div", {}, ["group"]);
if (error) {
  const message = createElement("p", { textContent: "Error: " + error });
  const description = createElement("p", {
    textContent: "Description: " + errorDescription,
  });
  const button = createElement("button", { textContent: "Login" });

  group.appendChild(message);
  group.appendChild(description);
  group.appendChild(button);
  button.addEventListener("click", handleLogin);
  mainElement.appendChild(group);
} else if (!code) {
  const message = createElement("p", { textContent: "You are not logged in." });
  const button = createElement("button", { textContent: "Login" });

  group.appendChild(message);
  group.appendChild(button);
  mainElement.appendChild(group);

  button.addEventListener("click", handleLogin);
} else if (code && state) {
  const sessionState = getStateCode();
  if (!state === sessionState) throw new Error("State is not the same");

  const button = createElement("Make a public request");
  group.appendChild(button);

  button.addEventListener("click", async () => {
    const verifier = getVerifier();
    const res = await requestToken(code, verifier);
    const data = await res.json();
    alert(data);
  });
}
