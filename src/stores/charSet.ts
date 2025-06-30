import {defineStore} from "pinia";

interface State {
    charSizeDic: Map<string, number>;
    charPalette: Array<{indexName: string,
                    charList: Array<{
                        value: string,
                        width: number
                    }>
                }>;
    currentIndex: number;
};

export const useCharSetStore = defineStore(
    "charSet",
    {
        state: (): State => {
            return {
                charSizeDic: new Map(),
                charPalette: [],
                currentIndex: 0,
            };
        },
        getters: {
            charList(): Array<{value: string,width: number}> {
                return this.charPalette[this.currentIndex].charList;
            }
        },
        actions: {
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
            selectIndex(index: number): void {
                this.currentIndex = index;
            },
            addCharPaletteIndex(indexNo: number, indexName: string): void{
                this.charPalette.splice(indexNo,0, {indexName: indexName, charList: []});
            },
            addCharPalette(indexNo: number, charNo: number, charValue: string, width: number): void {
                this.charPalette[indexNo].charList.splice(charNo, 0, {value: charValue, width: width})
            },
            addCharToCurrentPalette(charNo: number, charValue: string, width: number): void {
                this.charPalette[this.currentIndex].charList.splice(charNo, 0, {value: charValue, width: width})
            }
        },        
    }
);