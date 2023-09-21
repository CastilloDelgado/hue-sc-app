export const HUE_DISCOVER_URL = "https://discovery.meethue.com/"

export const EMPTY_SEQUENCE = {
    name: '',
    bpm: '', 
    steps: []
}

export const DEFAULT_SEQUENCE = {
    "id":"wnvqomddf5",
    "name":"First Sequence",
    "bpm":500,
    "lights":[9,10],
    "steps":[
        [
            "{on: true,bri: 220,transitiontime: 0}",
            "{on: false,transitiontime: 0}",
            
        ],
        [
            "{on: false,bri: 220,transitiontime: 0}",
            "{on: true,transitiontime: 0}",
        ],
    ]
}