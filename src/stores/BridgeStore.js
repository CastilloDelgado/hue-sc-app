import { defineStore } from "pinia";


export const useBridgeStore = defineStore("BridgeStore", {
    state: () => ({
        id: '',
        ip: '',
        username: '',
        lights: []
    }),
    
    actions: {
        // Set data with a function
        setIdAndIp(id, ip){
            this.id = id,
            this.ip = ip
        },

        setUsername(username){
            this.username = username
        },

        setLights(lights){
            this.lights = [...lights]
        }
    },

    getters: {

    }
})