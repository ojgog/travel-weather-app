import L from "leaflet";
import "./style.css";
let selectedPlace = null;
const destinations = [];

const weatherEl = document.getElementById("weather");
const addBtn = document.getElementById("addBtn");
const listEl = document.getElementById("destinations");

/* === MAPA === */
const map = L.map("map").setView([48.85, 2.35], 4);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

/* === KLIK NA MAPĘ === */
map.on("click", async (e) => {
  const { lat, lng } = e.latlng;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;

  const res = await fetch(url);
  const data = await res.json();

  const temp = data.current_weather.temperature;
  const code = data.current_weather.weathercode;

  selectedPlace = {
    lat,
    lng,
    temp,
    code,
  };

  weatherEl.textContent = `Temperatura: ${temp}°C | Kod pogody: ${code}`;
  addBtn.disabled = false;
});

/* === DODAWANIE DO LISTY === */
addBtn.addEventListener("click", () => {
  if (!selectedPlace) return;

  destinations.push(selectedPlace);
  renderList();

  addBtn.disabled = true;
});

/* === RENDER LISTY === */
function renderList() {
  listEl.innerHTML = "";

  destinations.forEach((place, index) => {
    const li = document.createElement("li");
    li.textContent = `Cel ${index + 1}: ${place.temp}°C (kod ${place.code})`;
    listEl.appendChild(li);
  });
}
