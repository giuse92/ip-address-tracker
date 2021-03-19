import { useState, useEffect } from "react";
import logoLocation from "./images/icon-location.svg";
import iconArrow from "./images/icon-arrow.svg";
import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "./App.css";
import Error from "./components/Error";

const geoIpApiKey = process.env.REACT_APP_API_KEY;

function App() {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ipData, setIpData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const newMapIcon = L.icon({ iconUrl: logoLocation, iconSize: [46, 56] });

  const getIp = async (apiUrl) => {
    try {
      const promise = await fetch(apiUrl);
      const res = await promise.json();
      setIpData(res);
      if (res.code) throw new Error("Error");
    } catch (e) {
      setError(true);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    getIp(`https://geo.ipify.org/api/v1?apiKey=${geoIpApiKey}&ipAddress=`);
  }, []);

  const onChangeHandler = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const getDomainOrIp = (e) => {
    e.preventDefault();
    setIsLoaded(false);
    getIp(
      `https://geo.ipify.org/api/v1?apiKey=${geoIpApiKey}&domain=${inputValue}`
    );
    setInputValue("");
  };

  return (
    <div className="App">
      <div className="search-ip">
        <h1>IP Address Tracker</h1>
        <form>
          <input
            placeholder="Search for any IP address or domain"
            type="text"
            onChange={onChangeHandler}
            value={inputValue}
          />
          <button onClick={getDomainOrIp}>
            <img src={iconArrow} alt="icon-arrow" />
          </button>
        </form>
        <div className="show-tracker-data">
          {error ? (
            <Error message={`${ipData.messages}`} />
          ) : (
            <ul>
              <li>
                <div>
                  <h4 className="data-key">IP Address</h4>
                  <p className="data-value">
                    {isLoaded ? ipData.ip : "Loading..."}
                  </p>
                </div>
              </li>
              <li>
                <div>
                  <h4 className="data-key">Location</h4>
                  <p className="data-value">
                    {isLoaded
                      ? `${ipData.location.city}, ${ipData.location.region}`
                      : "Loading..."}
                  </p>
                </div>
              </li>
              <li>
                <div>
                  <h4 className="data-key">Timezone</h4>
                  <p className="data-value">
                    UTC
                    {isLoaded ? `${ipData.location.timezone}` : "Loading..."}
                    {/*add offset value dynamically using the API*/}
                  </p>
                </div>
              </li>
              <li>
                <div>
                  <h4 className="data-key">ISP</h4>
                  <p className="data-value">
                    {isLoaded ? ipData.isp : "Loading..."}
                  </p>
                </div>
              </li>
            </ul>
          )}
        </div>
      </div>
      {isLoaded ? (
        <MapContainer
          style={{ height: "70vh" }}
          center={
            error ? [51.505, -0.09] : [ipData.location.lat, ipData.location.lng]
          }
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {!error ? (
            <Marker
              icon={newMapIcon}
              position={[ipData.location.lat, ipData.location.lng]}
            ></Marker>
          ) : null}
        </MapContainer>
      ) : (
        "Loading map..."
      )}
      <footer>
        <div class="attribution">
          Challenge by
          <a
            href="https://www.frontendmentor.io?ref=challenge"
            rel="noreferrer"
            target="_blank"
          >
            Frontend Mentor
          </a>
          . Coded by <a href="https://github.com/giuse92">giuse92</a>.
        </div>
      </footer>
    </div>
  );
}

export default App;
