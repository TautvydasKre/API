/** @format */

"use strict";

const doc = document;

const createCardElement = (el) => {
  const card = doc.createElement("div");
  card.className = "card";
  card.style.cssText =
    "width: 19vw; height: 28vw; perspective: 1000px; position: relative; border: 1px solid #ccc; border-radius: 10px; overflow: hidden;";

  const frontSide = doc.createElement("div");
  frontSide.style.cssText =
    "width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.3s ease-in-out; transform: rotateY(0deg); border-radius: 10px; overflow: hidden;";

  const photo = doc.createElement("img");
  photo.src = el.images.web.url;
  photo.style.cssText =
    "width: 100%; height: 100%; object-fit: cover; cursor: pointer; transition: transform 0.3s ease-in-out;";

  const backSide = doc.createElement("div");
  backSide.style.cssText =
    "width: 100%; height: 100%; position: absolute; top: 0; left: 0; transform-style: preserve-3d; transition: transform 0.3s ease-in-out; transform: rotateY(180deg); background-color: rgba(255, 255, 255, 0.9); border-radius: 10px; overflow: hidden; display: none; pointer-events: none;";

  const infoContainer = doc.createElement("div");
  infoContainer.style.cssText =
    "padding: 20px; text-align: center; color: black;";

  const author = doc.createElement("div");
  author.innerText =
    el.creators[0]?.description?.replace(/ *\([^)]*\) */g, "") || "unknown";
  author.style.cssText = "margin-bottom: 10px;";

  const name = doc.createElement("div");
  name.innerText = el.title;
  name.style.cssText = "font-weight: bolder; margin-bottom: 10px;";

  const year = doc.createElement("div");
  year.innerText = `${el.creation_date_earliest}-${el.creation_date_latest}`;
  year.style.cssText = "margin-bottom: 10px;";

  backSide.appendChild(infoContainer);
  infoContainer.append(author, name, year);

  frontSide.appendChild(photo);
  card.append(frontSide, backSide);
  photo.addEventListener("click", () => {
    frontSide.style.transform =
      frontSide.style.transform === "rotateY(180deg)"
        ? "rotateY(0deg)"
        : "rotateY(180deg)";
    backSide.style.transform =
      backSide.style.transform === "rotateY(180deg)"
        ? "rotateY(0deg)"
        : "rotateY(180deg)";
    backSide.style.display =
      backSide.style.display === "block" ? "none" : "block";
  });

  return card;
};
const getRandomPhotos = async (search = false) => {
  const limit = 20;
  const endpoint = search
    ? `https://openaccess-api.clevelandart.org/api/artworks?limit=${limit}&has_image=1&q=${inputField.value}`
    : `https://openaccess-api.clevelandart.org/api/artworks?limit=${limit}&skip=${Math.floor(
        Math.random() * 100
      )}&has_image=1`;
  const result = await fetch(endpoint);
  const data = await result.json();
  const cards = data.data.map(createCardElement);

  const photoContainer = doc.querySelector(".photo-container");
  if (photoContainer) {
    doc.body.removeChild(photoContainer);
  }
  const newPhotoContainer = doc.createElement("div");
  newPhotoContainer.className = "photo-container";
  newPhotoContainer.style.cssText =
    "display: flex; flex-wrap: wrap; gap: 16px; padding: 16px; justify-content: center; background-color: #222;";
  cards.forEach((card) => newPhotoContainer.appendChild(card));
  doc.body.appendChild(newPhotoContainer);
};
const createElement = (type, styles = {}, properties = {}) => {
  const element = doc.createElement(type);
  Object.assign(element.style, styles);
  Object.assign(element, properties);
  return element;
};
const inputField = createElement(
  "input",
  {
    margin: "10px",
    padding: "8px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  { placeholder: "Search term" }
);
const searchButton = createElement(
  "button",
  {
    margin: "10px",
    padding: "8px 16px",
    fontSize: "16px",
    borderRadius: "8px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  { innerText: "Search photos", onclick: () => getRandomPhotos(true) }
);
doc.body.style.cssText =
  "font-family: 'Arial', sans-serif; text-align: center; background-color: #222; color: white;";
doc.body.append(inputField, searchButton);

getRandomPhotos();
