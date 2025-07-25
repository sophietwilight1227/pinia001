import {defineStore} from "pinia";

interface State {
    //colorDic: Map<string, string>,
    //colorScheme: string,
    loadingElem: any,
};

export const useLoadingStore = defineStore(
    "loading",
    {
        state: (): State => {
            return {
                //colorDic: new Map(),
                //colorScheme: "test",
                loadingElem: null,
            };
        },
        getters: {

        },
        actions: {
            init(loading: any):void {
                this.loadingElem = loading;
            },
            show(text: string): void {
                this.loadingElem.show(text);
            },
            hide(): void {
                this.loadingElem.hide();
            }
        },        
    }
);