import mongoSanitize from "mongo-sanitize";
import xss from "xss";

const sanitize = (data) => {
  if (typeof data === "string") {
    return mongoSanitize(xss(data));
  } else if (typeof data === "object" && data !== null) {
    for (const key in data) {
      if (typeof data[key] === "string") {
        data[key] = mongoSanitize(xss(data[key]));
      }
    }

    return data;
  } else {
    return data;
  }
};

export default sanitize;
