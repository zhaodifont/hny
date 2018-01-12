function loadingStart(){
	$('.loadingDiv').css('display','');
}

function loadingStop(){
	$('.loadingDiv').css('display','none');
}



var $upload = $('#upload'), //原始上传按钮
	$cropSection = $('#cropSection'), //第二步的section
    $defaultImgSet = $('#cropLayer img'), // 第二步的图片
    canvasDom,
    canvasCtx,
    $dropArea = $("#dropArea span"), // 可以触发拖动的区域
    $reChoose = $('#reChoose'),
    $toNext = $('#toNext'),
    cropGesture = null;

window.indexPageReady = function(){
	loadingStart();
    $('#firstPage .chooseBtn').on('click',cropChoose)


    // 在页面初始化完 设置 滑动区域
    // 让目标 arg2 在 容器 arg1 中 可以滑动 缩放的区域 arg3

    window.setTimeout(function(){

        cropGesture = new EZGesture($dropArea[0], $defaultImgSet[0], {
            targetMinWidth: 420,
            targetMinHeight: 420
        })

        

        var $canvas = $("#cropCanvas");
        canvasDom = $canvas[0];
        canvasCtx = canvasDom.getContext("2d");
        cropGesture.targetMinWidth = canvasDom.width;
        cropGesture.targetMinHeight = canvasDom.height;

        // cropGesture.targetMinWidth = canvasDom.width;
        // cropGesture.targetMinHeight = canvasDom.height;
        // $(cropGesture).css({'border':'1px blue solid'})
        $cropSection.css("visibility", "hidden");
        $cropSection.css("display", "");

        // var cropLayerHeight = ($("#cropSection").width() * canvasDom.height * 100 / (canvasDom.width * $("#cropSection").height())).toFixed(2);
        // $("#cropLayer").css("height", [cropLayerHeight, "%"].join(""));
        //
        $cropSection.css("display", "none");
        $cropSection.css("visibility", "visible");

    },0)



    loadingStop();
}

$("#defaultPic div").on('click',function(){
    console.log("2222");
})


// 此处可以判断 此浏览器内核 是否支持
function cropChoose(){
	console.log('cropChoose');
	cropStart($upload);
}

// 触发 upload
function cropStart(trigerBtn){
	$upload.unbind('change');
	$upload.one('change', cropChanged);
	$upload.trigger('click');
}

// 转换为可用的 img base64
function cropChanged(evt){
	console.log('cropChanged');
	console.log(this.files);
	if(this.files.length < 1){
		cropStop();
		return preventEventPropagation(evt);
	}
	var file = this.files[0];
    var reader = new FileReader();
	reader.onload = function () {
        var binary = this.result;
        var binaryData = new BinaryFile(binary); // 转为二进制
        var imgExif = EXIF.readFromBinaryFile(binaryData); // false

        var fullScreenImg = new Image();
        fullScreenImg.onload = function () {
            cropLoaded(this);
            // console.log(this);
            loadingStop();
        }
        var mpImg = new MegaPixImage(file);  // 将传入的图片调整为合理的大小
        // console.log('imgExif',imgExif.Orientation);
        mpImg.render(fullScreenImg, {
            maxWidth: 960,
            maxHeight: 960,
            orientation: imgExif.Orientation // false . undefined
        });
    }
    reader.readAsBinaryString(file);
    return preventEventPropagation(evt);

}

// 安装给页面的 img 的src
function cropLoaded(img){
	var isSupportTouch = window.supportTouch;
	$cropSection.css("display", "");
	console.log('cropLoaded');
	// $('#cropLayer .wpr').css('left',$('#cropLayer .wpr').offsetLeft)


	// 将第一部中的图片 通过它的宽高 与 可触区域的宽高 协调大小
	var imgWidth = img.width;
    var imgHeight = img.height;
    var ratioWidth = $dropArea.width() / imgWidth;
    var ratioHeight = $dropArea.height() / imgHeight;
    var ratio = ratioWidth > ratioHeight ? ratioWidth : ratioHeight;
    console.log('imgWidth',imgWidth);
    console.log('imgHeight',imgHeight);
    cropGesture.targetMinWidth = imgWidth * ratio;
    cropGesture.targetMinHeight = imgHeight * ratio;

    var imgOriginX = ($dropArea.width() - cropGesture.targetMinWidth) * 0.5;
    var imgOriginY = ($dropArea.height() - cropGesture.targetMinHeight) * 0.5;

    $defaultImgSet.css("display", "");
    $defaultImgSet.width(cropGesture.targetMinWidth);
    $defaultImgSet.height(cropGesture.targetMinHeight);
    $defaultImgSet.css("left", [imgOriginX, "px"].join(""));
    $defaultImgSet.css("top", [imgOriginY, "px"].join(""));

    $defaultImgSet[0].src = img.src;
    cropGesture.unbindEvents();
    cropGesture.bindEvents();

	$reChoose.unbind(isSupportTouch ? "touchend" : "click");
    $reChoose.on(isSupportTouch ? "touchend" : "click", cropStart());
    $toNext.unbind(isSupportTouch ? "touchend" : "click");
    $toNext.on(isSupportTouch ? "touchend" : "click", cropConfirm);

}

function cropStop(){
	console.log('cropStop');
}

function cropConfirm(evt) {
    // pageRecordClick("sng.tu.christmas2015.nextbtn");
    var canvasScale =  canvasDom.height / $('#cropLayer .wpr').height();
    var viewScale = $('#cropLayer .wpr').width() / $cropSection.width();
    var $cropImg = $defaultImgSet;
    var imgOrigin = {
        x: parseInt($cropImg.css('left')) || 0,
        y: parseInt($cropImg.css('top')) || 0
    };
    console.log('imgOrigin x,y',imgOrigin.x,imgOrigin.y);
    var imgSize = {
        width: $cropImg.width(),
        height: $cropImg.height()
    };
    console.log('imgSize ',imgOrigin.x,imgOrigin.y,$('#cropLayer .wpr').width(),$('#cropLayer .wpr').height());
    canvasCtx.clearRect(0, 0, canvasDom.width, canvasDom.height);
    // 画主题图片
    // canvasCtx.drawImage($('#bgStyle img')[0],0,0,$('#bgStyle img').width(),$('#bgStyle img').height())
    // 画用户头像
    canvasCtx.drawImage($cropImg[0], Math.abs(imgOrigin.x)*canvasScale, Math.abs(imgOrigin.y)*canvasScale, $('#cropLayer .wpr').width(), $('#cropLayer .wpr').height(), 10,10,$('#cropLayer .wpr').width(),$('#cropLayer .wpr').width());
    // canvasCtx.drawImage(canvasCtx, 20, 20, imgSize.width * canvasScale, imgSize.height * canvasScale);
    // var dataURL = "";
    // if (window.isAndroid) {
    //     var imgEncoder = new JPEGEncoder();
    //     dataURL = imgEncoder.encode(canvasCtx.getImageData(0, 0, canvasDom.width, canvasDom.height), 100, true);
    // } else {
    //     dataURL = canvasDom.toDataURL("image/jpeg", 1.0);
    // }
    // var dataComponent = dataURL.split(",");
    // if (dataComponent.length >= 2) {
    //     var dataBase64 = dataComponent[1];
    //     if (dataBase64.length > 0) {
    //         cropStop();
    //         // hatStart(dataBase64);
    //     }
    // }
    // $('#test img')[0].src=dataURL;
    // 转出头像的img  然后继续 与主题 拼合
    

    // var userTheme = new Image();
    // userTheme.onload = function(){
    // 	userTheme.style.width = "100%";
    // 	// canvasCtx.clearRect(0, 0, canvasDom.width, canvasDom.height);
    // 	// canvasCtx.fillStyle = '#000';
    // 	// canvasCtx.fillRect(0,0,canvasDom.width,canvasDom.height);
    // 	// canvasCtx.drawImage($('#bgStyle img')[0],0,0,$('#bgStyle img').width(),$('#bgStyle img').height())
    // }
    // userTheme.src = dataURL;
    
    return preventEventPropagation(evt);
}

// 选择style
$cropSection.find('.item').on('click',function(){
	console.log('choose style');
})
