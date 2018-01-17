function loadingStart(){
    $('.loadingDiv').css('display','block');
}

function loadingStop(){
    $('.loadingDiv').css('display','none');
}

var $upload = $('#upload'), //原始上传按钮
    $cropSection = $('#cropSection'), //第二步的section
    $defaultImgSet = $('#cropImg'), // 第二步的图片
    canvasDom,
    canvasCtx,
    $dropArea = $("#dropArea"), // 可以触发拖动的区域
    $reChoose = $('#reChoose,#reChooseb'),
    $toNext = $('#toNext'),
    $themeBgImg = $('#themeBgImg'),
    $themeFoot = $('#theme_foot'),
    $themeSelectWpr = $('.styleChoose .wpr span'),
    cropGesture = null,
    themeStlye = 1,
    themes = [
      {
        bg:'./static/img/theme1-bg.jpg',
        head:'./static/img/theme1-head.png',
        foot:'./static/img/theme1-foot.jpg',
        sm:'./static/img/theme1-sm.jpg',
        heado:{width:'110',height:'135'},
        cropLayerPos:{
          top:'.46rem',left:'10.8%',width:'78.4%'
        },
        cropLayerWprPos:{
          top:'2.24rem',left:'.58rem'
        }
      }
    ],
    changeTheme=function(obj){
      console.log('changeThemechange');
      $themeFoot.find('img')[0].style.width="100%";
      $themeFoot.find('img')[0].src = obj.foot;
      $('.themeHead')[0].src = obj.head;

      // cropLayer
      var posa = obj.cropLayerPos,
          posb = obj.cropLayerWprPos
      for (var key in posa) {
        $('#cropLayer').css(key,posa[key])
      }
      for (var key in posb) {
        $('#cropLayer .wpr').css(key,posb[key])
      }

      var img = new Image();
      img.onload = function(){
        themeBgImg.src = img.src;
      };
      img.src = obj.bg;
    }

window.indexPageReady = function(){
    loadingStart();
    $('#firstPage .chooseBtn').on('click',cropChoose)
    // 调试
    // changeTheme(themes[0]);


    // 在页面初始化完 设置 滑动区域
    // 让目标 arg2 在 容器 arg1 中 可以滑动 缩放的区域 arg3

    window.setTimeout(function(){

        //  targetMinWidth targetMinHeight 让宽和高 至少一项是正好满屏
        cropGesture = new EZGesture($dropArea[0], $defaultImgSet[0], {
            targetMinWidth : 750,
            targetMinHeight: 750
        })

        var $canvas = $("#cropCanvas");
        canvasDom = $canvas[0];
        canvasCtx = canvasDom.getContext("2d");
        cropGesture.targetMinWidth = canvasDom.width;
        cropGesture.targetMinHeight = canvasDom.height;

        $cropSection.css("visibility", "hidden");
        $cropSection.css("display", "");

        $cropSection.css("display", "none");
        $cropSection.css("visibility", "visible");

        loadingStop();
    },0)

}


// 此处可以判断 此浏览器内核 是否支持
function cropChoose(){
    cropStart($upload);

}

// 触发 upload
function cropStart(trigerBtn){
  // 不管是否选择文件 都开始加载主题1
    changeTheme(themes[0]);

  //  不管是否选择文件 加载所有主题的sm
  themes.forEach(function(el,index,len){
    $themeSelectWpr.eq(0).empty();
    console.log($themeSelectWpr.eq(0));
    var item = document.createElement('div'),
        sm = document.createElement('img');
        sm.setAttribute('src',el.sm);
        sm.style.width = '100%';
        item.classList.add('item');
        item.appendChild(sm);
        $themeSelectWpr.eq(0).append(item);
  })

  // 定义
    $upload.unbind('change');
    $upload.one('change', cropChanged);
    $upload.trigger('click');
}

// 转换为可用的 img base64
function cropChanged(evt){
  loadingStart();
  // 加载 theme1 时 调整二维码框的位置
  window.setTimeout(function(){
    $('#dropArea').css({
      left:$('#cropLayer .wpr').offset().left,
      top:$('#cropLayer .wpr').offset().top + $cropSection.scrollTop()
    })
    $('.themeHead').attr({'data-width':$('.themeHead').offset().width,'data-height':$('.themeHead').height()})
    setTimeout(function(){
      $('.themeHead')[0].style.width='100%';
    },0)
    loadingStop();
  },600)

    $cropSection.css('visibility','visible');
    $('#proSection').css('display','none')

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

            canvasDom.setAttribute('width',$themeBgImg[0].width)
            canvasDom.setAttribute('height',$themeBgImg[0].height)
            $('#megaPixImage').css({'width':this.width,'height':this.height})
        }
        var mpImg = new MegaPixImage(file);  // 将传入的图片调整为合理的大小
        // console.log('imgExif',imgExif.Orientation);
        mpImg.render(fullScreenImg, {
            maxWidth: 750,
            maxHeight: 750,
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

    //  选择theme
    $cropSection.find('.item').each(function(index,item){
        $(item).unbind('click');
    });
    $cropSection.find('.item').each(function(index,item){
        $(item).on('click',function(){
            loadingStart();
            var url = '../dist/static/img/style' + (index+1) + '.png';
            console.log($(this).index()+1,themeStlye);
            var a = new Image(),n = $(this).index();
            if(n+1 == themeStlye){loadingStop();return false;}
            a.onload = function(){
                console.log("loadimg");
                $('#themeBgImg')[0].src = a.src;
                loadingStop();
                themeStlye = n+1;
            }
            a.src = url;


        })
    })

    console.log('cropLoaded');
    // $('#cropLayer .wpr').css('left',$('#cropLayer .wpr').offsetLeft)


    // 将第一部中的图片 通过它的宽高 与 可触区域的宽高 协调大小
    var imgWidth = img.width;
    var imgHeight = img.height;
    var ratioWidth = $dropArea.width() / imgWidth; // 5 / 10
    var ratioHeight = $dropArea.height() / imgHeight; // 5 / 20
    var ratio = ratioWidth > ratioHeight ? ratioWidth : ratioHeight;
    console.log('imgWidth',imgWidth);
    console.log('imgHeight',imgHeight);
    cropGesture.targetMinWidth = imgWidth * ratio;
    cropGesture.targetMinHeight = imgHeight * ratio;

    console.log("ratio",ratio);

    var imgOriginX = ($dropArea.width() - cropGesture.targetMinWidth) * 0.5;
    var imgOriginY = ($dropArea.height() - cropGesture.targetMinHeight) * 0.5;

    // console.log('imgOriginX',imgOriginX,'imgOriginY',imgOriginY);

    $defaultImgSet.css("display", "");
    $defaultImgSet.width(cropGesture.targetMinWidth);
    $defaultImgSet.height(cropGesture.targetMinHeight);
    $defaultImgSet.css("left", [imgOriginX, "px"].join(""));
    $defaultImgSet.css("top", [imgOriginY, "px"].join(""));

    $defaultImgSet[0].src = img.src;
    cropGesture.unbindEvents();
    cropGesture.bindEvents();

    $reChoose.unbind(isSupportTouch ? "touchend" : "click");
    $reChoose.on(isSupportTouch ? "touchend" : "click", cropStart);
    $toNext.unbind(isSupportTouch ? "touchend" : "click");
    $toNext.on(isSupportTouch ? "touchend" : "click", cropConfirm);

}

function cropStop(){
    console.log('cropStop');

    // 取消选择 theme
    // $cropSection.find('.item').each(function(index,item){
    //     $(item).unbind('click');
    // });
}

function cropConfirm(evt) {
    // pageRecordClick("sng.tu.christmas2015.nextbtn");
    var $cropImg = $defaultImgSet;
    var $themeHead = $('.themeHead');
    var canvasScale =  canvasDom.height / $('#cropLayer .wpr').height();
    var megaPixImageScale = $('#megaPixImage').width() / $cropImg.width();
    var themeHeadScale = $('#megaPixImage').width() / $themeHead.width();

    var imgOrigin = {
        x: parseInt($cropImg.css('left')) || 0,
        y: parseInt($cropImg.css('top')) || 0
    };
    console.log('imgOrigin x,y',imgOrigin.x,imgOrigin.y);
    var imgSize = {
        width: $cropImg.width(),
        height: $cropImg.height()
    };
    console.log('imgSize width height',imgSize.width,imgSize.height);
    canvasCtx.fillStyle = 'rgba(255, 255, 255, 0)';
    canvasCtx.clearRect(0, 0, canvasDom.width, canvasDom.height);
    // 画主题图片
    canvasCtx.drawImage($themeBgImg[0],0,0,$themeBgImg.width(),$themeBgImg.height())
    // 画用户头像
    canvasCtx.drawImage($cropImg[0], Math.abs(imgOrigin.x)*megaPixImageScale, Math.abs(imgOrigin.y)*megaPixImageScale, $dropArea.width()*megaPixImageScale, $dropArea.height()*megaPixImageScale, $dropArea.offset().left,$dropArea.offset().top+ $cropSection.scrollTop(),$dropArea.width(),$dropArea.height());
    // 画用户头像框
    console.log('$themeHead',$(window).scrollTop(),$('#cropSection').scrollTop());
    canvasCtx.drawImage($themeHead[0], 0, 0, parseInt($themeHead.attr('data-width')), parseInt($themeHead.attr('data-height')), $themeHead.offset().left,$themeHead.offset().top + $cropSection.scrollTop(),$themeHead.width(),$themeHead.height());
    setTimeout(function(){
        proSave()

        // 取消选择 theme
        $cropSection.find('.item').each(function(index,item){
            $(item).unbind('click');
        });

    },0)

    return preventEventPropagation(evt);
}

function proSave(){
    var dataURL = "";
    if (window.isAndroid) {
        var imgEncoder = new JPEGEncoder();
        dataURL = imgEncoder.encode(canvasCtx.getImageData(0, 0, canvasDom.width, canvasDom.height), 100, true);
    } else {
        dataURL = canvasDom.toDataURL("image/jpeg", 1.0);
    }

    var img = new Image();
    img.onload = function(){
        $('#proSection img')[0].src = img.src;
        $('#proSection').css('display','block')
    }
    img.src = dataURL
}
