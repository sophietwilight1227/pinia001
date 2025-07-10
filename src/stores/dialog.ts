import {defineStore} from "pinia";
import constDialog from "@/consts/constDialog";

interface State {
    dialog: any;
};

export const useDialogStore = defineStore(
    "dialog",
    {
        state: (): State => {
            return {
                dialog: null,
            };
        },
        getters: {

        },
        actions: {
            initStore(dialogRef: any): void {
                this.dialog = dialogRef;
            },
            info(text: string): Promise<boolean>{
                return this.dialog.confirm(text, constDialog.DIALOG_TYPE.INFO);
            },
            alert(text: string): Promise<boolean>{
                return this.dialog.confirm(text, constDialog.DIALOG_TYPE.ALERT);
            },
            error(text: string): Promise<boolean>{
                return this.dialog.confirm(text, constDialog.DIALOG_TYPE.ERROR);
            },
        },        
    }
);