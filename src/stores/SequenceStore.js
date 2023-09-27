import { defineStore } from "pinia";
import { DEFAULT_SEQUENCE } from "../../constants";

export const useSequenceStore = defineStore("SequenceStore", {
    state: () => ({
        sequences: [DEFAULT_SEQUENCE],
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
            this.sequences[index].steps.push(this.sequences[index].lights.map(() => ("")))
        },

        selectStep(sequenceIndex, stepIndex, lightIndex){
            this.stepSelected = { sequenceIndex, stepIndex, lightIndex}
        },

        updateStepState(newState){
            const { sequenceIndex, stepIndex, lightIndex } = this.stepSelected
            this.sequences[sequenceIndex].steps[stepIndex][lightIndex] = newState
        },
        
        deleteSequence(sequenceIndex){
            this.sequences.splice(sequenceIndex, 1)
        }
    },

    getters: {
        getSequenceStepsByIndex: (state) => (sequenceIndex) => state.sequences[sequenceIndex].steps,
        getState: (state) => () => state.sequences[state.stepSelected.sequenceIndex].steps[state.stepSelected.stepIndex][state.stepSelected.lightIndex]
    }
})