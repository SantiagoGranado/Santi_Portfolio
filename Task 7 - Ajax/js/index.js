// Load all provinces from API and populate the province select element
async function loadProvinces() {
    const url = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/Provincias/';
    const response = await fetch(url);
    const provinces = await response.json();
 
    const select = document.getElementById('province');
    provinces.forEach(prov => {
        const option = new Option(prov.Provincia, prov.IDPovincia);
        select.add(option);
    });
 }
 
 // Load municipalities for selected province from API and populate municipality select
 async function loadMunicipalities(provinceId) {
    const url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/${provinceId}`;
    const response = await fetch(url);
    const municipalities = await response.json();
 
    const select = document.getElementById('municipality');
    select.innerHTML = '<option value="">Select a municipality</option>';
    select.disabled = false;
 
    municipalities.forEach(mun => {
        const option = new Option(mun.Municipio, mun.IDMunicipio);
        select.add(option);
    });
 }
 
 // Determine CSS class based on fuel price
 // Returns 'cheap' if price <= 1.43, 'expensive' if price > 1.49
 function getPriceClass(price) {
    if (!price || price === 'N/A') return '';
    
    price = parseFloat(price.replace(',', '.'));
    if (price <= 1.43) return 'cheap';
    if (price > 1.49) return 'expensive';
    return '';
 }
 
 // Search and display gas stations for selected municipality with filters
 async function searchGasStations(municipalityId) {
    const url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/${municipalityId}`;
    const response = await fetch(url);
    const data = await response.json();
 
    const list = document.getElementById('gas-stations-list');
    list.innerHTML = '';
 
    const checkbox = document.getElementById('open-now');
    const fuelType = document.getElementById('fuel_type').value;
    let stationsToShow = data.ListaEESSPrecio;
 
    const fuelTypeMap = {
        "1": "Precio Gasolina 95 E5",
        "3": "Precio Gasolina 98 E5",
        "4": "Precio Gasoleo A",
        "5": "Precio Gasoleo Premium"
    };
 
    // Filter stations without price
    if (fuelType && fuelTypeMap[fuelType]) {
        stationsToShow = stationsToShow.filter(station => station[fuelTypeMap[fuelType]] && station[fuelTypeMap[fuelType]] !== 'N/A');
    } else {
        stationsToShow = stationsToShow.filter(station => station['Precio Gasolina 95 E5'] && station['Precio Gasolina 95 E5'] !== 'N/A');
    }
 
    // Sort by price
    if (fuelType && fuelTypeMap[fuelType]) {
        stationsToShow.sort((a, b) => {
            const priceA = parseFloat(a[fuelTypeMap[fuelType]].replace(',', '.'));
            const priceB = parseFloat(b[fuelTypeMap[fuelType]].replace(',', '.'));
            return priceA - priceB;
        });
    } else {
        stationsToShow.sort((a, b) => {
            const priceA = parseFloat(a['Precio Gasolina 95 E5'].replace(',', '.'));
            const priceB = parseFloat(b['Precio Gasolina 95 E5'].replace(',', '.'));
            return priceA - priceB;
        });
    }
 
    function createStationHTML(station) {
        let fuelPrice = '';
        let containerClass = '';
        
        if (fuelType && fuelTypeMap[fuelType]) {
            const price = station[fuelTypeMap[fuelType]];
            containerClass = getPriceClass(price);
            fuelPrice = `<p>Selected Fuel: ${price}€</p>`;
        } else {
            const price95 = station['Precio Gasolina 95 E5'];
            containerClass = getPriceClass(price95);
            
            // Only add the fuels that have a price
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
 
    stationsToShow.forEach(station => {
        if (!checkbox.checked || isStationInService(station.Horario)) {
            const li = document.createElement('li');
            li.innerHTML = createStationHTML(station);
            list.appendChild(li);
        }
    });
 }
 
 // Complex function to check if a gas station is currently open based on its schedule
 // Handles 24h stations and different time ranges for each day of the week
 function isStationInService(schedule) {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
  
    if (schedule.includes("L-D: 24H")) return true;
  
    const daysMap = { L: 1, M: 2, X: 3, J: 4, V: 5, S: 6, D: 0 };
    const hours = schedule.split(";");
  
    for (const hour of hours) {
      const [days, timeRange] = hour.split(": ");
      const [startDay, endDay] = days.split("-").map((d) => daysMap[d.trim()]);
      const [start, end] = timeRange
        .split("-")
        .map((t) => t.split(":").reduce((h, m) => h * 60 + Number(m)));
  
      if (
        ((currentDay >= startDay && currentDay <= endDay) ||
          (endDay < startDay &&
            (currentDay >= startDay || currentDay <= endDay))) &&
        ((currentTime >= start && currentTime <= end) ||
          (end < start && (currentTime >= start || currentTime <= end)))
      ) {
        return true;
      }
    }
    return false;
 }
 
 // Event Listeners for form interactions
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
 
 // Initial load of provinces when page loads
 loadProvinces();