import axios from "axios";

const GOOGLE_API_KEY = process.env.API_KEY;
// Code goes here!
//npm install --save @types/googlemaps

const form = document.querySelector("form")!;
const addressInput = <HTMLInputElement>document.getElementById("address")!;



type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  //send this to GOOGLE'S API
  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((response) => {
      if (response.data.status !== "OK") {
        throw new Error("Could not fetch Location");
      }
      const coordinates = response.data.results[0].geometry.location;
      const map = new google.maps.Map(<HTMLDivElement>document.getElementById("map"), {
        center: coordinates,
        zoom: 16,
      });

      new google.maps.Marker({
        map: map,
        position: coordinates,
        title: enteredAddress,
      });
    })
    .catch((error) => {
      alert(error.message);
      console.log(error);
    });
}

form.addEventListener("submit", searchAddressHandler);
