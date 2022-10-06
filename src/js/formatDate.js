export default function formatDate(n) {
  const date = new Date(n);
  const year = date.getFullYear();
  const month = date.getMonth() > 9 ? date.getMonth() : `0${date.getMonth()}`;
  const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
  const hour = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
  const minutes =
    date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
  return `${hour}:${minutes}   ${day}.${month}.${year}`;
}
