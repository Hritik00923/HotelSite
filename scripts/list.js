const url = window.location.search;
const urlParams = new URLSearchParams(url);
const city = urlParams.get("city");
const apiURL = `https://travel-advisor.p.rapidapi.com/locations/search?query=${city}&limit=30&offset=0&units=km&location_id=1&currency=USD&sort=relevance&lang=en_US`;
const key = "7f9f15f992mshda3749cebff6b34p1f5740jsn7e5848b768e0";

const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  if (xhr.readyState == 4 && xhr.status == 200) {
    const jsonData = JSON.parse(this.responseText);
    renderListView(jsonData.data);
    document.getElementById("loader").style.display = "none";
    document.getElementById("Main").style.display = "block";
    initMap();
  }
};

xhr.onerror = function() {
  console.error('Error fetching data');
};

xhr.open("GET", apiURL);
xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
xhr.setRequestHeader("x-rapidapi-key", key);
xhr.send();

function renderListView(data) {
  const hotels = data
    .filter(item => item.result_type === "lodging")
    .map(item => {
      const { name, rating, address, location_id } = item.result_object;
      return `
        <div class="hotels">
          <a href="detail.html?id=${location_id}">
            <div class="clickImage">
              <img src="${item.result_object.photo.images.large.url}" alt="${name}">
              <div class="hotelDetails">
                <h3>${name}</h3>
                <p>${rating}<i class="fa-solid fa-star fill"></i></p>
                <p>${address}</p>
              </div>
            </div>
          </a>
        </div>`;
    })
    .join("");

  document.getElementById("listView").innerHTML = hotels;
}

function initMap() {
  const mapOptions = {
    center: { lat: mapDetails[0].lat, lng: mapDetails[0].lng },
    zoom: 10,
  };

  const map = new google.maps.Map(document.getElementById("mapView"), mapOptions);

  mapDetails.forEach(data => {
    const marker = new google.maps.Marker({
      position: { lat: data.lat, lng: data.lng },
      map: map,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<p>${data.name}</p><a href="detail.html?id=${data.locationId}">Book Now</a>`,
    });

    marker.addListener("click", function () {
      infoWindow.open(map, marker);
    });
  });
}
