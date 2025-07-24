import { encodeShiftJis } from '@/scripts/fileIO';

export const decodeNumericEntity = (str: string) => {
    return decodeNumericEntityWithoutSemicolon(decodeNumericEntityWithSemicolon(str))
}

const decodeNumericEntityWithSemicolon = (str: string) => {
    var re = /&#([0-9a-fA-F]+);/g;
    return str.replace(re, function(m) {
      var cp = parseInt(arguments[1], 10);
      return String.fromCodePoint(cp);
    }); 
}
const decodeNumericEntityWithoutSemicolon = (str: string) => {
    var re = /&#([0-9a-fA-F]+)/g;
    return str.replace(re, function(m) {
      var cp = parseInt(arguments[1], 10);
      return String.fromCodePoint(cp);
    }); 
}

const getByte = (char: string) => {
    var c = char.charCodeAt(0);
    if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
      return 1;
    } else {
      return 2;
    }
}

export const convertSjis = (aa: string): string => {
    const sjisData = encodeShiftJis(aa);
    const decoder = new TextDecoder('shift_jis');
    let sjisCount = 0;
    let sjisText: string = "";
    for(let i=0; i < aa.length; i++){
        const char: string = aa.charAt(i);
        const byteCount: number = getByte(char);
        const charCode = sjisData?.slice(sjisCount, sjisCount + byteCount);
        if(char == decoder.decode(charCode)){
            sjisText += char;
        }else{
            sjisText += ("&#" + char.charCodeAt(0) + ";" );
        }
        sjisCount += byteCount;
    }
    return sjisText;
}
