async function loadProvinces() {
    const url = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/Provincias/';
    try {
        const response = await fetch(url);
        const provinces = await response.json();

        const select = document.getElementById('province');
        provinces.forEach(prov => {
            const option = new Option(prov.Provincia, prov.IDPovincia);
            select.add(option);
        });
    } catch (error) {
        console.error('Error loading provinces:', error);
    }
}

async function loadMunicipalities(provinceId) {
    const url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/${provinceId}`;
    try {
        const response = await fetch(url);
        const municipalities = await response.json();

        const select = document.getElementById('municipality');
        select.innerHTML = '<option value="">Select a municipality</option>';
        select.disabled = false;

        municipalities.forEach(mun => {
            const option = new Option(mun.Municipio, mun.IDMunicipio);
            select.add(option);
        });
    } catch (error) {
        console.error('Error loading municipalities:', error);
    }
}

// Definimos el objeto fuelTypeMap a nivel global para evitar duplicaciones.
const fuelTypeMap = {
    "1": "Precio Gasolina 95 E5",
    "3": "Precio Gasolina 98 E5",
    "4": "Precio Gasoleo A",
    "5": "Precio Gasoleo Premium"
};

// Función que compara el precio con la media calculada y asigna una clase.
function getPriceClass(price, avgPrice) {
    if (!price || price === 'N/A') return '';
    const priceValue = parseFloat(price.replace(',', '.'));
    if (priceValue < avgPrice) return 'cheap';
    if (priceValue > avgPrice) return 'expensive';
    return ''; // Exactamente igual a la media, sin clase.
}

async function searchGasStations(municipalityId) {
    const url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/${municipalityId}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        const list = document.getElementById('gas-stations-list');
        list.innerHTML = '';

        const checkbox = document.getElementById('open-now');
        const fuelType = document.getElementById('fuel_type').value;
        let stationsToShow = data.ListaEESSPrecio;

        // Filtrar y ordenar las estaciones según el tipo de combustible seleccionado.
        if (fuelType && fuelTypeMap[fuelType]) {
            stationsToShow = stationsToShow.filter(station => station[fuelTypeMap[fuelType]] && station[fuelTypeMap[fuelType]] !== 'N/A');
            stationsToShow.sort((a, b) => {
                const priceA = parseFloat(a[fuelTypeMap[fuelType]].replace(',', '.'));
                const priceB = parseFloat(b[fuelTypeMap[fuelType]].replace(',', '.'));
                return priceA - priceB;
            });
        } else {
            stationsToShow = stationsToShow.filter(station => station['Precio Gasolina 95 E5'] && station['Precio Gasolina 95 E5'] !== 'N/A');
            stationsToShow.sort((a, b) => {
                const priceA = parseFloat(a['Precio Gasolina 95 E5'].replace(',', '.'));
                const priceB = parseFloat(b['Precio Gasolina 95 E5'].replace(',', '.'));
                return priceA - priceB;
            });
        }

        // Calcular la media de los precios de las estaciones a mostrar
        let totalPrice = 0;
        let count = 0;
        stationsToShow.forEach(station => {
            let stationPrice;
            if (fuelType && fuelTypeMap[fuelType]) {
                stationPrice = parseFloat(station[fuelTypeMap[fuelType]].replace(',', '.'));
            } else {
                stationPrice = parseFloat(station['Precio Gasolina 95 E5'].replace(',', '.'));
            }
            if (!isNaN(stationPrice)) {
                totalPrice += stationPrice;
                count++;
            }
        });
        const avgPrice = totalPrice / count;

        // Crear y mostrar cada estación, asignando la clase según la comparación con la media.
        stationsToShow.forEach(station => {
            if (!checkbox.checked || isStationInService(station.Horario)) {
                const li = document.createElement('li');
                li.innerHTML = createStationHTML(station, fuelType, avgPrice);
                list.appendChild(li);
            }
        });
    } catch (error) {
        console.error('Error searching gas stations:', error);
    }
}

function createStationHTML(station, fuelType, avgPrice) {
    let containerClass = '';
    let fuelPrice = '';

    if (fuelType && fuelTypeMap[fuelType]) {
        const price = station[fuelTypeMap[fuelType]];
        containerClass = getPriceClass(price, avgPrice);
        fuelPrice = `<p>Selected Fuel: ${price}€</p>`;
    } else {
        const price95 = station['Precio Gasolina 95 E5'];
        containerClass = getPriceClass(price95, avgPrice);
        let availableFuels = '';
        if (station['Precio Gasolina 95 E5']) {
            availableFuels += `<p>Gasoline 95: ${station['Precio Gasolina 95 E5']}€</p>`;
        }
        if (station['Precio Gasolina 98 E5']) {
            availableFuels += `<p>Gasoline 98: ${station['Precio Gasolina 98 E5']}€</p>`;
        }
        if (station['Precio Gasoleo A']) {
            availableFuels += `<p>Diesel A: ${station['Precio Gasoleo A']}€</p>`;
        }
        if (station['Precio Gasoleo Premium']) {
            availableFuels += `<p>Premium Diesel: ${station['Precio Gasoleo Premium']}€</p>`;
        }
        fuelPrice = availableFuels;
    }

    return `
    <div class="container ${containerClass}">
        <h3>${station['Rótulo']}</h3>
        <p>Address: ${station['Dirección']}</p>
        ${fuelPrice}
        <p>Schedule: ${station['Horario']}</p>
    </div>
    `;
}

function isStationInService(schedule) {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    if (schedule.includes("L-D: 24H")) return true;

    const daysMap = { L: 1, M: 2, X: 3, J: 4, V: 5, S: 6, D: 0 };
    const hours = schedule.split(";");

    for (const hour of hours) {
        const [days, timeRange] = hour.split(": ");
        const [startDay, endDay] = days.split("-").map(d => daysMap[d.trim()]);
        const [start, end] = timeRange
            .split("-")
            .map(t => t.split(":").reduce((h, m) => h * 60 + Number(m)));

        if (
            ((currentDay >= startDay && currentDay <= endDay) ||
             (endDay < startDay && (currentDay >= startDay || currentDay <= endDay))) &&
            ((currentTime >= start && currentTime <= end) ||
             (end < start && (currentTime >= start || currentTime <= end)))
        ) {
            return true;
        }
    }
    return false;
}

document.getElementById('province').addEventListener('change', (e) => {
    if (e.target.value) {
        loadMunicipalities(e.target.value);
    }
});

document.getElementById('filter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const municipalityId = document.getElementById('municipality').value;
    if (municipalityId) {
        searchGasStations(municipalityId);
    }
});

loadProvinces();
