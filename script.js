const key = config.API_KEY

const searchButton = document.getElementById('search-button')
const searchInput = document.getElementById('search-weather')
const current = document.getElementById('current-temp')
const highLow = document.getElementById('highLow-temp')
const currentCondition = document.querySelector('.weather').querySelector('.icon')
const unitButton = document.getElementById('toggle')
let toggled = true;

const forecastDays = [  
  { header: document.getElementById('day1').querySelector('header'), 
    temp: document.getElementById('day1').querySelector('.container').querySelector('.temp'),
    icon: document.getElementById('day1').querySelector('.container').querySelector('.icon')
  },
  { header: document.getElementById('day2').querySelector('header'), 
    temp: document.getElementById('day2').querySelector('.container').querySelector('.temp'),
    icon: document.getElementById('day2').querySelector('.container').querySelector('.icon') 
  },
  { header: document.getElementById('day3').querySelector('header'), 
    temp: document.getElementById('day3').querySelector('.container').querySelector('.temp'),
    icon: document.getElementById('day3').querySelector('.container').querySelector('.icon')
  },
  { header: document.getElementById('day4').querySelector('header'), 
    temp: document.getElementById('day4').querySelector('.container').querySelector('.temp'),
    icon: document.getElementById('day4').querySelector('.container').querySelector('.icon')
  },
  { header: document.getElementById('day5').querySelector('header'), 
    temp: document.getElementById('day5').querySelector('.container').querySelector('.temp'),
    icon: document.getElementById('day5').querySelector('.container').querySelector('.icon') 
  }
]

searchButton.addEventListener('click', () => {
  if(toggled)
    searchWeather(searchInput, 'Fahrenheit')
  else
    searchWeather(searchInput, 'Celsius')
})

unitButton.addEventListener('click', () => {
  toggled = !toggled
  if(toggled)
    searchWeather(searchInput, 'Fahrenheit')
  else
    searchWeather(searchInput, 'Celsius')
})

async function searchWeather(input, unit) {
  const inputValue = input.value
  displayWeather(inputValue, unit)
}

async function displayWeather(cityName, unit) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}`)
    const data = await response.json()
    const temperature = data.main.temp 
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    const onecallResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${key}`);
    const onecallData = await onecallResponse.json();
    console.log(onecallData)
    const dailyData = onecallData.daily[0];
    const highTemp = dailyData.temp.max
    const lowTemp = dailyData.temp.min
    current.innerHTML = `${converter(unit,temperature)}\u00B0`
    highLow.innerHTML = `H:${converter(unit,highTemp)}\u00B0 L:${converter(unit,lowTemp)}\u00B0`
    currentCondition.className = 'icon ' + weatherCondition(dailyData.weather[0].main)
    
    const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

    for(let i = 0; i < 5; i++) {
      const dayData = onecallData.daily[i+1]
      const day = new Date(1000*dayData.dt)
      forecastDays[i].header.innerHTML = `${daysOfWeek[day.getDay()]}`
      forecastDays[i].temp.innerHTML = `${converter(unit,dayData.temp.day)}\u00B0`
      forecastDays[i].icon.className = 'icon ' + weatherCondition(dayData.weather[0].main)
    }

  }
  catch(error) {
    console.log(error)
  }
}

function converter(type, K) {
  if(type === 'Fahrenheit') {
    return Math.ceil(1.8*(K - 273) + 32)
  }
  if(type === 'Celsius') {
    return Math.ceil(K - 273)
  }
}

function weatherCondition(condition) {
  if(condition === 'Thunderstorm') {
    return 'thunderstorm'
  }
  else if(condition === 'Snow') {
    return 'snow'
  }
  else if(condition === 'Drizzle' || condition === 'Rain') {
    return 'rain'
  }
  else {
    return 'cloud'
  }
}



