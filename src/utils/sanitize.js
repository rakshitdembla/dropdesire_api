import mongoSanitize from "mongo-sanitize";
import xss from "xss";

const sanitize = (data) => {
  if (typeof data !== "string") {
    return null;
  }

  return mongoSanitize(xss(data));
};

export default sanitize;
