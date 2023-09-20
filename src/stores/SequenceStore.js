import { defineStore } from "pinia";

export const useSequenceStore = defineStore("SequenceStore", {
    state: () => ({
        sequences: [],
        sequenceSelected: {},
        stepSelected: {}
    }),

    actions: {
        addSequence(name, bpm, lights){
            const randomId = (Math.random() + 1).toString(36).substring(2)
            const newSequence = {
                id: randomId,
                name,
                bpm: parseInt(bpm),
                lights,
                steps: []
            }
            this.sequenceSelected = {...newSequence}
            this.sequences.push({...newSequence})
        },

        addStepToSequence(id){
            const index = this.sequences.findIndex((sequence) => sequence.id === id)
            this.sequences[index].steps.push(this.sequences[index].lights.map((light) => ({
                light
            })))
        },

        selectStep(sequenceIndex, stepIndex, lightIndex){
            this.stepSelected = { sequenceIndex, stepIndex, lightIndex}
        },

        updateStepState(newState){
            const { sequenceIndex, stepIndex, lightIndex } = this.stepSelected
            const currentState = this.sequences[sequenceIndex].steps[stepIndex][lightIndex]
            this.sequences[sequenceIndex].steps[stepIndex][lightIndex] = {
                ...currentState,
                ...newState
            }
        }
    },
})