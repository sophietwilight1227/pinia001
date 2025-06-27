import {defineStore} from "pinia";
import layoutList from '../assets/data/layout.json'
interface State {
    widthDic: Map<string, Array<number>>,
    canvasSize: {height: string, width: string} //単位つき
};

export const useLayoutStore = defineStore(
    "layout",
    {
        state: (): State => {
            return {
                widthDic: new Map(),
                canvasSize: {height: '100%', width: '100%'}
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
            },
            updateCanvasSize(height: string, width: string) {
                this.canvasSize.height = height;
                this.canvasSize.width = width;
            }
        },        
    }
);