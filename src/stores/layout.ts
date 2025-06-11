import {defineStore} from "pinia";

interface State {
    widthLst: number[];
};

export const useLayoutStore = defineStore(
    "layout",
    {
        state: (): State => {
            return {
                widthLst: [],
            };
        },
        getters: {

        },
        actions: {
            initLayout(): void {
                this.widthLst.push(45);
                this.widthLst.push(90);
            },
        },        
    }
);