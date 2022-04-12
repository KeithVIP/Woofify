var apiKey = "grant_type=client_credentials&client_id={2Qiy6zxPX4cqcreCD0PTgJywBchv2BDtG42IM7RwTW1PHG8g4w}&client_secret={fDx4XUleqccTErZV49aF3wFoGRGMChEOguFxCqDQ}" 
var searchHistory = JSON.parse(localStorage.getItem("adoption")) || []

function getPets(search) {
    var apiUrl = "GET https://api.petfinder.com/v2/types/{type}" = apiKey
    fetch(apiUr1)
    .then(function (response) {
      return response.json()
    }).then(function(data) {
      document.getElementById("adoption").textContent="";
    })
  }

  document.getElementById(searchButton).addEventListener("click", function(event) {
    event.peventDrefault();
    getPets(searchInput.value)
})


