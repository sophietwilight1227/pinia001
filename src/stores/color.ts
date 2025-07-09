import {defineStore} from "pinia";

interface State {
    primary: string,
    secondary: string,
    accent: string,
    text: string,
    base: string,
};

export const useColorStore = defineStore(
    "color",
    {
        state: (): State => {
            return {
                primary: "rgb(0,128,255)",
                secondary: "rgb(0,180,255)",
                accent: "rgb(255,0,0)",
                text: "rgb(200,200,0)",
                base: "rgb(255,255,255)"
            };
        },
        getters: {

        },
        actions: {
            init():void {
                this.text = "rgb(0,0,0)"
            },
        },        
    }
);