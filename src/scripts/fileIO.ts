 

const showOpenFileDialog = (acceptType: string) => new Promise<FileList | null>(resolve => {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = acceptType;
	input.onchange = () => { resolve(input.files); };
	input.click();
});

export const openText = async (fileType: Array<string>): Promise<{isValid: boolean, filename: string, content: string, errorMessage: string}> => {
    let fileTypeStr: string = "";
    for(let i=0; i < fileType.length; i++){
        fileTypeStr += ".";
        fileTypeStr += fileType[i]
        if(i < fileType.length - 1){
            fileTypeStr += ", ";
        }
    }
   	const files: FileList | null = await showOpenFileDialog(fileTypeStr);
    let isValid: boolean = false;
    let content: string = "";
    let errorMessage: string = "";
    let filename: string = "";
    if(files == null){
        isValid = false;
        content = "";
        errorMessage = "ファイルを読み込めませんでした"
    }else{
        const name: string = files[0].name;
        const temp = isValidFileType(name, fileType);
        isValid = temp.isValid
        errorMessage = temp.errorMessage
        if(isValid){
            const bytes = await files[0].arrayBuffer()
            if(isUTF8(bytes)){
                content = await files[0].text();
            }else{
                const textDecoder = new TextDecoder('shift-jis');
                content = textDecoder.decode(await bytes);                
            }
            isValid = true;     
            errorMessage = ""; 
            filename = files[0].name;        
        }
    }
    return {isValid: isValid ,filename: filename , content: content, errorMessage: errorMessage};
};

export const isValidFileType = (fileName: string, allowedFiletype: Array<string>): {isValid: boolean, errorMessage: string} => {
    const filetype:string | undefined = fileName.split('.').pop();
    const result: {isValid: boolean, errorMessage: string} = {isValid: false, errorMessage: "初期値"};
    if(filetype == null){
        result.isValid = false;
        result.errorMessage = "拡張子を持たないファイルです。読み込みに失敗しました";
    }else{
        const fileExtension = filetype.toLowerCase();
        console.log(fileExtension);
        if(allowedFiletype.includes(fileExtension)){
            result.isValid = true;
            result.errorMessage = "";
        }else{
            result.isValid = false;
            result.errorMessage = "不正な拡張子です。読み込みに失敗しました";
        }
    }
    return result;
}

const isUTF8 = (bytes: ArrayBuffer): boolean => {
    const decoderUTF8 = new TextDecoder();
    const encoderUTF8 = new TextEncoder();
    return bytes == encoderUTF8.encode(decoderUTF8.decode(bytes));
}

const getShiftJisTable = () => {

    const decoder = new TextDecoder('shift-jis');
    const table: Map<string, number> = new Map([['\u00a5', 0x5c], ['\u203e', 0x7e], ['\u301c', 0x8160 ]]);

    for (let i = 0x81; i <= 0xfc; i++) {
        if (i <= 0x84 || i >= 0x87 && i <= 0x9f || i >= 0xe0 && i <= 0xea || i >= 0xed && i <= 0xee || i >= 0xfa) {
            for (let j = 0x40; j <= 0xfc; j++) {
                const c = decoder.decode(new Uint8Array([i, j]));
                if (c.length === 1 && c !== '\ufffd' && !table.get(c)) {
                    table.set(c , i << 8 | j);
                }
            }
        }
    }
    return table;
}


const encodeShiftJis = (content: string) => {
    const table = getShiftJisTable();
    let buffer = [];
    for (let i = 0; i < content.length; i++) {
        const c = content.codePointAt(i);
        if(c == null){
            return;
        }
        if (c > 0xffff) {
            i++;
        }
        if (c < 0x80) {
            buffer.push(c);
        }
        else if (c >= 0xff61 && c <= 0xff9f) {
            buffer.push(c - 0xfec0);
        }
        else {
            const d = table.get(String.fromCodePoint(c)) || 0x3f;
            if (d > 0xff) {
                buffer.push(d >> 8 & 0xff, d & 0xff);
            }
            else {
                buffer.push(d);
            }
        }
    }
    return Uint8Array.from(buffer);
};

export const writeAaTextFile = (text: string, filename: string ,filetype: string , encode: string): void => {
    // SHIFT-JISにエンコード
    const sjisData = encodeShiftJis(text);
    if(sjisData == null){
        return;
    }

    let encodeOption: string = "";
    switch(encode){
        case "shift-jis":
            encodeOption = 'text/plain;charset=shift-jis;';
            break;
        case "utf-8":
            encodeOption = 'text/plain;';
            break;
    }
    // Blobでデータを作成
    const blob = new Blob([sjisData], { type: 'text/plain;charset=shift-jis;' });

    // ダウンロードリンクを作成
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename + "." + filetype;

    // ダウンロードリンクをクリック
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 後処理
    URL.revokeObjectURL(link.href);
}
