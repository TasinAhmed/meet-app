import React, { useCallback, useEffect, useState } from "react";
import { DirectionsRenderer, DirectionsService, GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 43.653225,
  lng: -79.383186,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#e9e9e9",
        },
        {
          lightness: 17,
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        {
          color: "#f5f5f5",
        },
        {
          lightness: 20,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffffff",
        },
        {
          lightness: 17,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#ffffff",
        },
        {
          lightness: 29,
        },
        {
          weight: 0.2,
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          color: "#ffffff",
        },
        {
          lightness: 18,
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [
        {
          color: "#ffffff",
        },
        {
          lightness: 16,
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#f5f5f5",
        },
        {
          lightness: 21,
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#dedede",
        },
        {
          lightness: 21,
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#ffffff",
        },
        {
          lightness: 16,
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          saturation: 36,
        },
        {
          color: "#333333",
        },
        {
          lightness: 40,
        },
      ],
    },
    {
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [
        {
          color: "#f2f2f2",
        },
        {
          lightness: 19,
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#fefefe",
        },
        {
          lightness: 20,
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#fefefe",
        },
        {
          lightness: 17,
        },
        {
          weight: 1.2,
        },
      ],
    },
  ],
};
let i = 0;
function Map({ users }) {
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [directionResults, setDirectionResults] = useState(null);

  const mapClick = useCallback(
    ({ latLng }) =>
      setMarkers((current) => [
        ...current,
        { lat: latLng.lat(), lng: latLng.lng() },
      ]),
    []
  );

  useEffect(() => {
    if (!selected || !users) return;
    const directionsService = new window.google.maps.DirectionsService();

    //every user = 1 direction service api call. Set a MAX for now.
    const MAX = 3;
    const resultPromises = users.slice(0,MAX).map(user => {
      console.log(user);
      return new Promise((resolve, reject) => {
        directionsService.route({
          origin: new window.google.maps.LatLng(user.coordinates.lat, user.coordinates.lng),
          destination: new window.google.maps.LatLng(selected.lat, selected.lng),
          travelMode: window.google.maps.TravelMode.DRIVING,
        }, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            resolve(result);
          } else {
            alert(`error fetching directions ${result}`);
            reject(result);
          }
        }); 
      });
    });

    Promise.all(resultPromises).then(results => {
      console.log(results);
      setDirectionResults(results);
    });
    
  },[selected]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={options}
      onClick={mapClick}
    >
      {users.map(({ coordinates }, key) => (
        <Marker
          key={key}
          position={{ lat: coordinates.lat, lng: coordinates.lng }}
          icon={{
            url: "/user.png",
            scaledSize: new window.google.maps.Size(45, 45),
          }}
        />
      ))}
      {markers.map((marker, key) => (
        <Marker
          icon={{
            url: "/location.png",
            scaledSize: new window.google.maps.Size(45, 45),
          }}
          key={key}
          position={{ lat: marker.lat, lng: marker.lng }}
          onClick={(e) => { setSelected(marker); console.log(e) }}
        />
      ))}

      {
        directionResults &&
        directionResults.map(directions =>
          <DirectionsRenderer
            // required
            options={{
              directions: directions
            }}
            // optional
            onLoad={directionsRenderer => {
              console.log('DirectionsRenderer onLoad directionsRenderer: ', directionsRenderer)
            }}
            // optional
            onUnmount={directionsRenderer => {
              console.log('DirectionsRenderer onUnmount directionsRenderer: ', directionsRenderer)
            }}
          />
          )
      }
    </GoogleMap>
  );
}

export default React.memo(Map);
