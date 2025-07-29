import {defineStore} from "pinia";

interface State {
    sentence: string,
};

export const useExplanationStore = defineStore(
    "explanation",
    {
        state: (): State => {
            return {
                sentence: "",
            };
        },
        getters: {
        },
        actions: {
            changeSentence(text: string): void {
                this.sentence = text;
            },
        },        
    }
);