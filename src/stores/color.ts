import {defineStore} from "pinia";
import constColor from "@/consts/constColor";

interface State {
    colorDic: Map<string, string>,
    colorScheme: string,
};

export const useColorStore = defineStore(
    "color",
    {
        state: (): State => {
            return {
                colorDic: new Map(),
                colorScheme: "test",
            };
        },
        getters: {
            getColor(state: State) {
                return (name: string) => {
                    let color: string = "rgb(0,0,0)";
                    if(this.colorDic.has(name)){
                        const tmp = this.colorDic.get(name);
                        if(tmp != null){
                            color = tmp;
                        }
                    }
                    return color;
                }
            },
        },
        actions: {
            init():void {
                for(let i=0; i < constColor.SCHEME_LIST.length; i++){
                    if(constColor.SCHEME_LIST[i].id == this.colorScheme){
                        const list = constColor.SCHEME_LIST[i].values;
                        list.forEach(element => {
                            this.colorDic.set(element.id, element.value);
                        });
                    }
                }
            },
            changeColorScheme(name: string): void {
                this.colorScheme = name;
                this.init();
            },
        },        
    }
);