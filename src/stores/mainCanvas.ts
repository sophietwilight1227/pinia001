import {defineStore} from "pinia";
import type { EditLog, Setting } from "@/interfaces";


interface State {
    allData: Array<{fileName: string,
                    aaList: Array<{
                                    aaName: string,
                                    asciiArt: string,
                                }>,
                    }>,
    asciiArt: string;
    rowIndex: string;
    maxRow: number;
    caretPosition: {start: number, end: number};
    editLogs: Array<EditLog>;
    currentFileNamePosition: number,
    currentAaNamePosition: number,
    setting: Setting;
};

export const useMainCanvasStore = defineStore(
    "mainCanvas",
    {
        state: (): State => {
            return {
                allData: [],
                asciiArt: "",
                rowIndex: "1",
                maxRow: 1,
                caretPosition: {start:0, end: 0},
                editLogs: [],
                currentFileNamePosition:0,
                currentAaNamePosition: 0,
                setting: {},
            };
        },
        getters: {
            fileNameList(state: State):Array<string> {
                const fileNameList = [];
                for(let i=0; i < this.allData.length; i++){
                    fileNameList.push(this.allData[i].fileName);
                }
                return fileNameList;
            },
            aaNameList(state: State): Array<string> {
                const aaNameList = [];
                if(this.allData[this.currentFileNamePosition] == null){
                    return [""];
                }
                if(this.allData[this.currentFileNamePosition].aaList == null){
                    return [""];
                }
                for(let i=0; i < this.allData[this.currentFileNamePosition].aaList.length; i++){
                    aaNameList.push(this.allData[this.currentFileNamePosition].aaList[i].aaName);
                }
                return aaNameList;
            },
        },
        actions: {
            initAsciiArt(): void {
                this.asciiArt = "testAA";
                this.allData.splice(0);
                this.allData.push({fileName: "file1", aaList: [{aaName: "aa1", asciiArt: "test1"}]})
            },
            editAsciiArt(aa: string, log: EditLog):void {
                this.asciiArt = aa;
                this.allData[this.currentFileNamePosition].aaList[this.currentAaNamePosition].asciiArt = this.asciiArt;
                this.editLogs.push(log);

                this.updateRowIndex(aa);
            },
            updateRowIndex(str: string): void {
                const lineCount = str.length - str.replace(/\n/g, "").length + 1
                let index = "1";
                for(let i=1; i<lineCount; i++){
                    index += ("\r\n" + (i+1));
                }
                this.rowIndex = index;
                this.maxRow = lineCount;
            },
            insertCharToAsciiArt(char: string){
                const strStart = this.asciiArt.slice(0, this.caretPosition.start);
                const strEnd = this.asciiArt.slice(this.caretPosition.end);
                const newAa = strStart + char + strEnd;
                this.editAsciiArt(newAa, {value: char, start: this.caretPosition.start, end: this.caretPosition.end});
                this.editCaretPosition(this.caretPosition.start + 1, this.caretPosition.start + 1);
            },
            editCaretPosition(start: number, end: number){
                this.caretPosition.start = start;
                this.caretPosition.end = end;
            },
            selectFile(index: number):void {
                if(index == null){
                    return;
                }
                this.currentFileNamePosition = index;
            },
            addFile(fileName: string, aaList: Array<{aaName: string, asciiArt: string}>):void {
                this.allData.push({fileName: fileName, aaList: aaList});
            },
            deleteFile(): void {
                this.allData.splice(this.currentFileNamePosition, 1);
            },
            renameFile(newName: string):void {
                this.allData[this.currentFileNamePosition].fileName = newName;
            },
            selectAa(index: number){
                if(index == null){
                    return;
                }
                this.currentAaNamePosition = index;
                this.asciiArt = this.allData[this.currentFileNamePosition].aaList[index].asciiArt;
            },
            addAa(aaName: string, asciiArt: string): void {
                this.allData[this.currentFileNamePosition].aaList.push({aaName: aaName, asciiArt: asciiArt});
            },
            deleteAa(): void {
                this.allData[this.currentFileNamePosition].aaList.splice(this.currentAaNamePosition, 1);
            },
            renameAa(newName: string): void {
                this.allData[this.currentFileNamePosition].aaList[this.currentAaNamePosition].aaName = newName;
            }
        },        
    }
);