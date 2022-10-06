export default function getLocation() {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (data) => {
          const { latitude, longitude } = data.coords;
          resolve(`[${latitude.toFixed(5)},${longitude.toFixed(5)}]`);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  return new Promise((reject) =>
    reject(new Error("your devise does not support geolocation"))
  );
}
