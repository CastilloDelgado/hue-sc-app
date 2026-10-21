import axios from "axios"
import { useBridgeStore } from "../stores/BridgeStore"
import { storeToRefs } from "pinia"
import { HUE_DISCOVER_URL } from "../../constants"

const createApiUrl = () => {
    const bridgeStore = useBridgeStore()
    const { ip } = storeToRefs(bridgeStore)
    return(`http://${ip.value}`)
}

const createApiUrlWithUsername = () => {
    const bridgeStore = useBridgeStore()
    const { username } = storeToRefs(bridgeStore)
    return(`${createApiUrl()}/api/${username.value}`)
}

export const fetchBridgeSettings = async () => axios.get(HUE_DISCOVER_URL, { timeout: 10000 })
export const createUsername = async () => axios.post(`${createApiUrl()}/api`, { devicetype: "hue-sc-app#browser" }, { timeout: 10000 })
export const getLights = async () => axios.get(`${createApiUrlWithUsername()}/lights`, { timeout: 10000 })
export const setLightState = async (lightId, state) => axios.put(`${createApiUrlWithUsername()}/lights/${lightId}/state`, state)
export const getBridgeConfig = async () => axios.get(`${createApiUrlWithUsername()}/config`, { timeout: 8000 })
export const inspectBridge = async () => axios.get(`${createApiUrl()}/api/config`, { timeout: 8000 })
