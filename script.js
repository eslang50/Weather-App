const key = config.API_KEY

const searchButton = document.getElementById('search-button')
const searchInput = document.getElementById('search-weather')
const current = document.getElementById('current-temp')
const highLow = document.getElementById('highLow-temp')

const day1Header = document.getElementById('day1').querySelector('header')
const day2Header = document.getElementById('day2').querySelector('header')
const day3Header = document.getElementById('day3').querySelector('header')
const day4Header = document.getElementById('day4').querySelector('header')
const day5Header = document.getElementById('day5').querySelector('header')

const day1Temp = document.getElementById('day1').querySelector('div')
const day2Temp = document.getElementById('day2').querySelector('div')
const day3Temp = document.getElementById('day3').querySelector('div')
const day4Temp = document.getElementById('day4').querySelector('div')
const day5Temp = document.getElementById('day5').querySelector('div')

searchButton.addEventListener('click', () => {
  searchWeather(searchInput)
})

async function searchWeather(input) {
  const inputValue = input.value
  displayWeather(inputValue)
}

async function displayWeather(cityName) {
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
    current.innerHTML = `${converter('Fahrenheit',temperature)}\u00B0`
    highLow.innerHTML = `H:${converter('Fahrenheit',highTemp)}\u00B0 L:${converter('Fahrenheit',lowTemp)}\u00B0`

    const day1Data = onecallData.daily[1]
    const day2Data = onecallData.daily[2]
    const day3Data = onecallData.daily[3]
    const day4Data = onecallData.daily[4]
    const day5Data = onecallData.daily[5]

    const day1Day = new Date(1000*day1Data.dt)
    const day2Day = new Date(1000*day2Data.dt)
    const day3Day = new Date(1000*day3Data.dt)
    const day4Day = new Date(1000*day4Data.dt)
    const day5Day = new Date(1000*day5Data.dt)
    const daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

    day1Header.innerHTML = `${daysOfWeek[day1Day.getDay()]}`
    day2Header.innerHTML = `${daysOfWeek[day2Day.getDay()]}`
    day3Header.innerHTML = `${daysOfWeek[day3Day.getDay()]}`
    day4Header.innerHTML = `${daysOfWeek[day4Day.getDay()]}`
    day5Header.innerHTML = `${daysOfWeek[day5Day.getDay()]}`

    day1Temp.innerHTML = `${converter('Fahrenheit',day1Data.temp.day)}\u00B0`
    day2Temp.innerHTML = `${converter('Fahrenheit',day2Data.temp.day)}\u00B0`
    day3Temp.innerHTML = `${converter('Fahrenheit',day3Data.temp.day)}\u00B0`
    day4Temp.innerHTML = `${converter('Fahrenheit',day4Data.temp.day)}\u00B0`
    day5Temp.innerHTML = `${converter('Fahrenheit',day5Data.temp.day)}\u00B0`
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

