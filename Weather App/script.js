const KEY = 'c04e13df2c893d62ac5a47a46ee6740c' ;

async function fetch_weather(city){

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}`;
  const response = await fetch(url);
  if(response.status !== 200){
    throw new Error('Cannot find the data');
  }
  const data = await response.json();
  return data ;
}

function set_weather(city) {
  fetch_weather(city).then( weather => {
    save_city(city);
    let currentImg = document.getElementById("image");
    city = city.charAt(0).toUpperCase() + city.slice(1);
    let stat = weather.weather[0].main;
    document.getElementById("temper").innerHTML = Math.round(weather.main.temp - 273.15) + "°C";
    document.getElementById("city").innerHTML = city;
    document.getElementById("hum").innerHTML = weather.main.humidity + "%";
    document.getElementById("wind").innerHTML = Math.round( ((weather.wind.speed) * 3.6) ) + " km/h";
    //window.alert(stat);
    if(stat == "Clear") currentImg.src = 'icons/sunny.png';
    else if(stat == "Clouds" ) currentImg.src = 'icons/Cloudy.png';
    else if(stat == "Rain") currentImg.src = 'icons/Rain.png'
    else if(stat == "Thunderstorm") currentImg.src = 'icons/Storm.png'
    else if(stat == "Snow") currentImg.src = 'icons/Snowy.png'
  

    if(stat == "Clear" || stat == "Rain") {
      currentImg.style.width = '60px'; //change the image from ai or change width and height
    }else{
      currentImg.style.width = '95%';
    }

    

    let hours = get_time(weather);
    if((hours >= 18 || hours<6) && stat == "Clear"){
      currentImg.src = "icons/clearnight.png";

    }
  }
  ).catch( (err) => {
    window.alert('Rejecte : ' + err);   
  }
  )
}


function get_time(weather){
  let timeElapsed = weather.dt;
  let timezoneOffset = weather.timezone;
  let utcDate = new Date(timeElapsed * 1000);
  let localDate = new Date(utcDate.getTime() + (timezoneOffset * 1000));
  let hours = localDate.getHours();
  return hours;
}


function search_weather(){
  let city = document.getElementById("input").value;
  document.getElementById("input").value = "";
  set_weather(city);
}

function save_city(city) {
  sessionStorage.setItem("city", JSON.stringify(city));
}

function load_city(){
  let loaded_city = sessionStorage.getItem("city");
  loaded_city = JSON.parse(loaded_city);
  return loaded_city;
}

window.onload = function() {
  if(load_city()) set_weather(load_city());
  else set_weather("New york"); 
}


//final_weather();

