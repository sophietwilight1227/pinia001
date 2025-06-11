import {defineStore} from "pinia";
import type { EditLog, Setting } from "@/interfaces";

interface State {
    asciiArt: string;
    editLogs: Array<EditLog>;
    setting: Setting;
};

export const useMainCanvasStore = defineStore(
    "mainCanvas",
    {
        state: (): State => {
            return {
                asciiArt: "",
                editLogs: [],
                setting: {}
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
            }
        },        
    }
);