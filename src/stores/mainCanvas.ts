import {defineStore} from "pinia";
import type { EditLog, Setting } from "@/interfaces";


interface State {
    asciiArt: string;
    caretPosition: {start: number, end: number};
    editLogs: Array<EditLog>;
    setting: Setting;
    charSizeDic: Map<string, number>;
    charPalette: Array<{indexName: string,
                    charList: Array<{
                        value: string,
                        width: number
                    }>
                }>
};

export const useMainCanvasStore = defineStore(
    "mainCanvas",
    {
        state: (): State => {
            return {
                asciiArt: "",
                caretPosition: {start:0, end: 0},
                editLogs: [],
                setting: {},
                charSizeDic: new Map(),
                charPalette: []
            };
        },
        getters: {

        },
        actions: {
            initAsciiArt(): void {
                this.asciiArt = "testAA";
            },
            editAsciiArt(aa: string, log: EditLog):void {
                this.asciiArt = aa;
                this.editLogs.push(log);
            },
            editCaretPosition(start: number, end: number){
                this.caretPosition.start = start;
                this.caretPosition.end = end;
            },
            addCharSizeDic(char: string, size: number):void {
                if(!this.charSizeDic.has(char)){
                    this.charSizeDic.set(char, size);
                }
            },
            calcStrWidth(str: string): number {
                let width = 0;
                for(let i=0; i < str.length; i++){
                    if(this.charSizeDic.has(str.charAt(i))){
                        const charWidth = this.charSizeDic.get(str.charAt(i));
                        if(charWidth != undefined){
                            width += charWidth; 
                        }
                    }
                }
                return width;
            },
            addCharPaletteIndex(indexNo: number, indexName: string): void{
                this.charPalette.splice(indexNo,0, {indexName: indexName, charList: []});
            },
            addCharPalette(indexNo: number, charNo: number, charValue: string, width: number): void {
                this.charPalette[indexNo].charList.splice(charNo, 0, {value: charValue, width: width})
            }
        },        
    }
);