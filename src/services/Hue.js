import axios from "axios";

class HueService {
  setNetworkInfo = (id, ip, user, key) => {
    this.id = id;
    this.ip = ip;
    this.user = user;
    this.key = key;
  };

  getNetworkInfo = async () => axios.get(`https://discovery.meethue.com`);

  generateClientKey = async (ip) =>
    axios.post(`https://${ip}/api`, {
      devicetype: "app_name#instance_name",
      generateclientkey: true,
    });

  getLightsInfo = async () =>
    axios.get(`https://${this.ip}/api/${this.user}/lights`);

  getLights = async (ip, user) => axios.get(`https://${ip}/api/${user}/lights`);

  // setLightState = async (id, body) =>
  //   axios.put(`https://${this.ip}/api/${this.user}/lights/${id}/state`, body);

  /*
   *   Paramenters
   *   1st -> NetworkInfo from AppContext
   *   2nd -> Id of the light to change
   *   3nd -> Object with the updated state of the light
   */
  setLightState = async ({ ip, user }, lightId, updatedState) => {
    axios.put(
      `https://${ip}/api/${user}/lights/${lightId}/state`,
      updatedState
    );
  };
}

export default new HueService();
