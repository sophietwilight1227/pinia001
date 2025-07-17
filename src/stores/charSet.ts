import { writeAaTextFile } from "@/scripts/fileIO";
import {defineStore} from "pinia";
import { nextTick } from "vue";

interface State {
    charSizeDic: Map<string, number>;
    charPalette: Array<{indexName: string,
                    charList: Array<{
                        value: string,
                        width: number
                    }>
                }>;
    currentIndex: number;
    textSizeRef: any;
};

export const useCharSetStore = defineStore(
    "charSet",
    {
        state: (): State => {
            return {
                charSizeDic: new Map(),
                charPalette: [],
                currentIndex: 0,
                textSizeRef: null,
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
            renameCharPaletteIndex(name: string): void{
                this.charPalette[this.currentIndex].indexName = name;
            },
            moveCharPaletteIndex(indexFrom: number, indexTo: number): void {
                const elem = this.charPalette[indexFrom];
                this.charPalette.splice(indexFrom, 1);
                this.charPalette.splice(indexTo,0, elem);
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
            },
            readText(filename: string, text: string): boolean {
                const extension: string = filename.substring(filename.length - 3).toLowerCase();
                switch(extension){
                    case "txt":
                        this.readTXT(text);
                        return true;
                    case "aal":
                        this.readAAL(text);
                        return true;
                    default:
                        return false;
                }
            },
            async readTXT(text: string) {
                const rawList: Array<string> = text.split(/\n/);
                const list: Array<{name: string, list: Array<{value: string, width: number}>}> = [];
                for(let i=0; i < rawList.length; i++){
                    const char: string = rawList[i].trim();
                    if(char.slice(0,9) == "[ListName"){
                        list.push({name: rawList[i].slice(10, char.length - 1), list: []});
                    }else if(char == "[end]"){
                            //何もしない
                    }else{
                        const widthPromis = (await this.calcCharWidth(char))
                        let width: number = 0
                        if(widthPromis != null){
                            width = widthPromis.valueOf();
                        }
                        list[list.length - 1].list.push({value: char, width: width.valueOf()});
                    }
                }
                this.readAaList(list);
                this.saveCharPaletteLocalStorage();
            },
            readAAL(text: string){
                const list = JSON.parse(text);
                this.charPalette = list;
                this.saveCharPaletteLocalStorage();
            },
            writeAAL(){
                writeAaTextFile(JSON.stringify(this.charPalette), "aalist","aal" , "utf-8");
            },
            async calcCharWidth (str: string): Promise<number> {
                this.textSizeRef.value = str;
                await nextTick();
                console.log(str, this.textSizeRef.offsetWidth);
                return this.textSizeRef.offsetWidth;
            },
            setTextSizeRef(elem: any){
                this.textSizeRef = elem;
            }
        },        
    }
);