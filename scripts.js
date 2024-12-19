// Initialize the map and set its view to a default zoom level
var map = L.map('map').setView([24.0, 46.0], 5); // Coordinates focused on the Gulf region

// Add the Tile Layer for the base map (OpenStreetMap tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create a custom location pin icon for countries
var countryIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Default location pin icon from Leaflet
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon that will correspond to the marker's location
    popupAnchor: [1, -34], // Point from which the popup will open relative to the icon
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', // Marker shadow
    shadowSize: [41, 41] // Shadow size
});

// Create a custom factory icon for the clients using Font Awesome
var clientIcon = L.divIcon({
    className: 'leaflet-factory-icon', // Custom class for styling
    html: '<i class="fas fa-industry" style="font-size: 30px; color: #FF6347;"></i>', // Factory icon with custom styling (you can change the color)
    iconSize: [30, 30], // Size of the icon
    iconAnchor: [15, 15], // Point of the icon that will correspond to the marker's location
    popupAnchor: [1, -25] // Point from which the popup will open relative to the icon
});

// Define the coordinates and countries you want to highlight with pins
var countriesCoordinates = [
    {
        name: "Saudi Arabia",
        coords: [24.0, 46.0], // Coordinates for Saudi Arabia
        clients: [
            { name: "Client 1", coords: [24.5, 46.5], id: 1 },
            { name: "Client 2", coords: [23.8, 45.9], id: 2 },
            { name: "Client 3", coords: [25.0, 47.0], id: 3 }
        ]
    },
    {
        name: "Algeria",
        coords: [28.0339, 1.6596], // Center of Algeria
        clients: [
            { name: "ٍSorfert", coords: [30.5, 2.8], id: 4 },
            { name: "AOA", coords: [27.9, 1.0], id: 5 },
            { name: "ASMIDAL", coords: [25.9, 1.2], id: 6 }

        ]
    },
    {
        name: "Qatar",
        coords: [25.276987, 51.520008], // Coordinates for Qatar
        clients: [
            { name: "Client 1", coords: [25.3, 51.5], id: 7 },
            { name: "Client 2", coords: [25.2, 51.4], id: 8 }
        ]
    },
    {
        name: "UAE",
        coords: [23.424076, 53.847818], // Coordinates for UAE
        clients: [
            { name: "Client 1", coords: [23.5, 53.8], id: 9 },
            { name: "Client 2", coords: [23.2, 53.6], id: 10 }
        ]
    },
    {
        name: "Egypt", // Adding Egypt to the map
        coords: [26.8206, 30.8025], // Coordinates for Egypt
        clients: [
            { name: "Helwan Fertilizers Co. (HFC)", coords: [27.0, 33.0], id: 11 },
            { name: "Abu Qir Fertilizers and Chemical Industries Co. (AFC)", coords: [26.5, 30.2], id: 12 },
            { name: "Alexandria Fertilizers Co.", coords: [27.2, 25.5], id: 13 },
            { name: "MOPCO", coords: [26.2, 28.5], id: 14 },
            { name: "Egyptian Fertilizer Company - EFC", coords: [24.2, 27.5], id: 15 },
            { name: "SEMADCO", coords: [27.2, 25.5], id: 16 }
        ]
    }
];

// Function to show clients for a selected country
function showClients(clients) {
    // Remove any existing client markers before adding new ones
    if (window.clientMarkers) {
        window.clientMarkers.forEach(function(marker) {
            map.removeLayer(marker);
        });
    }

    // Create new client markers with the client icon
    window.clientMarkers = clients.map(function(client) {
        var marker = L.marker(client.coords, { icon: clientIcon })
            .addTo(map)
            .bindPopup("<div>" + client.name + "<br><a href='client.html?id=" + client.id + "'>View Details</a></div>");
        return marker;
    });
}

// Loop through the countries and add markers with location pins
countriesCoordinates.forEach(function(country) {
    var marker = L.marker(country.coords, { icon: countryIcon })
        .addTo(map);

    // Create a custom popup content (a small box above the pin showing the country name)
    var popupContent = "<div style='background-color: #fff; padding: 5px; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);'>" + country.name + "</div>";

    // Bind the popup, but don't open it immediately
    marker.bindPopup(popupContent);

    // Display the popup when the mouse hovers over the country marker
    marker.on('mouseover', function() {
        marker.openPopup(); // Open the popup when mouse hovers over the marker
    });

    // Hide the popup when the mouse leaves the country marker
    marker.on('mouseout', function() {
        marker.closePopup(); // Close the popup when mouse leaves the marker
    });

    // When a country marker is clicked, zoom in and show the clients
    marker.on('click', function() {
        map.setView(country.coords, 9); // Zoom to the country's coordinates and set zoom level to 9
        showClients(country.clients); // Show the clients for that country
    });
});

// Additional feature: Remove client markers when zoomed out to the initial view
map.on('zoomend', function() {
    if (map.getZoom() < 5) { // If zoom level is below 5 (far zoomed out), remove client markers
        if (window.clientMarkers) {
            window.clientMarkers.forEach(function(marker) {
                map.removeLayer(marker);
            });
        }
    }
});
