function buttonClicked() {    
    var city = document.getElementById('city_input').value;
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=32804b24a847407391c53709241010&q=${city}&days=3`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);  // For debugging and to check the data structure
        
        // Location and current weather info
        var name = data.location.name;
        var region = data.location.region;
        var country = data.location.country;
        var time = data.location.localtime;
        var temp = data.current.temp_c;
        var feelslike = data.current.feelslike_c;
        var windSpeed = data.current.wind_kph;
        var humidity = data.current.humidity;
        var weatherDesc = data.current.condition.text; // Description of current weather
        var weatherIcon = data.current.condition.icon;

        // Update location and current weather details
        document.getElementById('demo3').innerHTML = name + ", " + region + ", " + country;
        document.getElementById('demo1').innerHTML = "Local Time: " + time;
        document.getElementById('demo2').innerHTML = "Temperature: " + temp + "°C";
        document.getElementById('demo4').innerHTML = "Feels Like: " + feelslike + "°C";
        document.getElementById('demo8').innerHTML = "Wind Speed: " + windSpeed + " kph";
        document.getElementById('demo9').innerHTML = "Humidity: " + humidity + "%";
        document.getElementById('demo10').innerHTML = "Weather: " + weatherDesc;
        document.getElementById('weatherIcon').src = "https:" + weatherIcon;

        // Forecast for yesterday, today, and tomorrow
        var forecastDays = ["yesterday", "today", "tomorrow"];
        
        for (var i = 0; i < forecastDays.length; i++) {
            var forecast = data.forecast.forecastday[i];
            var date = forecast.date;
            var avgTemp = forecast.day.avgtemp_c;
            var sunrise = forecast.astro.sunrise;
            var sunset = forecast.astro.sunset;
            var icon = forecast.day.condition.icon;
            var condition = forecast.day.condition.text;
            
            // Update HTML elements for each day
            document.getElementById(forecastDays[i] + "Date").innerHTML = "Date: " + date;
            document.getElementById(forecastDays[i] + "Temp").innerHTML = "Avg Temp: " + avgTemp + "°C";
            document.getElementById(forecastDays[i] + "Sunrise").innerHTML = "Sunrise: " + sunrise;
            document.getElementById(forecastDays[i] + "Sunset").innerHTML = "Sunset: " + sunset;
            document.getElementById(forecastDays[i] + "Condition").innerHTML = "Condition: " + condition;
            document.getElementById(forecastDays[i] + "Icon").src = "https:" + icon;
        }
        
        // Hourly forecast for the next 6 hours
        var hourlyForecast = data.forecast.forecastday[0].hour; // Get the hourly data for today
        var currentHourIndex = new Date().getHours(); // Get the current hour index (0-23)
        var hourlyHtml = "";

        // Loop for the next 6 hours starting from the current hour
        for (var i = 0; i < 12; i++) {
            var hourIndex = (currentHourIndex + i) % 24; // Wrap around if it exceeds 23
            var hourData = hourlyForecast[hourIndex]; // Get data for that hour
            var hourTime = hourData.time.split(' ')[1]; // Get just the time (HH:MM)
            var hourTemp = hourData.temp_c;
            var hourFeelsLike = hourData.feelslike_c; // Feels like temperature
            var hourCondition = hourData.condition.text;
            var hourIcon = hourData.condition.icon;
            var hourWindSpeed = hourData.wind_kph; // Wind speed
            var hourHumidity = hourData.humidity; // Humidity
            var hourSunrise = forecast.astro.sunrise; // Sunrise
            var hourSunset = forecast.astro.sunset; // Sunset

            // Construct the HTML for hourly forecast
            hourlyHtml += `
                <div class="hourly-forecast">
                    <h4>${hourTime}</h4>
                    <p>Temp: ${hourTemp}°C</p>
                    <p>Feels Like: ${hourFeelsLike}°C</p>
                    <p>Wind Speed: ${hourWindSpeed} kph</p>
                    <p>Humidity: ${hourHumidity}%</p>
                    <p>Sunrise: ${hourSunrise}</p>
                    <p>Sunset: ${hourSunset}</p>
                    <p>Condition: <br> ${hourCondition}</p>
                    <img src="https:${hourIcon}" alt="${hourCondition}" />
                </div>
            `;
        }

        // Update the HTML for hourly forecast
        document.getElementById('hourlyForecast').innerHTML = hourlyHtml;
        // Clothing recommendations based on temperature and weather condition
        var clothingRecommendation = "";
        var clothingImageSrc = "";  // Variable to hold the image source

        if (weatherDesc.toLowerCase().includes("rain")) {
            clothingRecommendation = "It's raining! Wear a waterproof jacket, umbrella, and waterproof shoes.";
            clothingImageSrc = "raining 1.jpg";  // Replace with the actual path to your image
        } else if (temp < 0) {
            clothingRecommendation = "It's freezing outside! Wear thermal layers, a heavy coat, gloves, and a warm hat.";
            clothingImageSrc = "freezing.jpg";
        } else if (temp >= 0 && temp < 10) {
            clothingRecommendation = "It's quite cold! A warm coat, scarf, and boots are recommended.";
            clothingImageSrc = "winter.jpg";
        } else if (temp >= 10 && temp < 15) {
            clothingRecommendation = "It's chilly! Wear a sweater or hoodie, long trousers, and closed shoes.";
            clothingImageSrc = "chilly.jpg";
        } else if (temp >= 15 && temp <= 25) {
            clothingRecommendation = "The weather is mild. A light jacket, t-shirt, and comfortable trousers would be great.";
            clothingImageSrc = "mild1.jpg";
        } else if (temp > 25 && temp <= 30) {
            clothingRecommendation = "It's warm! Consider wearing a t-shirt, shorts, and sandals.";
            clothingImageSrc = "warm.jpg";
        } else {
            clothingRecommendation = "It's hot outside! Thin, breathable clothes and sunglasses are recommended.";
            clothingImageSrc = "hot.jpg";
        }
        // Update clothing recommendation and image
        document.getElementById('clothingRecommendation').innerHTML = clothingRecommendation;
        var clothingImage = document.getElementById('clothingImg'); // Ensure this ID exists in your HTML
        clothingImage.src = clothingImageSrc; // Set the source of the clothing image
        clothingImage.style.display = "block"; // Make sure the image is visible
    });
}

        // JavaScript to change header color on scroll
        window.addEventListener("scroll", function() {
            const header = document.getElementById("header");
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });

        // Trigger search on page load with default city
        window.onload = function() {
            buttonClicked();
        };

        // Function to navigate to planner.html
        function goToPlanner() {
            window.location.href = 'planner.html';
        }

        // Simple function to save weather data (this can be replaced with actual implementation)
        function saveWeatherData() {
    // Assuming these elements contain the relevant weather information
    const weatherData = {
        location: document.getElementById('demo3').innerText,
        time: document.getElementById('demo1').innerHTML,
        temperature: document.getElementById('demo2').innerText,
        windSpeed: document.getElementById('demo8').innerText,
        humidity: document.getElementById('demo9').innerText,
        weatherDescription: document.getElementById('demo10').innerText,
        weatherIcon: document.getElementById('weatherIcon').src,
    };

    // Store data in localStorage as a JSON string
    localStorage.setItem('weatherData', JSON.stringify(weatherData));

    alert("Weather data saved!");
}

