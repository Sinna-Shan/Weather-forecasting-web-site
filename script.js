let time = document.querySelector(".time");
let date = document.querySelector(".date");
let greating = document.querySelector(".greating");
let body = document.querySelector(".body");
let light = document.querySelector(".fa-sun");
let dark = document.querySelector(".fa-moon");
let error = document.querySelector(".errMsg");
let googleMap = document.querySelector(".google-map");

let inputField = document.querySelector(".input-field");
let btnSearch = document.querySelector(".search-btn");

let tempereture = document.querySelector(".mid-weather-num");
let centerCard = document.querySelector(".mid-info");
let midInfo = document.querySelector(".mid-weather-info");
let midImg = document.querySelector(".mid-img");
let windSpeed = document.querySelector(".wind-speed-value");
let humidity = document.querySelector(".humidity-value");
let crousel = document.querySelector(".crousel");
let hourTime = document.querySelector(".hour-date");
let hourTemp = document.querySelector(".hour-temp");
let up = document.querySelector('.fa-arrow-up');
let down = document.querySelector('.fa-arrow-down');

let obj;
let selectedMood = 0;
let count = getLocalTime().getHours();

setInterval((e) => {
  time.innerHTML = getLocalTime().toLocaleTimeString();
}, 1000);
date.innerHTML = getLocalTime().toLocaleDateString();
greating.innerHTML = great(getLocalTime());
getData();
darkMood();
function getLocalTime() {
  return new Date();
}

function great(time) {
  let hour = time.getHours();
  if (hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 15) {
    return "Good Afternoon";
  } else if (hour >= 15 && hour < 21) {
    return "Good Evening";
  } else if (hour >= 21 && hour < 24) {
    return "Good Night";
  }
}

btnSearch.addEventListener('click', () => {
  getData();
});

light.addEventListener("click", () => {
  selectedMood = 1;
  lightMood();
});

dark.addEventListener("click", () => {
  selectedMood = 0;
  darkMood();
});

function lightMood(){
  light.classList.add("active");
  dark.classList.remove("active");
  document.querySelector('.body').style.backgroundImage= "Url(https://images.unsplash.com/photo-1693280833536-34fa42fc459e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1797&q=80)";
  document.querySelector('.container').style.backgroundColor= "rgb(199, 222, 250,0.7)";
  document.querySelectorAll('.Light').forEach((i)=>{
    i.classList.remove('Light');
    i.classList.add('Dark')
  })
}
function darkMood(){
  dark.classList.add("active");
  light.classList.remove("active");
  document.querySelector('.body').style.backgroundImage= "Url(https://images.unsplash.com/photo-1468476396571-4d6f2a427ee7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1958&q=80)";
  document.querySelector('.container').style.backgroundColor= "rgba(0, 0, 0, 0.8)";
  document.querySelectorAll('.Dark').forEach((i)=>{
    i.classList.remove('Dark');
    i.classList.add('Light')
  })
}

function forcast(data){
  crousel.innerHTML='';
  for(let i = 1; i < data.forecast.forecastday.length;i++){
    addCards(data.forecast.forecastday[i]);
   }
}

function addCards(data) {
  // console.log(data);
  let card = document.createElement("div");
  let temp = document.createElement("p");
  let unit = document.createElement("p");
  let cardDate = document.createElement("p");
  let status = document.createElement("p");
  
  if(selectedMood == 0){
    card.classList.add("card", "Light");
    temp.classList.add("temp", "Light");
    unit.classList.add("unit", "Light");
    cardDate.classList.add("card-date", "Light");
    status.classList.add("status", "Light");
  }else{
    card.classList.add("card", "Dark");
    temp.classList.add("temp", "Dark");
    unit.classList.add("unit", "Dark");
    cardDate.classList.add("card-date","Dark");
    status.classList.add("status", "Dark");
  }
 
  temp.innerHTML = Math.round(data.day.avgtemp_c);
  unit.innerHTML = "<sup>o</sup>C";
  cardDate.innerHTML = data.date;
  status.innerHTML = data.day.condition.text;

  crousel.appendChild(card);
  
  card.appendChild(cardDate);
  card.appendChild(temp);
  card.appendChild(unit);
  card.appendChild(status);
}

function getData(){
  fetch(
    `https://api.weatherapi.com/v1/forecast.json?q=${inputField.value}&days=7&key=7f49e6df628745e38d4160010231909`
  )
    .then((res) => res.json())
    .then((data) => {
      obj = data;
      if(data.error ){
        if(data.error.code == 1003) {
          centerCard.classList.add('hidden');
          
          error.innerHTML = "Please enter City";
          // console.log(data);
        }else if(data.error.code == 1006){
          centerCard.classList.add('hidden');
          // console.log(data);
          error.innerHTML = "No matching location found.";
        }
      }else{
        console.log(data);
        error.innerHTML = "";
        midImg.src = data.current.condition.icon;
        tempereture.innerHTML = Math.round(data.current.temp_c) + "<sup> o</sup>";
        windSpeed.innerHTML = data.current.wind_mph;
        humidity.innerHTML = data.current.humidity + "%";
        midInfo.innerHTML=data.current.condition.text;
        centerCard.classList.remove('hidden');
        forcast(data);
        hourlyWeather(data);
        myMap(data)
      }
    });
}

up.addEventListener('click',()=>{
  count++;
  count>=23 ? up.classList.add('hidden') : down.classList.remove('hidden');
  hourlyWeather(obj);
  console.log('clicked');
  console.log(count);
  
});
down.addEventListener('click',()=>{
  count--;
  count<=0 ? down.classList.add('hidden') : up.classList.remove('hidden');
  hourlyWeather(obj);
  console.log('clicked');
  console.log(count);
});

function hourlyWeather(data){
  let date = data.forecast.forecastday[0].hour[count].time;
  let temp = data.forecast.forecastday[0].hour[count].temp_c;
  let time = date.split(" ");
  hourTime.innerHTML = parseInt(time[1])<12 ? time[1] + " AM" : time[1] + " PM";
  hourTemp.innerHTML = Math.round(temp) + " <sup>o</sup>C";

}

function myMap(data) {
  let lati = data.location.lat;
  let lon = data.location.lon;
  let mapProp= {
    center:new google.maps.LatLng(lati,lon),
    zoom:14,
  };

  let map = new google.maps.Map(document.getElementById("map"),mapProp);
  let marker = new google.maps.Marker({
    position:new google.maps.LatLng(lati,lon),
    map:map,
    title:data.location.name
  });

  
  }