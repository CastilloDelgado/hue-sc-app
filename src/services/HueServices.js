import axios from "axios"
import { HUE_DISCOVER_URL } from "../../constants"


const bridgeSettings = JSON.parse(localStorage.getItem('bridgeSettings'))
const API_URL = `http://${bridgeSettings.ip}`
const API_URL_WITH_USERNAME = `${API_URL}/api/${bridgeSettings.username}`

export const HueServices = {
    fetchBridgeSettings: async () => axios.get(HUE_DISCOVER_URL),
    createUsername: async () => axios.post(`${API_URL}/api`, {
        "devicetype":"hue-sc-app#marcos_macbook_pro"
    }),
    getLights: async () => axios.get(`${API_URL_WITH_USERNAME}/lights`)
}
