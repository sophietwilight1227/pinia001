import {defineStore} from "pinia";

interface State {
    fontFamily: string;
    hasHistory: boolean;
    charPalette: Array<{indexName: string,
                    charList: Array<{
                        value: string,
                        width: number
                    }>
                }>
};

export const useSettingStore = defineStore(
    "settings",
    {
        state: (): State => {
            return {
                fontFamily: "",
                hasHistory: false,
                charPalette: [],
            };
        },
        getters: {

        },
        actions: {
            initCharPalette(): void {
                const list1 = [];
                list1.push({value: "a", width: 1});
                list1.push({value: "b", width: 2});
                list1.push({value: "c", width: 3});
                list1.push({value: "d", width: 1});
                list1.push({value: "e", width: 2});
                list1.push({value: "f", width: 3});
                list1.push({value: "g", width: 1});
                list1.push({value: "h", width: 2});
                list1.push({value: "i", width: 3});
                this.charPalette.push({indexName: "name1", charList: list1});

                const list2 = [];
                list2.push({value: "q", width: 1});
                list2.push({value: "w", width: 2});
                list2.push({value: "e", width: 3});
                list2.push({value: "r", width: 1});
                list2.push({value: "t", width: 2});
                list2.push({value: "y", width: 3});
                list2.push({value: "u", width: 1});
                list2.push({value: "i", width: 2});
                list2.push({value: "o", width: 3});
                this.charPalette.push({indexName: "name2", charList: list2});
            }
        },        
    }
);