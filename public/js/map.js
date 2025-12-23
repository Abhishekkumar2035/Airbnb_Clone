document.addEventListener("DOMContentLoaded", function () {
  // Use the actual geocoded coordinates from your listing
  var latitude = latitude; // Default to Delhi coordinates
  var longitude = longitude;

  // Initialize the map with the actual coordinates
  var map = L.map("map").setView([latitude, longitude], 13);

  // Add a tile layer (OpenStreetMap)
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker at the actual listing location
  var marker = L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup(
      `
            <strong><%= listing.title %></strong><br>
            <i><%= listing.location %>, <%= listing.country %></i><br>
            <small>₹<%= Number(listing.price).toLocaleString("en-IN") %></small>
        `
    )
    .openPopup();

  // Optional: Add click event to show coordinates
  function onMapClick(e) {
    var popupContent =
      "You clicked the map at:<br>" +
      "Latitude: " +
      e.latlng.lat.toFixed(4) +
      "<br>" +
      "Longitude: " +
      e.latlng.lng.toFixed(4);

    L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map);
  }

  map.on("click", onMapClick);
});
