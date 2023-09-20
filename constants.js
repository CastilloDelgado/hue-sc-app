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
    "lights":["9"],
    "steps":[
        [
            {
                light: "9",
                on: true,
            }
        ],
        [
            {
                light: "9",
                on: false,
            }
        ],
        [
            {
                light: "9",
                on: true,
            }
        ],
        [
            {
                light: "9",
                on: false,
            }
        ],
    ]
}