// var map = L.map('map').setView([28.6139, 77.2090], 10); // Example: Delhi
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; OpenStreetMap contributors'
// }).addTo(map);

// // Add a marker
// L.marker([28.6139, 77.2090]).addTo(map)
//     .bindPopup("New Delhi")
//     .openPopup();


// Ensure coordinates exist before proceeding
if (typeof coordinates !== "undefined" && coordinates.length === 2) {
  const map = L.map("map").setView([coordinates[1], coordinates[0]], 9); // [latitude, longitude]

  // Add OpenStreetMap tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const redIcon = L.icon({
    iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-red.png', // URL for the red marker
    iconSize: [25, 41], // Size of the marker
    iconAnchor: [12, 41], // Point of the marker that's anchored to the map
    popupAnchor: [1, -34], // Popup position
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', // Shadow
    shadowSize: [41, 41], // Size of the shadow
    shadowAnchor: [12, 41] // Shadow anchor point
});

  // Add marker
  L.marker([coordinates[1], coordinates[0]], { icon: redIcon }).addTo(map)
      .bindPopup(`<b>Location:</b> ${listingLocation}, ${listingCountry} <br><i>Exact location provided after booking</i>`)
      .openPopup();
} else {
  console.error("Coordinates not available");
}
