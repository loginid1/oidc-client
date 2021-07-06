const STATE_KEY = "OAUTH2_STATE";
const VERIFIER_KEY = "OAUTH2_VERIFIER";
const NONCE_KEY = "OAUTH2_NONCE";

const setItem = (key) => (value) => {
  sessionStorage.setItem(key, value);
};

const getIem = (key) => () => {
  return sessionStorage.getItem(key);
};

export const setStateCode = setItem(STATE_KEY);
export const getStateCode = getIem(STATE_KEY);
export const setVerifier = setItem(VERIFIER_KEY);
export const getVerifier = getIem(VERIFIER_KEY);
export const setNonce = setItem(NONCE_KEY);
export const getNonce = getIem(NONCE_KEY);
