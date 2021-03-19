import { useState, useEffect } from "react";
import logoLocation from "./images/icon-location.svg";
import iconArrow from "./images/icon-arrow.svg";
import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "./App.css";
import Error from "./components/Error";

const geoIpApiKey = process.env.REACT_APP_GEO_API_KEY;

const newMapIcon = L.icon({ iconUrl: logoLocation, iconSize: [46, 56] });

function App() {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ipData, setIpData] = useState([]);
  const [inputValue, setInputValue] = useState();

  const getIpOnPageFirstLoading = async () => {
    try {
      const promise = await fetch(
        `https://geo.ipify.org/api/v1?apiKey=&ipAddress=`
      );
      const res = await promise.json();
      if (res.code) throw new Error(res.messages);
      setIpData(res);
    } catch (e) {
      setError(true);
      console.log(e);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    getIpOnPageFirstLoading();
  }, []);

  const onChangeHandler = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  return (
    <div className="App">
      <div className="search-ip">
        <h1>IP Address Tracker</h1>
        <form>
          <input
            placeholder="Search for any IP address or domain"
            type="text"
          />
          <button>
            <img src={iconArrow} alt="" />
          </button>
        </form>
        <div className="show-tracker-data">
          <ul>
            <li>
              <div>
                <h4 className="data-key">IP Address</h4>
                <p className="data-value">
                  {isLoaded ? (
                    error ? (
                      <Error message="Error" />
                    ) : (
                      ipData.ip
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </div>
            </li>
            <li>
              <div>
                <h4 className="data-key">Location</h4>
                <p className="data-value">
                  {isLoaded ? (
                    error ? (
                      <Error message="Error" />
                    ) : (
                      `${ipData.location.city}, ${ipData.location.region}`
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </div>
            </li>
            <li>
              <div>
                <h4 className="data-key">Timezone</h4>
                <p className="data-value">
                  UTC
                  {isLoaded ? (
                    error ? (
                      <Error message="Error" />
                    ) : (
                      `${ipData.location.timezone}`
                    )
                  ) : (
                    "Loading..."
                  )}
                  {/*add offset value dynamically using the API*/}
                </p>
              </div>
            </li>
            <li>
              <div>
                <h4 className="data-key">ISP</h4>
                <p className="data-value">
                  {isLoaded ? (
                    error ? (
                      <Error message="Error" />
                    ) : (
                      ipData.isp
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </div>
            </li>
          </ul>
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
    </div>
  );
}

export default App;
