function loadingStart(){
	$('.loadingDiv').css('display','');
}

function loadingStop(){
	$('.loadingDiv').css('display','none');
}



var $upload = $('#upload'),
    $defaultImgSet = $('#cropLayer img').get(0),
    canvasDom,
    canvasCtx,
    cropGesture = null;

window.indexPageReady = function(){
	loadingStart();
    $('#firstPage .chooseBtn').on('click',cropChoose)


    // 在页面初始化完 设置 滑动区域
    // 让目标 arg2 在 容器 arg1 中 可以滑动 缩放的区域 arg3

    window.setTimeout(function(){

        cropGesture = new EZGesture($("#dropArea span")[0], $("#cropImg")[0], {
            targetMinWidth: 420,
            targetMinHeight: 420
        })

        var $canvas = $("#cropCanvas");
        canvasDom = $canvas[0];
        canvasCtx = canvasDom.getContext("2d");
        // cropGesture.targetMinWidth = canvasDom.width;
        // cropGesture.targetMinHeight = canvasDom.height;
        $("#cropSection").css("visibility", "hidden");
        $("#cropSection").css("display", "");

        var cropLayerHeight = ($("#cropSection").width() * canvasDom.height * 100 / (canvasDom.width * $("#cropSection").height())).toFixed(2);
        // $("#cropLayer").css("height", [cropLayerHeight, "%"].join(""));
        //
        $("#cropSection").css("display", "none");
        $("#cropSection").css("visibility", "visible");

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
	trigerBtn.unbind('change');
	trigerBtn.one('change', cropChanged);
	trigerBtn.trigger('click');
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
	$("#cropSection").css("display", "");
	console.log('cropLoaded');
	$defaultImgSet.src = img.src;

}

function cropStop(){
	console.log('cropStop');
}


// 选择style
$('#cropSection .item').on('click',function(){
	console.log('choose style');
})
