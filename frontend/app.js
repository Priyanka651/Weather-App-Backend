// ==============================
// FRONTEND WEATHER APP JS
// ==============================

const form = document.getElementById("weather-form");
const resultDiv = document.getElementById("weatherResult");

// Backend URL
// const BASE_URL = "http://localhost:4002/api/weather";
const BASE_URL = "https://weather-app-backend-2hcd.onrender.com/api/weather";



// AUTOCOMPLETE VARIABLES

const locationInput = document.getElementById("LocalInput");
const suggestionBox = document.getElementById("location_suggestions");


// Inputs
const startDateInput = document.getElementById("StartDate");
const endDateInput = document.getElementById("EndDate");


// ==================================================
//  LIMIT BOTH CALENDARS TO: TOMORROW → TOMORROW + 4 DAYS
// ==================================================

// Today at midnight
const today = new Date();
today.setHours(0, 0, 0, 0);

// TOMORROW
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

// TOMORROW + 4 DAYS (total 5 days)
const maxDate = new Date(today);
maxDate.setDate(today.getDate() + 5);

// Convert to YYYY-MM-DD
const minDateStr = tomorrow.toISOString().split("T")[0];
const maxDateStr = maxDate.toISOString().split("T")[0];

//  APPLY LIMIT TO BOTH CALENDARS
startDateInput.min = minDateStr;
startDateInput.max = maxDateStr;

endDateInput.min = minDateStr;
endDateInput.max = maxDateStr;


// ==================================================
//  WHEN USER SELECTS START DATE → AUTO-FIX END DATE
// ==================================================
startDateInput.addEventListener("change", () => {
    if (endDateInput.value < startDateInput.value ||
        endDateInput.value > maxDateStr) {
        endDateInput.value = startDateInput.value;
    }
});

// ==============================
// SUBMIT FORM → CREATE RECORD
// ==============================
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const location = document.getElementById("LocalInput").value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;


    resultDiv.innerHTML = "";
//if location is empty

    if (!location) {
        resultDiv.textContent = "Please enter a location.";
        return;
    }

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ location, startDate, endDate })
        });

        const data = await response.json();

        if (!response.ok) {
            resultDiv.textContent = "❌ " + (data.message || "Something went wrong.");
            return;
        }

        // ==========================================
        //  SHOW MULTI-DAY FORECAST
        // ==========================================
        let html = `<h2>Weather Forecast: ${data.normalizedLocation}</h2>`;

    data.temperatures.forEach((day) => {
    const cleanDate = new Date(day.date).toISOString().split("T")[0];

    html += `
        <p><strong>Date:</strong> ${cleanDate}</p> 
        <p><strong>Temperature:</strong> ${day.temp} °C</p>
        <p><strong>Description:</strong> ${day.description}</p>
        <p><strong>Humidity:</strong> ${day.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${day.windSpeed} m/s</p>
        <hr>
    `;
});

        // Maps link
        if (data.mapsUrl) {
            html += `
                <p>
                    <a href="${data.mapsUrl}" target="_blank">🌍 View on Google Maps</a>
                </p>
            `;
        }

        resultDiv.innerHTML = html;

    } catch (error) {
        resultDiv.textContent = "❌ Cannot connect to backend. Is the server running?";
        console.error(error);
    }
});


// ==============================
// VIEW ALL RECORDS
// ==============================
const viewBtn = document.getElementById("viewRecordsBtn");
const tableBody = document.querySelector("#weatherTable tbody");

viewBtn.addEventListener("click", async () => {
    tableBody.innerHTML = "";

    try {
        const response = await fetch(BASE_URL);
        const records = await response.json();

        records.forEach((record) => {
            const first = record.temperatures[0]; // show only first day in table

            const row = `
<tr>
    <td>${record.normalizedLocation}</td>
    <td>${record.startDate.split("T")[0]}</td>
    <td>${record.endDate.split("T")[0]}</td>
    <td>${first.temp} °C</td>
    <td>${first.description}</td>
    <td>${first.humidity ?? "N/A"}%</td>
    <td>${first.windSpeed ?? "N/A"} m/s</td>

    <td>
        <button class="delete-btn" data-id="${record._id}" style="background:red;color:white;border:none;padding:5px 10px;cursor:pointer;">
            Delete
        </button>
    </td>

    <td>
        <button class="update-btn" data-id="${record._id}" style="background:green;color:white;padding:5px;cursor:pointer;">
            Update
        </button>
    </td>
</tr>
`;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        alert("❌ Cannot fetch weather records.");
        console.error(error);
    }
});


// ==============================
// DOWNLOAD RECORDS
// ==============================
const downloadBtn = document.getElementById("downloadBtn");
const formatSelect = document.getElementById("downloadFormat");

downloadBtn.addEventListener("click", async () => {
    const format = formatSelect.value;

    try {
        const response = await fetch(`${BASE_URL}/export/${format}`);

        if (!response.ok) {
            alert("❌ Could not download file.");
            return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `weather.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);

    } catch (error) {
        alert("❌ Error downloading file.");
        console.error(error);
    }
});


// ==============================
// DELETE RECORD
// ==============================
document.addEventListener("click", async function (event) {
    if (event.target.classList.contains("delete-btn")) {
        
        const id = event.target.getAttribute("data-id");
        if (!confirm("Are you sure you want to delete this record?")) return;

        try {
            const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
            const result = await response.json();

            alert(result.message);
            viewBtn.click();

        } catch (err) {
            alert("❌ Error deleting record.");
            console.error(err);
        }
    }
});


// ==============================
// LOAD RECORD INTO UPDATE FORM
// ==============================
document.addEventListener("click", async function (event) {
    if (event.target.classList.contains("update-btn")) {

        const id = event.target.getAttribute("data-id");

        const response = await fetch(`${BASE_URL}/${id}`);
        const record = await response.json();

        const weather = record.temperatures[0];

        document.getElementById("Location").value = record.locationInput;
        document.getElementById("StartDateUpdate").value =
        record.startDate.split("T")[0];

        document.getElementById("EndDateUpdate").value =
        record.endDate.split("T")[0];

        document.getElementById("Temperature").value = weather.temp;
        document.getElementById("Description").value = weather.description;
        document.getElementById("Humidity").value = weather.humidity ?? "";
        document.getElementById("WindSpeed").value = weather.windSpeed ?? "";

        document.getElementById("updateBtn").setAttribute("data-id", id);

        alert("Record loaded into update form!");
    }
});


// ==============================
// UPDATE WEATHER RECORD
// ==============================
const updateBtn = document.getElementById("updateBtn");

updateBtn.addEventListener("click", async () => {
    const id = updateBtn.getAttribute("data-id");

    if (!id) {
        alert("Please select a record to update.");
        return;
    }

    const updatedData = {
        location: document.getElementById("Location").value,
         "startDate": document.getElementById("StartDateUpdate").value,
         "endDate": document.getElementById("EndDateUpdate").value,
        temp: document.getElementById("Temperature").value,
        description: document.getElementById("Description").value,
        humidity: document.getElementById("Humidity").value,
        windSpeed: document.getElementById("WindSpeed").value,
    };

    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });

        const result = await response.json();

        if (!response.ok) {
            alert("Update failed: " + (result.message || "Unknown error"));
            return;
        }

        alert("Record updated!");
        viewBtn.click();

    } catch (error) {
        alert("Update failed.");
        console.error(error);
    }
});


// ==============================
// WEATHER FROM USER GPS LOCATION
// ==============================
const currentLocationBtn = document.getElementById("currentLocationBtn");

currentLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported in your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(success, error);

    function success(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(`${BASE_URL}/current`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lon }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    alert(data.message);
                    return;
                }

                resultDiv.innerHTML = `
                    <h2>Weather From Your Current Location</h2>
                    <p><strong>Temperature:</strong> ${data.temp} °C</p>
                    <p><strong>Description:</strong> ${data.description}</p>
                    <p><strong>Humidity:</strong> ${data.humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${data.windSpeed} m/s</p>
                `;
            })
            .catch((err) => {
                alert("Could not fetch weather from location.");
                console.error(err);
            });
    }

    function error() {
        alert("Please allow location access.");
    }
});


// ==============================
// AUTOCOMPLETE: Fetch Suggestions
// ==============================
locationInput.addEventListener("input", async function () {
    const query = locationInput.value.trim();

    // Don't call backend for empty or 1-character input
    if (query.length < 2) {
        suggestionBox.innerHTML = "";
        suggestionBox.style.display = "none";
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/suggest?q=${query}`);
        const suggestions = await res.json();

        // Clear previous suggestions
        suggestionBox.innerHTML = "";

        if (!suggestions.length) {
            suggestionBox.style.display = "none";
            return;
        }

        // Show suggestions
        suggestions.forEach((item) => {
            const div = document.createElement("div");
            div.textContent = item.name;
            div.classList.add("suggestion-item");

            // When user clicks a suggestion
            div.addEventListener("click", () => {
                locationInput.value = item.name; // fill input box
                suggestionBox.innerHTML = ""; // hide dropdown
                suggestionBox.style.display = "none";
            });

            suggestionBox.appendChild(div);
        });

        suggestionBox.style.display = "block";

    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
});
