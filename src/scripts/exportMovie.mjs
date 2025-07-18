
//不使用

//import nextTick from "vue";

const resizeImage = async (currentData, sizeRefElem) => {
    const aalist = currentData.aaList;
    const current = currentData.currentPosition;
    const editLogs = aalist[current].editLogs;

    let height = 0;
    let width = 0;

    for(let i=0; i < editLogs.length; i++){
        const aa = editLogs[i].value;
        if(aa != null){
            sizeRefElem.innerHTML = aa;
            //await nextTick();    
            height = Math.max(height, sizeRefElem.scrollHeight);
            width = Math.max(width, sizeRefElem.scrollWidth);
        }
    }

    canvasHeight = height;
    canvasWidth = width;
    //await nextTick();
}

const renderLogs = async (currentData, canvasElem, sizeRefElem) => {
    //resizeImage(currentData, sizeRefElem);

    const ctx = canvasElem.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, canvasElem.width, canvasElem.value.height);
    ctx.font = '16px Saitamaar';
    ctx.letterSpacing = 0;
    const lineHeight = 18;  //18px

    sizeRefElem.style.display = "inline-block";
    let canvasHeight = 0;
    let canvasWidth = 0;
    for(let i=0; i < editLogs.length; i++){
        const aa = editLogs[i].value;
        if(aa != null){
            ctx.font = '16px Saitamaar';
            ctx.letterSpacing = 0;
            sizeRefElem.innerHTML = aa
            //await nextTick();
            canvasHeight = Math.max(canvasHeight, sizeRefElem.scrollHeight)
            canvasWidth = Math.max(canvasWidth, sizeRefElem.scrollWidth)
        }
    }
    canvasElem.height = canvasHeight;
    canvasElem.width = canvasWidth;  

    var gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvasWidth,
        height: canvasHeight,
    });

    for(let i=0; i < editLogs.length; i++){
        const aa = editLogs[i].value
        ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
        ctx.font = '16px Saitamaar';
        ctx.letterSpacing = 0;
        if(aa != null ){
            const textArray = aa.split("\n");
            
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.fillStyle = 'black';
            for(let j = 0; j < textArray.length; j++){
                ctx.fillText(textArray[j], 0,  (j + 0.5) * lineHeight);
            }       
            const dataURL = canvasElem.value.toDataURL('image/png');
            const img = new Image();
            img.height = canvasHeight.value;
            img.width = canvasWidth.value; 
            img.src = dataURL;
            await gif.addFrame(img ,{delay: 1}); 
        }
    }

    gif.on('finished', function(blob) {
        return blob;
    });
    gif.render();
}


onmessage = async function(e) {
  const { currentData, canvasElem, sizeRefElem } = e.data;

  const result = await renderLogs(currentData, canvasElem, sizeRefElem);

  postMessage(result);
};
