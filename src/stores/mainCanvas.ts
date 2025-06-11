import {defineStore} from "pinia";
import type { EditLog, Setting } from "@/interfaces";

interface State {
    asciiArt: string;
    editLogs: Array<EditLog>;
    setting: Setting;
    charSizeDic: Map<string, number>;
};

export const useMainCanvasStore = defineStore(
    "mainCanvas",
    {
        state: (): State => {
            return {
                asciiArt: "",
                editLogs: [],
                setting: {},
                charSizeDic: new Map(),
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
            }
        },        
    }
);