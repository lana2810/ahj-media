export default function formatLocation(str) {
  const onlyNumbers = str.match(/[-,.0-9]/g).join("");
  const formatedStr = onlyNumbers.split(",");
  return formatedStr;
}
