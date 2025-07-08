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
            initCharPlette(palette: { indexName: string; charList: { value: string; width: number; }[]; }[]): void {
                this.charPalette = palette
            },
            addCharPaletteIndex(indexNo: number, indexName: string): void{
                this.charPalette.splice(indexNo,0, {indexName: indexName, charList: []});
            },
            removeCharPaletteIndex(indexNo: number): void{
                this.charPalette.splice(indexNo, 1);
            },
            addCharPalette(indexNo: number, charNo: number, charValue: string, width: number): void {
                this.charPalette[indexNo].charList.splice(charNo, 0, {value: charValue, width: width})
            },
            addCharToCurrentPalette(charNo: number, charValue: string, width: number): void {
                this.charPalette[this.currentIndex].charList.splice(charNo, 0, {value: charValue, width: width})
            },
            removeCharFromCurrentPalette(charNo: number): void {
                this.charPalette[this.currentIndex].charList.splice(charNo, 1);
            },
            readAaList(list: Array<{name: string, list: Array<{value: string, width: number}>}>): void {
                //this.charPalette.splice(0);
                this.charPalette = [];
                for(let i=0; i < list.length; i++){
                    this.charPalette.push({indexName: list[i].name, charList: list[i].list});
                }
            },
            saveCharPaletteLocalStorage(): void{
                if(this.charPalette != null){
                    const text:string = JSON.stringify(this.charPalette);
                    localStorage.setItem("ahoge_editor_charpalette", text);
                }
            }
        },        
    }
);