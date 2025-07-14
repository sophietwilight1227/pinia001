import {defineStore} from "pinia";
import type { EditLog, Setting } from "@/interfaces";


interface State {
    allData: Array<{fileName: string,
                    currentPosition: number,
                    aaList: Array<{
                                    aaName: string,
                                    asciiArt: string,
                                    editLogs: Array<EditLog>,
                                }>,
                    }>,
    asciiArt: string;
    rowIndex: string;
    maxRow: number;
    caretPosition: {start: number, end: number};
    currentFileNamePosition: number,
    setting: Setting;
    isMovieMode: boolean;
    currentMoviePosition: number,
};

export const useMainCanvasStore = defineStore(
    "mainCanvas",
    {
        state: (): State => {
            return {
                allData: [],
                asciiArt: "",
                rowIndex: "1",  //MainCanvasに表示する行番号の連番
                maxRow: 1,
                caretPosition: {start:0, end: 0},
                currentFileNamePosition:0,
                setting: {},
                isMovieMode: false,
                currentMoviePosition: 0,
            };
        },
        getters: {
            currentRow(): number {
                if(this.asciiArt == null){
                    return 0;
                }
                const str: string = this.asciiArt.slice(0, this.caretPosition.start);
                const lineCount:number = str.length - str.replace(/\n/g, "").length + 1;
                return lineCount;
            },
            halfStrCurrentRow(): string {
                if(this.asciiArt == null){
                    return "";
                }
                const str: Array<string> = this.asciiArt.slice(0, this.caretPosition.start).split(/\n/g);
                return str[str.length - 1];
            },
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
                this.asciiArt = "";
                this.allData.splice(0);
                this.allData.push({fileName: "new file",currentPosition: 0 , aaList: [{aaName: "aa", asciiArt: "", editLogs: []}]})
            },
            editAsciiArt(aa: string, log: EditLog):void {
                this.asciiArt = aa;
                const currentPosition: number = this.allData[this.currentFileNamePosition].currentPosition;
                this.allData[this.currentFileNamePosition].aaList[currentPosition].asciiArt = this.asciiArt;
                this.allData[this.currentFileNamePosition].aaList[currentPosition].editLogs.push(log);
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
            getLastSpaceWidth(): {text: string, width: number} {
                const halfText: string = this.asciiArt.slice(0, this.caretPosition.start);
                const rowStartPosition = halfText.lastIndexOf("\n") + 1;
                const prevBlock: string = this.asciiArt.slice(0, rowStartPosition);
                const halfRow: string = halfText.slice(rowStartPosition, halfText.length);
                let width: number = 0;
                for(let i=halfRow.length - 1; i >= 0; i--){
                    switch(halfRow.charAt(i)){
                        case " ":
                            width += 5; //スペースの幅
                            break;
                        case "　":
                            width += 11; //スペースの幅
                            break;
                        default:
                            return {text: prevBlock + halfRow.slice(0, i + 1), width: width};
                    }
                }
                return {text: prevBlock, width: width};
            },
            changeDot(delta: number): void{
                const currentRowInfo:{text: string, width: number} = this.getLastSpaceWidth();
                console.log(currentRowInfo.width);
                const targetWidth: number = currentRowInfo.width + delta;
                let res: number = targetWidth % 11
                let countFull: number = (targetWidth - res) / 11; //全角スペースの個数
                const resHalf: number = res % 5 
                let countHalf: number = (res - resHalf) / 5//半角スペースの個数
                if(resHalf == 0){
                    //OK
                }else{
                    const resHalfMinus: number = 5 - resHalf;
                    if(countFull >= resHalfMinus){
                        countFull -= resHalfMinus;
                        countHalf += (resHalfMinus * 2) + 1;
                    }else{
                        //  変更不可
                        return;
                    }                    
                }

                //半角スペースがなるべく連続しないように
                let space: string = "";
                if(countHalf > countFull){
                    space = " ".repeat(countHalf - countFull) + "　 ".repeat(countFull);
                }else{
                    space = " 　".repeat(countHalf) + "　".repeat(countFull - countHalf);
                }
                const latterText: string = this.asciiArt.slice( this.caretPosition.start, this.asciiArt.length);

                const pos: number = (currentRowInfo.text + space).length;
                this.caretPosition.start = pos;
                this.caretPosition.end = pos;

                this.asciiArt = (currentRowInfo.text + space + latterText);
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
                this.selectAa(this.allData[this.currentFileNamePosition].currentPosition);
            },
            addFile(fileName: string, aaList: Array<{aaName: string, asciiArt: string, editLogs: Array<EditLog>}>):void {
                this.allData.push({fileName: fileName,currentPosition: 0 , aaList: aaList});
            },
            moveFile(indexFrom: number, indexTo: number): void {
                const elem = this.allData[indexFrom];
                this.allData.splice(indexFrom, 1);
                this.allData.splice(indexTo,0, elem);
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
                this.allData[this.currentFileNamePosition].currentPosition = index;
                this.asciiArt = this.allData[this.currentFileNamePosition].aaList[index].asciiArt;

            },
            addAa(aaName: string, asciiArt: string): void {
                this.allData[this.currentFileNamePosition].aaList.push({aaName: aaName, asciiArt: asciiArt, editLogs: []});
            },
            deleteAa(): void {
                const currentPosition: number = this.allData[this.currentFileNamePosition].currentPosition;
                this.allData[this.currentFileNamePosition].aaList.splice(currentPosition, 1);
            },
            moveAa(indexFrom: number, indexTo: number): void {
                const elem = this.allData[this.currentFileNamePosition].aaList[indexFrom];
                this.allData[this.currentFileNamePosition].aaList.splice(indexFrom, 1);
                this.allData[this.currentFileNamePosition].aaList.splice(indexTo,0, elem);
            },
            renameAa(newName: string): void {
                const currentPosition: number = this.allData[this.currentFileNamePosition].currentPosition;
                this.allData[this.currentFileNamePosition].aaList[currentPosition].aaName = newName;
            },
            readText(filename: string, text: string): boolean {
                const extension: string = filename.substring(filename.length - 3).toLowerCase();
                switch(extension){
                    case "mlt":
                        this.readMLT(filename, text);
                        return true;
                    case "ast":
                        this.readAST(filename, text);
                        return true;
                    default:
                        return false;
                }
            },
            readMLT(filename: string, text: string): void {
                const lst: Array<string> = text.split("[SPLIT]");
                const listAa: Array<{aaName: string, asciiArt: string, editLogs: Array<EditLog>}> = [];
                for(let i=0; i < lst.length; i++){
                    listAa.push({aaName: i.toString(), asciiArt: lst[i], editLogs: []})
                }
                this.allData.push({fileName: filename,currentPosition: 0 , aaList: listAa});    
            },
            readAST(filename: string, text: string){
                const lst: Array<string> = text.split("[AA]");
                console.log(lst);
                const listAa: Array<{aaName: string, asciiArt: string, editLogs: Array<EditLog>}> = [];
                for(let i=0; i < lst.length; i++){
                    const nameStart = lst[i].indexOf("[");
                    const nameEnd = lst[i].indexOf("]");
                    if(nameStart < nameEnd && nameEnd < lst[i].length){
                        const name = lst[i].substring(nameStart, nameEnd);
                        const aa = lst[i].substring(nameEnd + 3);
                        listAa.push({aaName: name, asciiArt: aa, editLogs: []})
                    }else{
                        listAa.push({aaName: "", asciiArt: lst[i], editLogs: []})
                    }
                }
                this.allData.push({fileName: filename,currentPosition: 0 , aaList: listAa});   
            },
            writeText(): {fileName: string, asciiArt: string} {
                const list: Array<{aaName: string, asciiArt: string}> = this.allData[this.currentFileNamePosition].aaList;
                const currentPosition: number = this.allData[this.currentFileNamePosition].currentPosition;
                const aaName = list[currentPosition].aaName;
                const text: string = list[currentPosition].asciiArt;
                const fileName: string = this.allData[this.currentFileNamePosition].fileName;
                return {fileName: fileName + "_" + aaName, asciiArt: text};
            },
            writeMLT(): {fileName: string, asciiArt: string} {
                const list: Array<{aaName: string, asciiArt: string}> = this.allData[this.currentFileNamePosition].aaList;
                let text: string = list[0].asciiArt;
                for(let i=1; i < list.length; i++){
                    text += "\n[SPLIT]\n";
                    text += list[i].asciiArt;
                }
                return {fileName: this.allData[this.currentFileNamePosition].fileName, asciiArt: text};
            },
            writeAST(): {fileName: string, asciiArt: string} {
                const list: Array<{aaName: string, asciiArt: string}> = this.allData[this.currentFileNamePosition].aaList;
                let text: string = "";
                for(let i=0; i < list.length; i++){
                    text += "[AA][";
                    text += list[i].aaName;
                    text += "]\n";
                    text += list[i].asciiArt;
                    text += "\n";
                }
                return {fileName: this.allData[this.currentFileNamePosition].fileName, asciiArt: text};
            },
            setMovieMode(value: boolean): void {
                this.isMovieMode = value;
            },
            setMovieIndex(index: number): void {
                const currentAaIndex: number = this.allData[this.currentFileNamePosition].currentPosition;
                const currentLog: Array<EditLog> = this.allData[this.currentFileNamePosition].aaList[currentAaIndex].editLogs;
                if(index < currentLog.length && index >= 0){
                    this.currentMoviePosition = index;
                    this.setAsciiArtFromLogAt(index);
                }
            },
            setAsciiArtFromLogAt(index: number): void {
                const currentAaIndex: number = this.allData[this.currentFileNamePosition].currentPosition;
                const currentLog: Array<EditLog> = this.allData[this.currentFileNamePosition].aaList[currentAaIndex].editLogs;
                if(index < currentLog.length && index >= 0){
                    const aa = currentLog[index].value
                    if(aa != null){
                        this.asciiArt = aa;
                    }
                }
            }
        },        
    }
);