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

export const fetchBridgeSettings = async () => axios.get(HUE_DISCOVER_URL)
export const createUsername = async () => axios.post(`${createApiUrl()}/api`, {"devicetype":"hue-sc-app#marcos_macbook_pro"})
export const getLights = async () => axios.get(`${createApiUrlWithUsername()}/lights`)