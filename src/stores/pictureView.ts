import {defineStore} from "pinia";
import constPictureView from "@/consts/constPictureView";
import constLocalStorage from "@/consts/constLocalStorage";
interface State {
    imageUrl: string,
    params: Map<string, number>,
    backgroundColor: string,
};

export const usePictureViewStore = defineStore(
    "pictureView",
    {
        state: (): State => {
            return {
                imageUrl: "",
                params: new Map(),
                backgroundColor: "white",
            };
        },
        getters: {
            cssParam: (state: State) => {
                return (id: string):string => {
                    switch(id){
                    case constPictureView.PARAM_LIST.POS_X.id:
                        return state.params.get(id) + "px";
                    case constPictureView.PARAM_LIST.POS_Y.id:
                        return state.params.get(id) + "px";
                    case constPictureView.PARAM_LIST.SIZE_RATE.id:
                        return String(Number(state.params.get(id)) / 100);
                    case constPictureView.PARAM_LIST.ROTE_ANGLE.id:
                        return state.params.get(id) + "deg";
                    case constPictureView.PARAM_LIST.ALPHA.id:
                        if(Number(state.params.get(id)) < 0){
                        state.backgroundColor = "black"
                        }else{
                        state.backgroundColor = "white"
                        }
                        return String(1 - Math.abs(Number(state.params.get(id)) / 100) );
                    default:
                        return "";
                    }
                }
            }
        },
        actions: {
            initParams():void {
                this.params = new Map();
                Object.values(constPictureView.PARAM_LIST).forEach(value => {
                    const savedValue = localStorage.getItem(constLocalStorage.PREFIX + value.id);
                    console.log(savedValue);
                    if(savedValue == null){
                        this.params.set(value.id, value.initialValue);
                    }else{
                        this.params.set(value.id, Number.parseInt(savedValue));
                    }
                });
            },
            resetParams(){
                Object.values(constPictureView.PARAM_LIST).forEach(value => {
                    this.setValue(value.id, value.initialValue);
                });
            },
            getValue(id: string): number {
                const value = this.params.get(id)
                if(value == null){
                    return 0;
                }else{
                    return value;
                }
                
            },
            setValue(id: string, value: number): void {
                this.params.set(id, value);
                localStorage.setItem(constLocalStorage.PREFIX + id, value.toString());
            },
            getCssValue(id:string){
                switch(id){
                    case constPictureView.PARAM_LIST.POS_X.id:
                        return this.params.get(id) + "px";
                    case constPictureView.PARAM_LIST.POS_Y.id:
                        return this.params.get(id) + "px";
                    case constPictureView.PARAM_LIST.SIZE_RATE.id:
                        return String(Number(this.params.get(id)) / 100);
                    case constPictureView.PARAM_LIST.ROTE_ANGLE.id:
                        return this.params.get(id) + "deg";
                    case constPictureView.PARAM_LIST.ALPHA.id:
                        if(Number(this.params.get(id)) < 0){
                        this.backgroundColor = "black"
                        }else{
                        this.backgroundColor = "white"
                        }
                        return String(1 - Math.abs(Number(this.params.get(id)) / 100) );
                    default:
                        return "";
                    }
            },
            setImage(url: string){
                this.imageUrl = url;
            }
        },        
    }
);