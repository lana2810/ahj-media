/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
import getLocation from "./getLocation";
import formatDate from "./formatDate";
import formatLocation from "./formatLocation";
import validator from "./validator";

const timeline = document.querySelector(".timeline");
const inputMessage = document.querySelector("#input-message");
const divInput = document.querySelector(".input-div");
const divMessageList = document.querySelector(".message-list");
const divPopupLocation = document.querySelector(".popup-location");
const divPopupPermission = document.querySelector(".popup-permission");
const btnCancel = document.querySelectorAll(".cancel");
const btnConfirm = document.querySelector(".confirm");
const inputPopup = document.querySelector(".input-popup");
const spanError = document.querySelector(".span-error");
const iconMicrophone = document.querySelector(".fa-microphone");
const iconCamera = document.querySelector(".fa-camera");
const divMedia = document.querySelector(".media-div");
const record = document.querySelector(".fa-check");
const stop = document.querySelector(".fa-times");
const timer = document.querySelector(".timer");
let interval;
let typeMessage;
let currentContent;

const errors = {
  isRequired: "Поле должно быть заполнено",
  isComma: "Значения должны разделятся запятой",
  isNumber: "Значения должны быть числом",
};

function renderMessage(date, content, location, type) {
  const divMessage = document.createElement("div");
  divMessage.classList.add("message");

  const divDate = document.createElement("div");
  divDate.classList.add("date");
  divDate.textContent = formatDate(date);
  divMessage.append(divDate);

  switch (type) {
    case "text":
      const divMessageContent = document.createElement("div");
      divMessageContent.classList.add("message-content");
      divMessageContent.textContent = content;
      divMessage.append(divMessageContent);
      break;
    case "audio":
      const divAudio = document.createElement("audio");
      divAudio.classList.add("media");
      divAudio.controls = true;
      divAudio.src = URL.createObjectURL(content);
      divMessage.append(divAudio);
      break;
    case "video":
      const divVideo = document.createElement("video");
      divVideo.classList.add("media");
      divVideo.controls = true;
      divVideo.src = URL.createObjectURL(content);
      divMessage.append(divVideo);

      break;
    default:
      break;
  }

  const spanLocation = document.createElement("span");
  spanLocation.classList.add("location");
  spanLocation.textContent = location;
  divMessage.append(spanLocation);

  const icon = document.createElement("i");
  icon.classList.add("fa");
  icon.classList.add("fa-eye");
  divMessage.append(icon);

  divMessageList.prepend(divMessage);

  inputPopup.value = "";
  inputMessage.value = "";
  typeMessage = null;
  currentContent = null;
  divMedia.classList.add("hidden");
  divInput.classList.remove("hidden");
}

inputMessage.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    typeMessage = "text";
    currentContent = inputMessage.value;
    const date = Date.now();
    getLocation()
      .then((res) => renderMessage(date, currentContent, res, "text"))
      .catch(() => divPopupLocation.classList.remove("hidden"));
  }
});

btnCancel.forEach((item) => {
  const popup = item.closest(".popup");
  item.addEventListener("click", (e) => {
    inputPopup.value = "";
    spanError.textContent = "";
    popup.classList.add("hidden");
    divMedia.classList.add("hidden");
    divInput.classList.remove("hidden");
    typeMessage = null;
    currentContent = null;
  });
});

btnConfirm.addEventListener("click", (e) => {
  e.preventDefault();
  if (validator("isRequired", inputPopup.value)) {
    spanError.textContent = errors.isRequired;
    return;
  }
  if (validator("isComma", inputPopup.value)) {
    spanError.textContent = errors.isComma;
    return;
  }
  if (validator("isNumber", inputPopup.value)) {
    spanError.textContent = errors.isNumber;
    return;
  }
  const date = Date.now();
  const [latitude, longitude] = formatLocation(inputPopup.value);
  const location = `[${latitude},${longitude}]`;
  renderMessage(date, currentContent, location, typeMessage);
  divPopupLocation.classList.add("hidden");
});

iconMicrophone.addEventListener("click", () => {
  typeMessage = "audio";
  divMedia.classList.remove("hidden");
  divInput.classList.add("hidden");
});

iconCamera.addEventListener("click", () => {
  typeMessage = "video";
  divMedia.classList.remove("hidden");
  divInput.classList.add("hidden");
});

record.addEventListener("click", async () => {
  let stream;
  let videoPlayer;
  switch (typeMessage) {
    case "audio":
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      } catch (error) {
        divPopupPermission.classList.remove("hidden");
      }
      break;

    case "video":
      try {
        videoPlayer = document.createElement("video");
        videoPlayer.classList.add("media");
        videoPlayer.setAttribute("muted", true);
        timeline.append(videoPlayer);

        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        videoPlayer.srcObject = stream;
        videoPlayer.addEventListener("canplay", () => {
          videoPlayer.play();
        });
      } catch (error) {
        divPopupPermission.classList.remove("hidden");
      }
      break;
    default:
      break;
  }

  try {
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.addEventListener("start", () => {
      let hour = 0;
      let minutes = 0;

      interval = setInterval(() => {
        const contentHour = hour > 9 ? `${hour}` : `0${hour}`;
        const contentMinutes = minutes > 9 ? `${minutes}` : `0${minutes}`;
        timer.textContent = `${contentHour}:${contentMinutes}`;
        minutes++;
        if (minutes === 60) hour++;
      }, 1000);
    });

    recorder.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });

    recorder.addEventListener("stop", () => {
      clearInterval(interval);
      currentContent = new Blob(chunks);
      const date = new Date();
      getLocation()
        .then((res) => renderMessage(date, currentContent, res, typeMessage))
        .catch(() => divPopupLocation.classList.remove("hidden"));
      if (videoPlayer) videoPlayer.remove();
    });

    recorder.start();

    stop.addEventListener("click", () => {
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
      timer.textContent = "";
    });
  } catch (error) {
    console.log(error);
  }
});
