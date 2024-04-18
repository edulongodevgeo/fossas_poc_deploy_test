document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Additional logic for collecting latitude and longitude
    var latitude = document.getElementById('latitude').value;
    var longitude = document.getElementById('longitude').value;

    // Set the values for latitude and longitude
    document.getElementById('latitude').value = latitude;
    document.getElementById('longitude').value = longitude;

    // Continue with the form submission
    document.getElementById("message").textContent = "Submitting..";
    document.getElementById("message").style.display = "block";
    document.getElementById("submit-button").disabled = true;

    // Collect the form data
    var formData = new FormData(this);
    var keyValuePairs = [];
    for (var pair of formData.entries()) {
        keyValuePairs.push(pair[0] + "=" + pair[1]);
    }

    var formDataString = keyValuePairs.join("&");

    // Send a POST request to your Google Apps Script
    fetch(
        "https://script.google.com/macros/s/AKfycbxF_dLVbCyVmqbzyz1tm9l3yAdVxlR6w_-BYmxAQ1zmmgjQ4MhV33fWBDHhGJyETFE/exec",
        {
            redirect: "follow",
            method: "POST",
            body: formDataString,
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        }
    )
        .then(function (response) {
            // Check if the request was successful
            if (response) {
                return response; // Assuming your script returns JSON response
            } else {
                throw new Error("Failed to submit the form.");
            }
        })
        .then(function (data) {
            // Display a success message
            document.getElementById("message").textContent =
                "Data submitted successfully!";
            document.getElementById("message").style.display = "block";
            document.getElementById("message").style.backgroundColor = "green";
            document.getElementById("message").style.color = "beige";
            document.getElementById("submit-button").disabled = false;
            document.getElementById("form").reset();

            // Clear latitude and longitude fields
            document.getElementById('latitude').value = '';
            document.getElementById('longitude').value = '';

            setTimeout(function () {
                document.getElementById("message").textContent = "";
                document.getElementById("message").style.display = "none";
            }, 2600);

            // Recarregar a página após 2 segundos
            setTimeout(function () {
                window.location.reload();
            }, 2000);
        })
        .catch(function (error) {
            // Handle errors, you can display an error message here
            console.error(error);
            document.getElementById("message").textContent =
                "An error occurred while submitting the form.";
            document.getElementById("message").style.display = "block";
        });
});

// Map initialization code...
let mapOptions = {
    center: [-27.61540601339959, -48.50463867187501],
    zoom: 10
}


let map = new L.map('map', mapOptions);

// Default layer (OpenStreetMap)
let defaultLayer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(defaultLayer);

// Satellite layer
let satelliteLayer = new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Control to switch between layers
var baseMaps = {
    "Default": defaultLayer,
    "Satellite": satelliteLayer
};

L.control.layers(baseMaps).addTo(map);

let marker = null;
map.on('click', (event) => {
    if (marker !== null) {
        map.removeLayer(marker);
    }

    marker = L.marker([event.latlng.lat, event.latlng.lng]).addTo(map);

    // Formatar os valores de latitude e longitude com vírgulas
    document.getElementById('latitude').value = event.latlng.lat.toFixed(8).replace('.', ',');
    document.getElementById('longitude').value = event.latlng.lng.toFixed(8).replace('.', ',');
});

// -------------------------------------------------------

document.getElementById("locate-button").addEventListener("click", function () {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            map.setView([latitude, longitude], 15);

            if (marker !== null) {
                map.removeLayer(marker);
            }

            marker = L.marker([latitude, longitude]).addTo(map);

            document.getElementById('latitude').value = latitude.toFixed(8).replace('.', ',');
            document.getElementById('longitude').value = longitude.toFixed(8).replace('.', ',');

            document.getElementById("message").textContent = "Localização encontrada!";
            document.getElementById("message").style.display = "block";
            document.getElementById("message").style.backgroundColor = "green";
            document.getElementById("message").style.color = "beige";

            setTimeout(function () {
                document.getElementById("message").textContent = "";
                document.getElementById("message").style.display = "none";
            }, 3000);
        }, function (error) {
            console.error("Erro ao obter a localização: ", error.message);
            document.getElementById("message").textContent = "Erro ao obter a localização do usuário.";
            document.getElementById("message").style.display = "block";
            document.getElementById("message").style.backgroundColor = "red";
            document.getElementById("message").style.color = "white";
        });
    } else {
        console.error("Geolocalização não suportada.");
        document.getElementById("message").textContent = "Geolocalização não suportada pelo navegador.";
        document.getElementById("message").style.display = "block";
        document.getElementById("message").style.backgroundColor = "red";
        document.getElementById("message").style.color = "white";
    }
});

