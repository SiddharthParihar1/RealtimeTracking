let map, myMarker, myPath, watchId;
const key = 'NuQfsR0nZFdLImhIGPBB'; // MapTiler API key
const users = {};
let myUsername = '';
let showOthers = false;

function initMap() {
    console.log('Initializing map...');
    try {
        if (map) {
            console.log('Map already initialized, resetting view');
            map.setView([0, 0], 2);
            return;
        }

        const mapElement = document.getElementById('map');
        if (!mapElement) {
            throw new Error('Map container not found');
        }

        map = L.map(mapElement, {
            zoomControl: false,
            attributionControl: true
        }).setView([0, 0], 2);

        L.control.zoom({
            position: 'bottom-right'
        }).addTo(map);

        setMapLayer('streets');

        L.control.scale({
            maxWidth: 200,
            metric: true,
            imperial: false,
            position: 'bottom-left'
        }).addTo(map);

        console.log('Map initialized successfully');
    } catch (error) {
        console.error('Error initializing map:', error);
        alert('Failed to initialize map. Please refresh the page and try again.');
    }
}

function setMapLayer(type) {
    console.log('Setting map layer:', type);
    if (map && map.baseLayer) {
        map.removeLayer(map.baseLayer);
    }

    let style;
    switch (type) {
        case 'satellite':
            style = 'satellite';
            break;
        case 'hybrid':
            style = 'hybrid';
            break;
        default:
            style = 'streets';
    }

    const url = `https://api.maptiler.com/maps/${style}/style.json?key=${key}`;

    if (map) {
        map.baseLayer = L.maplibreGL({
            style: url,
            attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        }).addTo(map);
    }
}

function startTracking() {
    console.log('Starting tracking...');
    const usernameInput = document.getElementById('usernameInput');
    const showOthersSelect = document.getElementById('showOthers');
    
    myUsername = usernameInput.value.trim();
    showOthers = showOthersSelect.value === 'yes';

    if (!myUsername) {
        alert('Please enter a valid username');
        return;
    }

    document.getElementById('setupModal').style.display = 'none';
    document.getElementById('controls').classList.remove('hidden');
    if (showOthers) {
        document.getElementById('userList').classList.remove('hidden');
    }

    initMap(); // Ensure map is initialized

    if ("geolocation" in navigator) {
        myPath = L.polyline([], { color: '#4285F4' }).addTo(map);
        watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
        });
        console.log('Geolocation watch started');
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

function stopTracking() {
    console.log('Stopping tracking...');
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
    document.getElementById('setupModal').style.display = 'flex';
    document.getElementById('controls').classList.add('hidden');
    document.getElementById('userList').classList.add('hidden');
    Object.values(users).forEach(user => map.removeLayer(user.marker));
    users = {};
    console.log('Tracking stopped');
}

function updatePosition(position) {
    console.log('Updating position:', position);
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

    if (showOthers) {
        fetchOtherUsers();
    }
}

function handleError(error) {
    console.error("Geolocation error:", error);
    alert(`An error occurred while tracking location: ${error.message}`);
}

function createCustomIcon(userName) {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div class="bg-blue-500 text-white p-2 rounded-full">${userName[0].toUpperCase()}</div>`
    });
}

function fetchOtherUsers() {
    console.log('Fetching other users...');
    // This is where you would fetch other users' locations from your server
    // For demonstration, we'll use random locations
    const dummyUsers = ['User1', 'User2', 'User3'];
    dummyUsers.forEach(name => {
        if (name === myUsername) return;
        const lat = myMarker.getLatLng().lat + (Math.random() - 0.5) * 0.1;
        const lng = myMarker.getLatLng().lng + (Math.random() - 0.5) * 0.1;
        updateUserMarker(name, lat, lng);
    });
    updateUserList();
}

function updateUserMarker(name, lat, lng) {
    console.log('Updating user marker:', name, lat, lng);
    if (!users[name]) {
        users[name] = {
            marker: L.marker([lat, lng], {icon: createCustomIcon(name)}).addTo(map),
        };
    } else {
        users[name].marker.setLatLng([lat, lng]);
    }
}

function updateUserList() {
    console.log('Updating user list');
    const userListElement = document.getElementById('userList');
    userListElement.innerHTML = '<h3 class="font-bold mb-2">Active Users</h3>';
    Object.keys(users).forEach(name => {
        const div = document.createElement('div');
        div.className = 'mb-2 p-2 bg-gray-100 rounded flex justify-between items-center';
        div.innerHTML = `
            <span>${name}</span>
            <button class="bg-blue-500 text-white px-2 py-1 rounded text-sm" onclick="navigateToUser('${name}')">Navigate</button>
        `;
        userListElement.appendChild(div);
    });
}

function navigateToUser(username) {
    console.log('Navigating to user:', username);
    const user = users[username];
    if (user && user.marker) {
        const userLatLng = user.marker.getLatLng();
        const myLatLng = myMarker.getLatLng();
        
        // Calculate route (in a real app, you'd use a routing service here)
        const routePoints = [myLatLng, userLatLng];
        
        // Draw route on map
        if (window.routeLine) {
            map.removeLayer(window.routeLine);
        }
        window.routeLine = L.polyline(routePoints, {color: 'red', weight: 3}).addTo(map);
        
        // Fit map to show entire route
        map.fitBounds(L.latLngBounds(routePoints));
    }
}

function ensureMapLibrariesLoaded(callback) {
    if (window.L && window.L.maplibreGL) {
        callback();
    } else {
        setTimeout(() => ensureMapLibrariesLoaded(callback), 100);
    }
}

ensureMapLibrariesLoaded(() => {
    console.log('Map libraries loaded, initializing map...');
    initMap();
    document.getElementById('startButton').addEventListener('click', startTracking);
    document.getElementById('stopTracking').addEventListener('click', stopTracking);
    document.getElementById('mapType').addEventListener('change', (e) => setMapLayer(e.target.value));
});

window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', message, 'at', source, lineno, colno, error);
    alert('An unexpected error occurred. Please check the console for more details.');
}

