import L from "leaflet";
import "./style.css";

let selectedPlace = null;
let requestId = 0;
const destinations = [];

const weatherEl = document.getElementById("weather");
const addBtn = document.getElementById("addBtn");
const listEl = document.getElementById("destinations");

const map = L.map("map").setView([48.85, 2.35], 4);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

map.on("click", async ({ latlng }) => {
  const { lat, lng } = latlng;
  const currentRequest = ++requestId;

  selectedPlace = null;
  addBtn.disabled = true;
  weatherEl.textContent = "Pobieranie pogody...";

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat.toString());
  url.searchParams.set("longitude", lng.toString());
  url.searchParams.set("current", "temperature_2m,weather_code");

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Nie udało się pobrać pogody.");

    const data = await response.json();
    const temperature = data.current?.temperature_2m;
    const code = data.current?.weather_code;

    if (typeof temperature !== "number" || typeof code !== "number") {
      throw new Error("Niepełne dane pogodowe.");
    }
    if (currentRequest !== requestId) return;

    selectedPlace = { lat, lng, temperature, code };
    weatherEl.textContent = `Temperatura: ${temperature}°C | Kod pogody: ${code}`;
    addBtn.disabled = false;
  } catch {
    if (currentRequest !== requestId) return;
    weatherEl.textContent = "Nie można pobrać pogody. Spróbuj ponownie.";
  }
});

addBtn.addEventListener("click", () => {
  if (!selectedPlace) return;

  destinations.push(selectedPlace);
  selectedPlace = null;
  addBtn.disabled = true;
  renderList();
});

function renderList() {
  listEl.replaceChildren();

  destinations.forEach((place, index) => {
    const li = document.createElement("li");
    const latitude = place.lat.toFixed(2);
    const longitude = place.lng.toFixed(2);
    li.textContent = `Cel ${index + 1} (${latitude}, ${longitude}): ${place.temperature}°C, kod ${place.code}`;
    listEl.appendChild(li);
  });
}
