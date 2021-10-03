var cities = [];

var previousSearchesEl = document.querySelector("#past-search-buttons");
var cityResultsEl=document.querySelector("#city");
var cityListEl=document.querySelector("#city-search-form");
var citySearchBarEl = document.querySelector("#searched-city");
var weatherContainerEl=document.querySelector("#current-weather-container");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");



var formSumbitHandler = function(event){
    event.preventDefault();
    var city = cityResultsEl.value.trim();
    if(city){
        getCurrentWeather(city);
        getFiveDayWeather(city);
        cities.unshift({city});
        cityResultsEl.value = "";
    } else{
        alert("Please enter a City");
    }
    saveSearch();
    pastSearch(city);
}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCurrentWeather = function(city){
    var myAPIkey = "296ed1d5b0b1577dafb10b0d00164d10"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${myAPIkey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            weatherDisplay(data, city);
        });
    });
};

var weatherDisplay = function(weather, searchCity){
   weatherContainerEl.textContent= "";  
   citySearchBarEl.textContent=searchCity;


 //pull weather icons from openweathermap
var openWeatherIcons = document.createElement("img")
    openWeatherIcons.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchBarEl.appendChild(openWeatherIcons);

 //Temperature data
var tempEl = document.createElement("span");
    tempEl.textContent = "Temperature: " + weather.main.temp + " °F";
    tempEl.classList = "list-group-item"

// Windspeed data
var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"
 
  
//Humidity data
var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item"

//moments to create date
var currentDate = document.createElement("span")
  currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  citySearchBarEl.appendChild(currentDate);

   
   weatherContainerEl.appendChild(tempEl);
   weatherContainerEl.appendChild(humidityEl);
   weatherContainerEl.appendChild(windSpeedEl);

// get UV data
   var lat = weather.coord.lat;
var lon = weather.coord.lon;
   uvIndexEl(lat,lon)
}

var uvIndexEl = function(lat,lon){
    var myAPIkey = "296ed1d5b0b1577dafb10b0d00164d10"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${myAPIkey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            uvIndexDisplay(data)
        });
    });
}
 
var uvIndexDisplay = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexColor = document.createElement("span")
    uvIndexColor.textContent = index.value

    if(index.value <=2){
        uvIndexColor.classList = "low"
    }else if(index.value >2 && index.value<=5){
        uvIndexColor.classList = "moderate"
    }else if(index.value >5 && index.value<=7){
        uvIndexColor.classList = "high"
    }else if(index.value >7 && index.value<=10){
        uvIndexColor.classList = "danger"
    }else if(index.value >10) {
        uvIndexColor.classList = "extreme"
    };
    

    uvIndexEl.appendChild(uvIndexColor);
    weatherContainerEl.appendChild(uvIndexEl);
}


//5 Day Forecast cards
var getFiveDayWeather = function(city){
    var myAPIkey = "296ed1d5b0b1577dafb10b0d00164d10"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${myAPIkey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           fiveDayDisplay(data);
        });
    });
};

var fiveDayDisplay = function(weather){
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

 var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";


//temp for cards
var forecastTempEl=document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = "Temp: " + dailyForecast.main.temp + "°F";

//moments date for 5 day cards
var forecastDate = document.createElement("h5")
      forecastDate.textContent= moment.unix(dailyForecast.dt).format("ddd MMMM Do, YYYY");
      forecastDate.classList = "card-header text-center"
      forecastEl.appendChild(forecastDate);       
    
//weather icons
var openWeatherIcons = document.createElement("img")
       openWeatherIcons.classList = "card-body text-center";
       openWeatherIcons.setAttribute("src",`https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
       forecastEl.appendChild(openWeatherIcons);
       



    
       forecastEl.appendChild(forecastTempEl);

//humidity for cards
var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = "Humidity: " + dailyForecast.main.humidity + "%";

       
       forecastEl.appendChild(forecastHumEl);

       
       forecastContainerEl.appendChild(forecastEl);
    }

}

var pastSearch = function(pastSearch){
 
    // console.log(pastSearch)

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    previousSearchesEl.prepend(pastSearchEl);
}



var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCurrentWeather(city);
        getFiveDayWeather(city);
    }
};

 

cityListEl.addEventListener("submit", formSumbitHandler);
previousSearchesEl.addEventListener("click", pastSearchHandler);
