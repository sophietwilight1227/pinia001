import {defineStore} from "pinia";

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
            confirm(text: string): Promise<boolean>{
                return this.dialog.confirm(text);
            }
        },        
    }
);