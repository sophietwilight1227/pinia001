import {defineStore} from "pinia";
import layoutList from '../assets/data/layout.json'
interface State {
    widthDic: Map<string, Array<{widthRatio: number, size: {height: number, width: number}}>>,
    canvasSize: {height: string, width: string} //AA表示部のサイズ。単位つき
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
                for(let i=0; i < layoutList.length; i++){
                    const lst = [];
                    for(let j=0; j<layoutList[i].values.length; j++){
                        lst.push({widthRatio: layoutList[i].values[j], size: {height: 0, width: 0}});
                    }
                    this.widthDic.set(layoutList[i].layoutName, lst);
                }
            },
            editLayout(layoutName: string, index: number, value: number, height: number, width: number){
                this.widthDic.get(layoutName)![index].widthRatio = value;
                this.widthDic.get(layoutName)![index].size.height = height;
                this.widthDic.get(layoutName)![index].size.width = width;
            },
            updateCanvasSize(height: string, width: string) {
                this.canvasSize.height = height;
                this.canvasSize.width = width;
            }
        },        
    }
);