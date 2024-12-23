let map, marker, path, watchId;
const key = 'mFAtrJRBs32fMCgKsHiM';

function initMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`, {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>',
        crossOrigin: true
    }).addTo(map);
}

function startTracking() {
    if ("geolocation" in navigator) {
        path = L.polyline([], { color: 'red' }).addTo(map);
        watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
        });
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

function stopTracking() {
    if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
        watchId = undefined;
    }
}

function updatePosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const latlng = [lat, lng];

    if (!marker) {
        marker = L.marker(latlng).addTo(map);
    } else {
        marker.setLatLng(latlng);
    }

    path.addLatLng(latlng);
    map.setView(latlng);
}

function handleError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            let map, marker, path, watchId;
            const key = 'mFAtrJRBs32fMCgKsHiM';
            
            function initMap() {
                map = L.map('map').setView([0, 0], 2);
                L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`, {
                    tileSize: 512,
                    zoomOffset: -1,
                    minZoom: 1,
                    attribution: '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>',
                    crossOrigin: true
                }).addTo(map);
            }
            
            function startTracking() {
                if ("geolocation" in navigator) {
                    path = L.polyline([], { color: 'red' }).addTo(map);
                    watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
                        enableHighAccuracy: true,
                        maximumAge: 30000,
                        timeout: 27000
                    });
                } else {
                    alert("Geolocation is not supported by your browser");
                }
            }
            
            function stopTracking() {
                if (watchId !== undefined) {
                    navigator.geolocation.clearWatch(watchId);
                    watchId = undefined;
                }
            }
            
            function updatePosition(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const latlng = [lat, lng];
            
                if (!marker) {
                    marker = L.marker(latlng).addTo(map);
                } else {
                    marker.setLatLng(latlng);
                }
            
                path.addLatLng(latlng);
                map.setView(latlng);
            }
            
            function handleError(error) {
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        alert("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        alert("The request to get user location timed out.");
                        break;
                    case error.UNKNOWN_ERROR:
                        alert("An unknown error occurred.");
                        break;
                }
            }
            
            document.addEventListener('DOMContentLoaded', (event) => {
                initMap();
                document.getElementById('startTracking').addEventListener('click', startTracking);
                document.getElementById('stopTracking').addEventListener('click', stopTracking);
            });
            
            ;
            break;
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    initMap();
    document.getElementById('startTracking').addEventListener('click', startTracking);
    document.getElementById('stopTracking').addEventListener('click', stopTracking);
});

