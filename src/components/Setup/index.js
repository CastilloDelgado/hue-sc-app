import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useApp } from "../../contexts/AppContext";
import HueService from "../../services/Hue";

const Setup = () => {
  const { darkMode, networkInfo, setNetworkInfo } = useApp();
  const [buttonNotPressed, setButtonNotPressed] = useState(false);

  const getNetworkInfo = () =>
    HueService.getNetworkInfo()
      .then(({ data }) => {
        const result = data.pop();
        setNetworkInfo({
          ...networkInfo,
          id: result.id,
          ip: result.internalipaddress,
        });
      })
      .catch((error) => console.log(error));

  const getNetworkInfoFromBrowser = () =>
    JSON.parse(localStorage.getItem("networkInfo"));

  const generateClientKey = (ip) =>
    HueService.generateClientKey(ip)
      .then(({ data }) => {
        const result = data.pop();
        if (result.success) {
          const { username, clientkey } = result.success;
          const newNetworkInfo = {
            ...networkInfo,
            user: username,
            key: clientkey,
          };
          setNetworkInfo(newNetworkInfo);
          localStorage.setItem("networkInfo", JSON.stringify(newNetworkInfo));
          setButtonNotPressed(false);
        }
        if (result.error) {
          console.log(result.error.description);
          setButtonNotPressed(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });

  useEffect(() => {
    const storedNetworkInfo = getNetworkInfoFromBrowser();
    storedNetworkInfo ? setNetworkInfo(storedNetworkInfo) : getNetworkInfo();
  }, []);

  return (
    <>
      <Navbar />
      <div
        className={`container-fluid p-3 ${darkMode && "bg-dark text-white"}`}
        style={{ minHeight: "95vh" }}
      >
        <div className="row justify-content-center">
          <div className="col col-lg-6">
            <h1 className="text-center">Setup your Hue environment</h1>
            <div className="mt-3">
              <form>
                <div className="mb-3">
                  <label className="form-label" htmlFor="internalipaddress">
                    Internal IP Address
                  </label>
                  <input
                    type="text"
                    id="internalipaddress"
                    className="form-control"
                    value={networkInfo.ip}
                    disabled
                  />
                  <div className="form-text">
                    Your device must be connected to the same network of your
                    Hue Bridge.
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="id">
                    ID
                  </label>
                  <input
                    type="text"
                    id="id"
                    className="form-control"
                    value={networkInfo.id}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={networkInfo.user}
                    disabled
                  />
                  <div className="form-text">
                    This is how your Hue Bridge will indentify this device.
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="key">
                    Key
                  </label>
                  <input
                    type="text"
                    id="key"
                    className="form-control"
                    value={networkInfo.key}
                    disabled
                  />
                  <div className="form-text">
                    This is the unique key generated for this device.
                  </div>
                </div>
                <div className="row">
                  {!networkInfo.key ? (
                    <div className="col-12">
                      <p
                        className={`form-label text-center ${
                          buttonNotPressed ? "text-danger" : "text-warning"
                        }`}
                      >
                        * Click the button of your Hue Bridge before clicking
                        "Generate Key"
                      </p>
                    </div>
                  ) : null}
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={() => generateClientKey(networkInfo.ip)}
                      disabled={networkInfo.key}
                    >
                      Generate Key
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setup;
