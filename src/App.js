import Map from "./Map";
import { AiOutlinePlus } from "react-icons/ai";
import Popup from "reactjs-popup";
import { useState } from "react";
import UserCard from "./UserCard";
import { LoadScript } from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const libraries = ["places"];

function App() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [transport, setTransport] = useState("DRIVING");
  const [users, setUsers] = useState([]);

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
      libraries={libraries}
    >
      <div className="App">
        <div className="users">
          <div className="users__menu--back">
            <div className="users__menu">
              <h1>Users</h1>
              <Popup
                trigger={<AiOutlinePlus className="users__add" />}
                modal
                onClose={() => {
                  setName("");
                  setAddress("");
                  setCoordinates("");
                  setTransport("DRIVING");
                }}
              >
                {(close) => (
                  <div className="newUser__modal">
                    <button className="newUser__close" onClick={close}>
                      &times;
                    </button>
                    <div className="newUser__header">Add New User</div>
                    <form
                      className="newUser__form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (name && address && coordinates) {
                          setUsers((current) => [
                            ...current,
                            {
                              name,
                              address,
                              coordinates,
                              transport,
                              id: new Date().getUTCMilliseconds(),
                            },
                          ]);
                          close();
                        }
                      }}
                    >
                      <div className="form__group">
                        <label htmlFor="name">Name</label>
                        <input
                          id="name"
                          className="name__input form__input"
                          type="text"
                          placeholder="Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form__group">
                        <label htmlFor="address">Address</label>
                        <PlacesAutocomplete
                          value={address}
                          onChange={setAddress}
                          onSelect={handleSelect}
                        >
                          {({
                            getInputProps,
                            suggestions,
                            getSuggestionItemProps,
                            loading,
                          }) => (
                            <div className="address__input">
                              <input
                                {...getInputProps({
                                  placeholder: "Address",
                                  required: true,
                                  className: "form__input",
                                })}
                              />
                              <div className="address__suggestions">
                                {suggestions.map((suggestion, key) => {
                                  const style = {
                                    backgroundColor: suggestion.active
                                      ? "#e9e9e9"
                                      : "#fff",
                                  };
                                  return (
                                    <div
                                      {...getSuggestionItemProps(suggestion, {
                                        style,
                                      })}
                                      className="address__item"
                                      key={key}
                                    >
                                      {suggestion.description}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </PlacesAutocomplete>
                      </div>
                      <div className="form__group">
                        <label htmlFor="transport">Travel Mode</label>

                        <select
                          value={transport}
                          name="transport"
                          id="transport"
                          className="form__input"
                          onChange={(e) => setTransport(e.target.value)}
                        >
                          <option value="DRIVING">Driving</option>
                          <option value="BICYCLING">Bicycling</option>
                          <option value="TRANSIT">Transit</option>
                          <option value="WALKING">Walking</option>
                        </select>
                      </div>
                      <button type="submit">Submit</button>
                    </form>
                  </div>
                )}
              </Popup>
            </div>
          </div>
          <div className="users__list">
            {users.map((user, key) => (
              <UserCard key={key} user={user} />
            ))}
          </div>
        </div>
        <div className="map__container">
          <Map users={users} setUsers={setUsers} />
        </div>
      </div>
    </LoadScript>
  );
}

export default App;
