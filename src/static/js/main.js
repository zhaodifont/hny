function loadingStart(){
    $('.loadingDiv').css('display','block');
}

function loadingStop(){
    $('.loadingDiv').css('display','none');
}

var _touch = window.supportTouch?"touchend":"click";
// 相机
function openCamera(cb,option,a,b) {
  if(window.isAndroid){
    return window.cameraApi.eventCamera(
      function(result) {
        cb(result)
      },option
    );
  }else if(window.isIos){
    return window.cameraApi.eventCamera(
      function(result,type) {
        if(!result.success){
          loadingStop();
          return;
        }
        result = result.base64Image;
        cb(result)
      },option.type,a,b
    );
  }else{
    alert('error')
  }

}

// 保存
function saveImage(cb,imgBase64) {
  return window.cameraApi.saveImage(
    function(result) {
      cb(result);
    },imgBase64
  )
}
// 保存
function shareImageWithCallback(cb1,cb2,imgBase64) {
  if(window.isAndroid){
    return window.cameraApi.shareImageWithCallback(
      function(result) {
        cb1(result);
      },
      function(result) {
        cb2(result);
      },
      imgBase64
    );
  }else if(window.isIos){
    return window.cameraApi.shareImage(
      imgBase64
    );
  }

}

window.indexPageReady = function(){
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
        if(defaultbgStatue)loadingStop();
        // $cropSection.css("display", "none");
        // $cropSection.css("visibility", "visible");
        if(window.isAndroid){
          window.cameraApi = B612Kaji.Native.android.Function.getInstance();
        }else if(window.isIos){
          window.cameraApi = B612Kaji.Native.ios.Function.getInstance();
        }

        document.querySelector('#firstPage .chooseBtn').addEventListener(_touch,function(){

          // document.querySelector('#testTxt').innerHTML = ('isAndroid:'+window.isAndroid + '_isIos:' + window.isIos + 'cameraApi:' + window.cameraApi)

          $('.firstPage_choose').css('display','flex');
          $('.firstPage_choose').unbind(_touch);
          $('.firstPage_choose').on(_touch,function(){
            $('.firstPage_choose').css('display','none');
          })
          $('.firstPage_choose .wpr').unbind(_touch);
          $('.firstPage_choose .wpr').on(_touch,function(e){
            e.stopPropagation();
          })

          cropStart();

        },false)

        // 打开相机
        document.querySelector('.openCamera').addEventListener(_touch,function(){
          openCameraBefore()
        },false)

        // 打开相册
        document.querySelector('.openGallery').addEventListener(_touch,function(){
          openGalleryBefore()
        },false)

        // $('#testTxt').click(function(){
        //   saveImage(function(res){
        //     alert(0)
        //   },$('.guide img')[0].src)
        // })

    },200)

    // $('#firstPage .chooseBtn').on('click',cropChoose)


    // $('#audio').trigger('click');
}
var $upload = $('#upload'), //原始上传按钮
    $cropSection = $('#cropSection'), //第二步的section
    $defaultImgSet = $('#cropImg'), // 第二步的图片
    canvasDom,
    canvasCtx,
    upqrStatue = false,
    initTheme = false,
    $dropArea = $("#dropArea"), // 可以触发拖动的区域
    $reChoose = $('#reChoose,#reChooseb'),
    $toNext = $('#toNext'),
    $themeBgImg = $('#themeBgImg'),
    $themeFoot = $('#theme_foot'),
    $themeSelectWpr = $('.styleChoose .wpr span'),
    qrImgs = [
      'qr_guide_t.png','qr_guide1.png',
      'qr_guide2.png','qr_guide3.png','qr_guide4.png'
    ],
    cropGesture = null,
    themeStlye = 1,
    themes = [
      {
        bg:'./static/img/theme1-bg.jpg',
        foot:'./static/img/theme1-foot.jpg',
        sm:'./static/img/theme1-sm.jpg',
        eqpos:{
          bottom:'.75rem',right:'41.866%'
        }
      },
      {
        bg:'./static/img/theme2-bg.jpg',
        foot:'./static/img/theme1-foot.jpg',
        sm:'./static/img/theme2-sm.jpg',
        eqpos:{
          bottom:'.69rem',right:'17.06%'
        }
      },
      {
        bg:'./static/img/theme3-bg.jpg',
        foot:'./static/img/theme1-foot.jpg',
        sm:'./static/img/theme3-sm.jpg',
        eqpos:{
          bottom:'.6rem',right:'15.06%'
        }
      },
      {
        bg:'./static/img/theme4-bg.jpg',
        foot:'./static/img/theme1-foot.jpg',
        sm:'./static/img/theme4-sm.jpg',
        eqpos:{
          bottom:'.85rem',right:'41.866%'
        }
      },
      {
        bg:'./static/img/theme5-bg.jpg',
        foot:'./static/img/theme1-foot.jpg',
        sm:'./static/img/theme5-sm.jpg',
        eqpos:{
          bottom:'.99rem',right:'18.4%'
        }
      }
    ],
    changeTheme=function(obj){
      loadingStart()
      $themeFoot.find('img')[0].style.width="100%";
      $themeFoot.find('img')[0].src = obj.foot;
      $('#cropLayer').css({
        height:$('#cropLayer').offset().width,
        left:($('#cropSection').width() - $('#cropLayer').width()) / 2
      })

      if(!!obj.eqpos){
        $('#eCode').css(obj.eqpos)
      }

      // for (var key in posb) {
      //   $('#cropLayer .wpr').css(key,posb[key])
      // }
      $('#dropArea').css({
        width:$('#cropLayer').width(),
        height:$('#cropLayer').height(),
        left:$('#cropLayer').offset().left,
        top:$('#cropLayer').offset().top + $cropSection.scrollTop()
      })
      var img = new Image();
      img.onload = function(){
        themeBgImg.src = img.src;
        setTimeout(function(){
          // console.log('initTheme');
          loadingStop();
          initTheme = true;
        },260)
      };
      img.src = obj.bg;

    },
    zd_qrcode = null;

// 首屏弹层时 加载其余
function cropStart(res){
  // 不管是否选择文件 都开始加载主题1
  if(!initTheme){changeTheme(themes[0]);loadingStop();};

  //  不管是否选择文件 加载所有主题的sm
  $themeSelectWpr.eq(0).empty();
  themes.forEach(function(el,index,len){
    var item = document.createElement('div'),
        sm = document.createElement('img');
        sm.setAttribute('src',el.sm);
        sm.style.width = '100%';
        // console.log(sm);
        item.classList.add('item');
        item.appendChild(sm);
        $themeSelectWpr[0].appendChild(item);
  })
  $('#theme_foot span').find('.item').eq(0).addClass('active')
  // 底部选择theme部分
  $('#theme_foot span').find('.item').each(function(index,item){
      $(item).unbind(_touch);
  });
  $('#theme_foot span').find('.item').each(function(index,item){
      $(item).on(_touch,function(){
        $('#theme_foot span').find('.item').removeClass('active');
          var n = $(this).index();
          $(this).addClass('active')
          if(n+1 == themeStlye){loadingStop();return false;}
          themeStlye = n+1;
          changeTheme(themes[index]);
      })
  })

}

function openCameraBefore(){
  loadingStart();
  openCamera(function(res){
    // document.querySelector('#testTxt').innerText = JSON.stringify(res);

    if(res.length == 0){
      loadingStop();
      return false;
    };
    $('.firstPage_choose').css('display','none');
    cropChanged(res)
  },{type:"imageCamera"})
}
function openGalleryBefore(){
  loadingStart();
  openCamera(function(res,type){
    // document.querySelector('#testTxt').innerText = res;
    if(res.length == 0){
      loadingStop();
      return false;
    };
    $('.firstPage_choose').css('display','none');
    cropChanged(res)
  },{type:"imageAlbum"})
}

// 转换为可用 img base64
function cropChanged(res){

    if(!initTheme){changeTheme(themes[0]);}
    $cropSection.css('visibility','visible');
    $('#proSection').css('display','none')


    var img = new Image();
    img.onload = function(){
      cropLoaded(this);
      // $('#testTxt').text(this)
      canvasDom.setAttribute('width',$themeBgImg[0].width)
      canvasDom.setAttribute('height',$themeBgImg[0].height)
      $('#megaPixImage').css({'width':this.width,'height':this.height})
    }
    img.src = res;
}

// 安装给页面的 img 的src
function cropLoaded(img){
    $cropSection.css("display", "");

    // 将第一部中的图片 通过它的宽高 与 可触区域的宽高 协调大小
    var imgWidth = img.width;
    var imgHeight = img.height;
    var ratioWidth = $dropArea.width() / imgWidth; // 5 / 10
    var ratioHeight = $dropArea.height() / imgHeight; // 5 / 20
    var ratio = ratioWidth > ratioHeight ? ratioWidth : ratioHeight;

    cropGesture.targetMinWidth = imgWidth * ratio;
    cropGesture.targetMinHeight = imgHeight * ratio;

    var imgOriginX = ($dropArea.width() - cropGesture.targetMinWidth) * 0.5;
    var imgOriginY = ($dropArea.height() - cropGesture.targetMinHeight) * 0.5;

    // console.log('imgOriginX',imgOriginX,'imgOriginY',imgOriginY);
    // console.log('cropGesture.targetMinWidth:',cropGesture.targetMinWidth);
    $defaultImgSet.css("display", "");
    $defaultImgSet.width(cropGesture.targetMinWidth);
    $defaultImgSet.height(cropGesture.targetMinHeight);
    $defaultImgSet.css("left", [imgOriginX, "px"].join(""));
    $defaultImgSet.css("top", [imgOriginY, "px"].join(""));

    $defaultImgSet[0].src = img.src;
    $defaultImgSet[0].onload = function(){
      loadingStop();
    }

    if(initTheme)loadingStop();
    cropGesture.unbindEvents();
    cropGesture.bindEvents();

    $reChoose.unbind(_touch);
    $reChoose.on(_touch, toReChoose);
    $toNext.unbind(_touch);
    $toNext.on(_touch, cropConfirm);

    $('#eCode').unbind(_touch);
    $('#eCode').on(_touch,function(){
      $('#qrGuide').css('display','');
    })
    $('#qrGuide .return').unbind(_touch);
    $('#qrGuide .return').on(_touch,function(){
      $('#qrGuide').css('display','none');
    })

    if(!upqrStatue){
      $('#qrGuide img').each(function(index,el){
        el.src= './static/img/' + qrImgs[index]
      })
      loadScript('./static/js/qrcode.js');
      loadScript('./static/js/llqrcode.js',function(){
        upqr()
      });
    }
}

function toReChoose(){
  $('.firstPage_choose').css('display','flex');
}

function cropStop(){
    console.log('cropStop');
}

function cropConfirm(evt) {
    var $cropImg = $defaultImgSet;
    var canvasScale =  canvasDom.height / $('#cropLayer .wpr').height();
    var megaPixImageScale = $('#megaPixImage').width() / $cropImg.width();
    // var themeHeadScale = $('#megaPixImage').width() / $themeHead.width();
    var imgOrigin = {
        x: parseInt($cropImg.css('left')) || 0,
        y: parseInt($cropImg.css('top')) || 0
    };
    var imgSize = {
        width: $cropImg.width(),
        height: $cropImg.height()
    };
    // canvasCtx.clearRect(0, 0, canvasDom.width, canvasDom.height);
    // 画主题图片
    canvasCtx.drawImage($themeBgImg[0],0,0,750,993,0,0,$themeBgImg.width(),$themeBgImg.height())
    // 画用户头像
    canvasCtx.drawImage($cropImg[0], Math.abs(imgOrigin.x)*megaPixImageScale, Math.abs(imgOrigin.y)*megaPixImageScale, $dropArea.width()*megaPixImageScale, $dropArea.height()*megaPixImageScale, $dropArea.offset().left,$dropArea.offset().top+ $cropSection.scrollTop(),$dropArea.width(),$dropArea.height());
    // 画用户头像框
    // canvasCtx.drawImage($themeHead[0], 0, 0, parseInt($themeHead.attr('data-width')), parseInt($themeHead.attr('data-height')), $themeHead.offset().left,$themeHead.offset().top + $cropSection.scrollTop(),$themeHead.width(),$themeHead.height());
    // 画用户二维码
    canvasCtx.fillStyle="#fff";
    canvasCtx.fillRect($('#eCode').offset().left-2,$('#eCode').offset().top + $cropSection.scrollTop() - 2,$('#eCode').width(),$('#eCode').height());
    canvasCtx.drawImage($('#eCode')[0], 0, 0, 124, 124, $('#eCode').offset().left,$('#eCode').offset().top + $cropSection.scrollTop(),$('#eCode').width()+10,$('#eCode').height()+10);
    setTimeout(function(){
        loadingStart()
        proSave()
    },0)

    return preventEventPropagation(evt);
}

function proSave(){
  $('.nextGuide').css('display','flex');
  $('.nextGuide .confirm').unbind(_touch);
  $('.nextGuide .confirm').on(_touch,function(){
    $('.nextGuide').css('display','none');
  })
    var dataURL = "";
    if (window.isAndroid) {
        var imgEncoder = new JPEGEncoder();
        dataURL = imgEncoder.encode(canvasCtx.getImageData(0, 0, canvasDom.width, canvasDom.height), 200, true);
    } else {
        dataURL = canvasDom.toDataURL("image/jpeg", 1.0);
    }

    var img = new Image();
    img.onload = function(){
        $('#proSection img')[0].src = img.src;
        $('#proSection').css('display','block')
        loadingStop();

    }
    img.src = dataURL;

    $('#proSection .save').on(_touch,function(){
      saveImage(function(res){
        alert('照骗已经存入您的相册里了')
      },img.src)
    })

    $('#proSection .share').on(_touch,function(){
      shareImageWithCallback(
        function(res){
          // 点击分享
        },
        function(res){
          // alert('分享完了')
          // 分享返回
        },
        img.src
      )
    })

}

function upqr(){
  // 二维码引导
  $('#qrGuide .btn').unbind(_touch);
  $('#qrGuide .btn').on(_touch,function(){
    loadingStart();
    openCamera(function(res){
      if(res.length == 0){
        loadingStop()
        return false;
      };
      qrcode.decode(res);
    },{type:'imageAlbum'})
  });

  function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function read(a){
    loadingStop();
    if(!!(a.indexOf('wxp:') > -1)){
      zd_qrcode.makeCode(htmlEntities(a))
      $('#eCode')[0].src = $('#zd_qrcode img')[0].src;
      $('#qrGuide').css('display','none');
      $('#proSection img')[1].src="./static/img/theme1-foot.jpg";
      loadingStart();
      setTimeout(function(){
        $('#toNext').trigger('click');
      },0)
    }else if(a.indexOf('Failed') > -1){
      alert('抱歉您的手机不支持此功能')
    }else{
      alert('请输入有效的收款二维码')
    }
    $('#handleQR')[0].value = '';
  }

  function load(){
    if(window.File && window.FileReader){
      initCanvas(200, 150);
      qrcode.callback = read;
     }
  }
  load();

  var gCanvas;
  function initCanvas(w,h){
      gCanvas = document.getElementById("qr-canvas");
      gCanvas.style.width = w + "px";
      gCanvas.style.height = h + "px";
      gCanvas.width = w;
      gCanvas.height = h;
      gCtx = gCanvas.getContext("2d");
      gCtx.clearRect(0, 0, w, h);
  }

  zd_qrcode = new QRCode(document.getElementById("zd_qrcode"), {
  	width : 100,
  	height : 100
  });
  zd_qrcode.makeCode('')
  upqrStatue = true;
}
