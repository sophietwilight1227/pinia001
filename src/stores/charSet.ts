import { writeAaTextFile } from "@/scripts/fileIO";
import {defineStore} from "pinia";
import { nextTick } from "vue";
import { decodeNumericEntity } from "@/scripts/encode";

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
                this.charSizeDic.set(char, size);
            },
            async calcStrWidth(str: string) {
                let width = 0;
                for(let i=0; i < str.length; i++){
                    let charWidth: number;
                    if(this.charSizeDic.has(str.charAt(i))){
                        const tempWidth = this.charSizeDic.get(str.charAt(i));
                        if(tempWidth == null || tempWidth == 0){
                            charWidth = await this.calcCharWidth(str.charAt(i));
                            this.addCharSizeDic(str.charAt(i), charWidth);
                            console.log(charWidth, str.charAt(i));
                        }else{
                            charWidth = tempWidth;
                        }
                    }else{
                        charWidth = await this.calcCharWidth(str.charAt(i));
                        this.addCharSizeDic(str.charAt(i), charWidth);
                    }
                    if(charWidth != undefined){
                        width += charWidth; 
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
                this.saveCharPaletteLocalStorage()
            },
            removeCharPaletteIndex(indexNo: number): void{
                this.charPalette.splice(indexNo, 1);
                this.saveCharPaletteLocalStorage()
            },
            renameCharPaletteIndex(name: string): void{
                this.charPalette[this.currentIndex].indexName = name;
                this.saveCharPaletteLocalStorage()
            },
            moveCharPaletteIndex(indexFrom: number, indexTo: number): void {
                const elem = this.charPalette[indexFrom];
                this.charPalette.splice(indexFrom, 1);
                this.charPalette.splice(indexTo,0, elem);
                this.saveCharPaletteLocalStorage()
            },
            addCharPalette(indexNo: number, charNo: number, charValue: string, width: number): void {
                this.charPalette[indexNo].charList.splice(charNo, 0, {value: charValue, width: width})
                this.saveCharPaletteLocalStorage()
            },
            addCharToCurrentPalette(charNo: number, charValue: string, width: number): void {
                const char = decodeNumericEntity(charValue);
                this.charPalette[this.currentIndex].charList.splice(charNo, 0, {value: char, width: width})
                this.saveCharPaletteLocalStorage()
            },
            removeCharFromCurrentPalette(charNo: number): void {
                this.charPalette[this.currentIndex].charList.splice(charNo, 1);
                this.saveCharPaletteLocalStorage()
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
                        let convertedChar: string = decodeNumericEntity(char);

                        list[list.length - 1].list.push({value: convertedChar, width: width.valueOf()});
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
                this.textSizeRef.innerHTML = str;
                await nextTick();
                return this.textSizeRef.offsetWidth;
            },
            async setTextSizeRef(elem: any){
                this.textSizeRef = elem;
            }
        },        
    }
);