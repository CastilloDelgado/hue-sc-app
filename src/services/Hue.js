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
    axios.post(`https://${this.ip}/api`, {
      devicetype: "app_name#instance_name",
      generateclientkey: true,
    });

  getLightsInfo = async () =>
    axios.get(`https://${this.ip}/api/${this.user}/lights`);

  getLights = async (ip, user) => axios.get(`https://${ip}/api/${user}/lights`);

  setLightState = async (id, body) =>
    axios.put(`https://${this.ip}/api/${this.user}/lights/${id}/state`, body);
}

export default new HueService();
