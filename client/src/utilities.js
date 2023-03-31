const deepClone = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

export default deepClone;

export const createErrorMessage = function (error) {
  let msg = "";
  if (error.response.status === 401) {
    msg = "Invalid username and/or password, or token is not valid.";
  } else if (error.response.status === 400) {
    msg = "There was an Error with your request (Bad Request)";
  } else {
    msg = error.message;
  }
  const details = error.response.data.error;
  if (details) {
    msg += ` Details: \n' ${details}`;
  }
  return msg;
};
