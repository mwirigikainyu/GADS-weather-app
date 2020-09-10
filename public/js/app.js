const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

/**
 * Check if storage has any data and display it if yes
 */
if (window.localStorage.length > 0) {
  Object.keys(window.localStorage).forEach((item) => {
    weatherData = window.localStorage.getItem(item);
    weatherData = JSON.parse(weatherData);
    buildListItem(weatherData);
  });
}

/**
 * On submitting a form, we call the api and build the list items
 * to display
 */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const apiKey = "8a6e61a742c62d45e8c5aef97f58cdf6";
  const inputVal = input.value;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      buildListItem(data);

      /**
       * after building the ui after a request, we save the data to storage
       * note that the key has to be unique so if you search the same city twice,
       * it will be saved only once
       *
       */
      window.localStorage.setItem(inputVal, JSON.stringify(data));
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city.";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});

/**
 * code for building a service worker
 */
if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("./serviceworker.js")
    .then(() => {
      console.log("ServiceWorker registration successful");
    })
    .catch((err) => {
      console.log("ServiceWorker registration failed", err);
    });
}

/**
 *
 * @param {*} data - data from either local storage or the api
 * we use it to build the list items that are displayed on screen
 */
function buildListItem(data) {
  const { main, name, sys, weather } = data;
  const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

  const li = document.createElement("li");
  li.classList.add("city");
  const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
  li.innerHTML = markup;
  list.appendChild(li);
}

/**
 * This method is called by the clear data button. We clear all the storage items
 * and then refresh the page for good ux
 */
function clearStorage() {
  window.localStorage.clear();
  window.location.reload();
}
