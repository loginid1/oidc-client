const STATE_KEY = "OAUTH2_STATE";

export const setStateCode = (state) => {
  sessionStorage.setItem(STATE_KEY, state);
};

export const getStateCode = () => {
  return sessionStorage.getItem(STATE_KEY);
};
