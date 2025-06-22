import {defineStore} from "pinia";
import layoutList from '../assets/data/layout.json'
interface State {
    widthDic: Map<string, Array<number>>
};

export const useLayoutStore = defineStore(
    "layout",
    {
        state: (): State => {
            return {
                widthDic: new Map(),
            };
        },
        getters: {

        },
        actions: {
            initLayout(): void {

                console.log(layoutList.length);

                for(let i=0; i < layoutList.length; i++){
                    this.widthDic.set(layoutList[i].layoutName, layoutList[i].values);
                }
            },
            editLayout(layoutName: string, index: number, value: number){
                this.widthDic.get(layoutName)![index] = value;
                console.log(this.widthDic.get(layoutName)![index]);
            }
        },        
    }
);