const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// Assuming you have your HTML structure with these IDs
var btnCreate = document.getElementById('btnCreate');
var btnRead = document.getElementById('btnRead');
var btnDelete = document.getElementById('btnDelete');
var fileName = document.getElementById('fileName');
var fileContents = document.getElementById('fileContents');
var itineraryList = document.getElementById('itinerary_list'); // Reference to the list
var itineraryDisplay = document.getElementById('itineraryDisplay'); // Reference to the display section
var displayContents = document.getElementById('displayContents'); // Reference to the display text area

let pathName = path.join(__dirname, "Files");

// Ensure the directory exists
if (!fs.existsSync(pathName)) {
    fs.mkdirSync(pathName, { recursive: true });
}

// Function to refresh the itinerary list
function refreshItineraryList() {
    // Clear the existing list
    itineraryList.innerHTML = '';
    
    // Read the directory to get files
    fs.readdir(pathName, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        // Display each file
        files.forEach(file => {
            let li = document.createElement('li');
            li.textContent = file; // Set the text to the file name
            itineraryList.appendChild(li); // Add to the list
        });
    });
}

// Call this function on page load to display existing files
refreshItineraryList();

// Event Listener for Creating a New Itinerary
btnCreate.addEventListener('click', function() {
    let file = path.join(pathName, fileName.value.trim()); // Trim any whitespace
    let contents = fileContents.value;

    // Check if fileName is not empty
    if (!fileName.value.trim()) {
        alert('Please enter a valid file name.');
        return;
    }

    // Check if file already exists
    fs.access(file, fs.constants.F_OK, (err) => {
        if (!err) {
            // File exists
            alert('File already exists. Please choose a different file name.');
            return;
        }

        // Retrieve weather data from localStorage, if available
        const savedData = JSON.parse(localStorage.getItem('weatherData'));
        let weatherInfo = '';

        if (savedData) {
            weatherInfo = `
            \n\n--- Saved Weather Information ---
            Location: ${savedData.location}
            Time: ${savedData.time}
            Temperature: ${savedData.temperature}
            Wind Speed: ${savedData.windSpeed}
            Humidity: ${savedData.humidity}
            Condition: ${savedData.weatherDescription}
            `;
        }

        // Append weather info to the itinerary content
        const finalContents = contents + weatherInfo;

        // Write to the file
        fs.writeFile(file, finalContents, function(err) {
            if (err) {
                console.error(err);
                alert('Error creating file: ' + err.message);
                return;
            }
            alert(`${fileName.value} text file was created with weather data.`);
            console.log('The file was created with weather data.');
            
            // Clear input fields
            document.getElementById('fileContents').value = '';
            document.getElementById('fileName').value = '';
            
            // Refresh itinerary list after creating a file
            refreshItineraryList();
        });
    });
});



// Event Listener for Reading an Itinerary
btnRead.addEventListener('click', function() {
    let file = path.join(pathName, fileName.value.trim());

    if (!fileName.value.trim()) {
        alert('Please enter a valid file name');
        return;
    }

    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.error(err);
            alert('Error reading file: ' + err.message);
            return;
        }
        fileContents.value = data; // Assuming data is a string
        console.log("The file was display.");
        alert(`${fileName.value} file is display.`);
        // Display the itinerary contents
        displayContents.textContent = data; // Set the display contents
        itineraryDisplay.style.display = 'block'; // Show the display section
    });
});

// Event Listener for Deleting an Itinerary
btnDelete.addEventListener('click', function() {
    let file = path.join(pathName, fileName.value.trim());

    if (!fileName.value.trim()) {
        alert('Please enter a valid file name');
        return;
    }

    fs.unlink(file, function(err) {
        if (err) {
            console.error(err);
            alert('Error deleting file: ' + err.message);
            return;
        }
        fileName.value = '';
        fileContents.value = '';
        console.log('The file was deleted.');
        alert(`${fileName.value} file has been deleted`);
        refreshItineraryList(); // Refresh the list after deleting a file
        itineraryDisplay.style.display = 'none'; // Hide the display section after deletion
    });
});

window.onload = function() {
    // Retrieve the data from localStorage
    const savedData = JSON.parse(localStorage.getItem('weatherData'));

    if (savedData) {
        // Display data on planner.html
        document.getElementById('savedWeatherData').innerHTML = `
            <p><strong>Location:</strong> ${savedData.location}</p>
            <p><strong>Time:</strong> ${savedData.time}</p>
            <p><strong>Temperature:</strong> ${savedData.temperature}</p>
            <p><strong>Wind Speed:</strong> ${savedData.windSpeed}</p>
            <p><strong>Humidity:</strong> ${savedData.humidity}</p>
            <p><strong>Condition:</strong> ${savedData.weatherDescription}</p>
        `;
    } else {
        document.getElementById('savedWeatherData').innerText = "No data saved.";
        btnDeleteWeather.style.display = 'none'; // Hide the delete button if no data
    }

    // Event listener for deleting saved weather data
    btnDeleteWeather.addEventListener('click', function() {
        localStorage.removeItem('weatherData'); // Remove data from localStorage
        savedWeatherData.innerText = "No data saved."; // Update display
        btnDeleteWeather.style.display = 'none'; // Hide delete button after deletion
        alert("Data has been deleted.");
    });
};

        // JavaScript to change header color on scroll
        window.addEventListener("scroll", function() {
            const header = document.getElementById("header");
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });

// Reference to the Update button
var btnUpdate = document.getElementById('btnUpdate');

// Event Listener for Updating an Itinerary
btnUpdate.addEventListener('click', function() {
    let file = path.join(pathName, fileName.value.trim()); // Get file path
    let contents = fileContents.value; // Get updated contents

    if (!fileName.value.trim()) {
        alert('Please enter a valid file name');
        return;
    }

    // Check if the file exists before updating
    fs.access(file, fs.constants.F_OK, (err) => {
        if (err) {
            alert("File does not exist. Please create it first.");
            return;
        }

        // Append weather info to the updated itinerary content
        const finalContents = contents

        // Write the updated contents to the file
        fs.writeFile(file, finalContents, function(err) {
            if (err) {
                console.error(err);
                alert('Error updating file: ' + err.message);
                return;
            }
            alert(`${fileName.value} text file was updated`);
            console.log('The file was updated with new weather data');
                        // Clear input fields
            document.getElementById('fileContents').value = '';
            document.getElementById('fileName').value = '';
            
            // Refresh itinerary list after updating
            refreshItineraryList();
            
            // Display updated contents
            displayContents.textContent = finalContents;
            itineraryDisplay.style.display = 'block';
        });
    });
});
