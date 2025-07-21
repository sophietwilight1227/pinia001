import {defineStore} from "pinia";
import layoutList from '../assets/data/layout.json'
import constLayout from "@/consts/constLayout";
interface State {
    widthDic: Map<string, Array<{widthRatio: number, size: {height: number, width: number}}>>,
    asciiArtSize: {height: string, width: string}, //AA表示部のサイズ。単位つき
    canvasSize: {height: string, width: string}, //AA表示部のサイズ。単位つき
    scrollX: number,
    scrollY: number,
    isLeftPictureView: boolean,
    hasColumnGrid: boolean,
    isDragging: boolean
};

export const useLayoutStore = defineStore(
    "layout",
    {
        state: (): State => {
            return {
                widthDic: new Map(),
                asciiArtSize: {height: '100%', width: '100%'},
                canvasSize: {height: '100%', width: '100%'},
                scrollX: 0,
                scrollY: 0,
                isLeftPictureView: true,
                hasColumnGrid: true,
                isDragging: false,
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
                this.isLeftPictureView = true;
            },
            initSize(height: number, width: number, index: number):void {
                this.widthDic.get(constLayout.LAYOUT_NAME.MAIN)![index].size.width = width;
                this.widthDic.get(constLayout.LAYOUT_NAME.MAIN)![index].size.height = height;
            },
            editLayout(layoutName: string, index: number, value: number, height: number, width: number): void {
                this.widthDic.get(layoutName)![index].widthRatio = value;
                this.widthDic.get(layoutName)![index].size.height = height;
                this.widthDic.get(layoutName)![index].size.width = width;
            },
            _updateCanvasSize(height: number, width: number) {
                const mainCanvasIndex:number = 2; //App.vue
                const height100:number = this.widthDic.get(constLayout.LAYOUT_NAME.MAIN)![mainCanvasIndex].size.height;
                const width100: number = this.widthDic.get(constLayout.LAYOUT_NAME.MAIN)![mainCanvasIndex].size.width;
                if(height100 > height){
                    this.canvasSize.height = height100 + "px"; 
                }else{
                    this.canvasSize.height = height + "px";
                }
                
                if(width100 > width){
                    this.canvasSize.width = width100 + "px"; 
                }else{
                    this.canvasSize.width = width + "px";
                }
            },
            updateAsciiArtSize(height: number, width: number) {
                this.canvasSize.height = height + "px";
                this.canvasSize.width = width + "px";
                const mainCanvasIndex:number = 2; //App.vue
                const height100:number = this.widthDic.get(constLayout.LAYOUT_NAME.MAIN)![mainCanvasIndex].size.height;
                const width100: number = this.widthDic.get(constLayout.LAYOUT_NAME.MAIN)![mainCanvasIndex].size.width;
            },
            setPicturePosition(isLeft: boolean){
                this.isLeftPictureView = isLeft;
            },
            changeColumnGrid(value: boolean){
                this.hasColumnGrid = value;
            },
        },        
    }
);