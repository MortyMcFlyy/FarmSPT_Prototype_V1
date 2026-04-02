let map;
let currentFieldGeoJSON;
let currentFieldMarker;
let fieldVariants = [];  // Alle Varianten des aktuellen Feldes speichern
let currentVariantIndex = 0;

// CSRF-Cookie auslesen
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('logged_in')) {
        window.location.href = './index.html';
        return;
    }

    // Karte initialisieren (default auf Deutschland)
    map = L.map('map').setView([51.165691, 10.451526], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19
    }).addTo(map);

    // Felder laden
    loadFields();
});

function logout() {
    localStorage.removeItem('logged_in');
    window.location.href = './index.html';
}

function uploadXML() {
    const fileInput = document.getElementById('xmlFile');
    const file = fileInput.files[0];
    const statusDiv = document.getElementById('uploadStatus');

    if (!file) {
        statusDiv.innerHTML = '<div class="error">Bitte eine Datei auswählen</div>';
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    statusDiv.innerHTML = '<p>Wird hochgeladen...</p>';

    fetch('/fieldboundaries/upload_xml/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: formData,
        credentials: 'include'
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'success') {
            statusDiv.innerHTML = `<div class="success">✓ ${data.name} importiert<br/>${data.points} Punkte</div>`;
            fileInput.value = '';
            loadFields();
        } else {
            statusDiv.innerHTML = `<div class="error">Fehler: ${data.error}</div>`;
        }
    })
    .catch(e => {
        statusDiv.innerHTML = `<div class="error">Fehler beim Upload</div>`;
        console.error(e);
    });
}

function normalizeFieldName(name) {
    return String(name || '').replace(/\s*\(v\d+\)\s*$/i, '').trim();
}

async function fetchAllFieldBoundaries() {
    let url = '/fieldboundaries/';
    const all = [];

    while (url) {
        const response = await fetch(url, { credentials: 'include' });
        const data = await response.json();

        if (Array.isArray(data.results)) {
            all.push(...data.results);
            url = data.next || null;
        } else if (Array.isArray(data)) {
            all.push(...data);
            url = null;
        } else {
            url = null;
        }
    }

    return all;
}

async function loadFields() {
    try {
        const allFields = await fetchAllFieldBoundaries();
        const fieldsList = document.getElementById('fieldsList');

        if (!allFields.length) {
            fieldsList.innerHTML = '<p style="color: #7f8c8d;">Keine Felder vorhanden</p>';
            return;
        }

        const groupedFields = {};
        allFields.forEach(field => {
            const baseName = normalizeFieldName(field.name);
            if (!groupedFields[baseName]) groupedFields[baseName] = [];
            groupedFields[baseName].push(field);
        });

        fieldsList.innerHTML = Object.entries(groupedFields).map(([baseName, fields]) => {
            const safeName = baseName.replace(/'/g, "\\'");
            return `
                <div class="field-item" onclick="showField('${safeName}')">
                    <div class="field-name">${baseName}</div>
                    <div class="field-info">
                        ${fields[0].area_hectares} ha | ${fields[0].coordinates.length} Punkte
                        ${fields.length > 1 ? `(${fields.length} Versionen)` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error('Fehler beim Laden der Felder:', e);
    }
}

async function showField(fieldName) {
    try {
        const allFields = await fetchAllFieldBoundaries();
        fieldVariants = allFields.filter(f => normalizeFieldName(f.name) === fieldName);

        if (!fieldVariants.length) {
            console.warn('Keine Felder mit diesem Namen');
            return;
        }

        currentVariantIndex = 0;
        displayFieldVariant(0);
    } catch (e) {
        console.error('Fehler beim Laden der Felder:', e);
    }
}

function displayFieldVariant(index) {
    if (index < 0 || index >= fieldVariants.length) return;
    
    const field = fieldVariants[index];
    currentVariantIndex = index;
    
    if (!field.coordinates || field.coordinates.length === 0) {
        console.warn('Keine Koordinaten für dieses Feld');
        return;
    }

    // Farben für verschiedene Varianten
    const colors = ['#27ae60', '#3498db', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];
    const currentColor = colors[index % colors.length];

    // Alte Layer entfernen
    if (currentFieldGeoJSON) {
        map.removeLayer(currentFieldGeoJSON);
    }
    if (currentFieldMarker) {
        map.removeLayer(currentFieldMarker);
    }

    // GeoJSON zeichnen (Polygon der Feldgrenze) - mit dynamischer Farbe
    const coords = field.coordinates.map(([lat, lon]) => [lat, lon]);
    const geoJSON = {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [coords.map(([lat, lon]) => [lon, lat])]
        }
    };

    currentFieldGeoJSON = L.geoJSON(geoJSON, {
        style: {
            color: currentColor,
            weight: 3,
            opacity: 0.7,
            fillOpacity: 0.2
        }
    }).addTo(map);

    // Berechne Mittelpunkt des Feldes
    let avgLat = 0, avgLon = 0;
    coords.forEach(([lat, lon]) => {
        avgLat += lat;
        avgLon += lon;
    });
    avgLat /= coords.length;
    avgLon /= coords.length;

    // Marker mit HTML-Icon in der Mitte - auch farbig
    const markerHtml = `
        <div style="
            background: ${currentColor};
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            user-select: none;
        ">
            ${currentVariantIndex + 1}/${fieldVariants.length}
        </div>
    `;

    const icon = L.divIcon({
        html: markerHtml,
        className: '',
        iconSize: [50, 50],
        iconAnchor: [25, 25]
    });

    currentFieldMarker = L.marker([avgLat, avgLon], { icon: icon }).addTo(map);
    
    // Click-Event für Marker
    if (fieldVariants.length > 1) {
        currentFieldMarker.on('click', () => {
            displayFieldVariant((currentVariantIndex + 1) % fieldVariants.length);
        });
    }

    // Auf das Feld zoomen
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [50, 50] });
}