/* eslint-disable no-case-declarations */
import formatLocation from "./formatLocation";

export default function validator(metod, data) {
  let status;
  switch (metod) {
    case "isRequired":
      status = data.trim() === "";
      break;
    case "isComma":
      status = !data.includes(",");
      break;
    case "isNumber":
      const [num1, num2] = formatLocation(data);
      status = !(typeof +num1 === "number" && typeof +num2 === "number");
      break;
    default:
      break;
  }
  return status;
}
