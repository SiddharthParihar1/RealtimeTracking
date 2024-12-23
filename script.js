let map, myMarker, myPath, watchId;
const key = 'mFAtrJRBs32fMCgKsHiM';
const users = {};
let myUsername = '';

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

function setUsername() {
    const usernameInput = document.getElementById('usernameInput');
    myUsername = usernameInput.value.trim();
    if (myUsername) {
        document.getElementById('usernameSection').style.display = 'none';
        document.getElementById('controls').style.display = 'block';
        alert(`Username set to: ${myUsername}`);
    } else {
        alert('Please enter a valid username');
    }
}

function startTracking() {
    if (!myUsername) {
        alert('Please set a username before starting tracking');
        return;
    }
    if ("geolocation" in navigator) {
        myPath = L.polyline([], { color: 'blue' }).addTo(map);
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
        if (myMarker) {
            map.removeLayer(myMarker);
            myMarker = null;
        }
        if (myPath) {
            map.removeLayer(myPath);
            myPath = null;
        }
    }
}

function updatePosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const latlng = [lat, lng];

    if (!myMarker) {
        myMarker = L.marker(latlng, {icon: createCustomIcon(myUsername)}).addTo(map);
    } else {
        myMarker.setLatLng(latlng);
    }

    myPath.addLatLng(latlng);
    map.setView(latlng);

    // Simulate other users (replace this with actual multi-user implementation)
    simulateOtherUsers();
}

function handleError(error) {
    console.error("Error: " + error.message);
    alert("An error occurred while tracking location.");
}

function createCustomIcon(userName) {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div class="bg-blue-500 text-white p-2 rounded-full">${userName}</div>`
    });
}

function simulateOtherUsers() {
    const userNames = ['Alice', 'Bob', 'Charlie'];
    userNames.forEach(name => {
        if (name === myUsername) return; // Skip if it's the current user
        if (!users[name]) {
            const lat = myMarker.getLatLng().lat + (Math.random() - 0.5) * 0.01;
            const lng = myMarker.getLatLng().lng + (Math.random() - 0.5) * 0.01;
            users[name] = {
                marker: L.marker([lat, lng], {icon: createCustomIcon(name)}).addTo(map),
                path: L.polyline([], { color: getRandomColor() }).addTo(map)
            };
        } else {
            const lat = users[name].marker.getLatLng().lat + (Math.random() - 0.5) * 0.001;
            const lng = users[name].marker.getLatLng().lng + (Math.random() - 0.5) * 0.001;
            users[name].marker.setLatLng([lat, lng]);
            users[name].path.addLatLng([lat, lng]);
        }
    });
    updateUserList();
}

function getRandomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}

function updateUserList() {
    const userListElement = document.getElementById('userList');
    userListElement.innerHTML = '<h3 class="font-bold mb-2">Active Users</h3>';
    const activeUsers = [myUsername, ...Object.keys(users)];
    activeUsers.forEach(name => {
        const div = document.createElement('div');
        div.className = 'mb-2 p-2 bg-white rounded shadow';
        div.textContent = name;
        userListElement.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    initMap();
    document.getElementById('setUsername').addEventListener('click', setUsername);
    document.getElementById('startTracking').addEventListener('click', startTracking);
    document.getElementById('stopTracking').addEventListener('click', stopTracking);
    document.getElementById('controls').style.display = 'none'; // Hide controls initially
});

