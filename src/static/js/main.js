function loadingStart(){
    $('.loadingDiv').css('display','block');
}

function loadingStop(){
    $('.loadingDiv').css('display','none');
}

// true： 是低版本系统， false：不是低版本系统
var lowSysVersion = function(){
// 苹果机
  if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
    var iosLimitVersion = [10, 2, 2]; //
    var iosVersionArr = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/); // ["OS 10_3_2", "10", "3", "1"]
    //去除匹配的第一个下标的元素
    iosVersionArr.shift();
    for(var i = 0; i< iosLimitVersion.length; i++){
      //防止undefined， 版本号为2位数时， 数组中最后一位是undefined
      var cur = parseInt(iosVersionArr[i], 10) || 0;
      var limit = parseInt(iosLimitVersion[i], 10) || 0;
      // cur<limit：当前版本低于限制版本； cur==limit:当前版本等于限制版本，继续比较小版本；cur>limit:当前版本高于限制版本
      if(cur < limit){
        return true;
      } else if(cur > limit){
        return false;
      }
    }
    return false;
  } else if (/(Android)/i.test(navigator.userAgent)){ //安卓机
    var andrLimitVersion = [4, 5, 0]; //"4.2";
    var andrVersionArr = navigator.userAgent.match(/Android (\d+)\.(\d+)\.?(\d+)?/); //  ["Android 5.0.2","5","0","2"]
    //去除匹配的第一个下标的元素
    andrVersionArr.shift();
    for(var i = 0; i< andrLimitVersion.length; i++){
      var cur = parseInt(andrVersionArr[i], 10) || 0;
      var limit = parseInt(andrLimitVersion[i], 10) || 0;
      if(cur < limit){
        return true;
      } else if(cur > limit){
        return false;
      }
    }
    return false;
  }
}
var lowVersion = lowSysVersion();
var _touch = window.supportTouch?"touchend":"click";
// 相机

var openCamera = function(cb,option,a,b) {
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
      },option.type
    );
  }else{
    console.log('error')
  }

}

// 保存
var saveImage = function(cb,imgBase64) {
  return window.cameraApi.saveImage(
    function(result) {
      cb(result);
    },imgBase64
  )
}
// 保存
var shareImageWithCallback = function(cb1,cb2,imgBase64) {
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
    return window.cameraApi.shareImageWithCallback(
      imgBase64,cb2
    );
  }else{
    return;
  }

}

var getCameraImage = function(cb){
  return window.cameraApi.getCameraImage(
    function(result) {
      if(window.isAndroid && !!result){
        cb(result)
      }else if(window.isIos && !!result.base64Image){
        cb(result.base64Image);
      }

    }
  )
}



var $upload = $('#upload'), //原始上传按钮
    $cropSection = $('#cropSection'), //第二步的section
    $defaultImgSet = $('#cropImg'), // 第二步的图片
    canvasDom,
    canvasCtx,
    upqrStatue = false,
    cropStartStatus = false,
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
    themeStlye = 1,
    themes = [
      {
        bg:'./static/img/theme1-bg.jpg?v=123a',
        foot:'./static/img/theme1-foot.jpg',
        sm:'./static/img/theme1-sm.jpg',
        eqpos:{
          bottom:'1.09rem',right:'41.866%'
        }
      },
      {
        bg:'./static/img/theme2-bg.jpg',
        foot:'./static/img/theme1-foot.jpg',
        sm:'./static/img/theme2-sm.jpg',
        eqpos:{
          bottom:'1.03rem',right:'17.06%'
        }
      },
      {
        bg:'./static/img/theme3-bg.jpg',
        foot:'./static/img/theme1-foot.jpg',
        sm:'./static/img/theme3-sm.jpg',
        eqpos:{
          bottom:'.94rem',right:'15.06%'
        }
      },
      {
        bg:'./static/img/theme4-bg.jpg',
        foot:'./static/img/theme1-foot.jpg',
        sm:'./static/img/theme4-sm.jpg',
        eqpos:{
          bottom:'1.19rem',right:'41.866%'
        }
      },
      {
        bg:'./static/img/theme5-bg.jpg',
        foot:'./static/img/theme1-foot.jpg',
        sm:'./static/img/theme5-sm.jpg',
        eqpos:{
          bottom:'1.33rem',right:'18.4%'
        }
      }
    ],
    changeTheme=function(obj){
      loadingStart()
      // $themeFoot.find('img')[0].style.width="100%";
      // $themeFoot.find('img')[0].src = obj.foot;

      if(!!obj.eqpos){
        $('#eCode').css(obj.eqpos)
      }
      var img = new Image();
      img.onload = function(){
        themeBgImg.src = img.src;
        setTimeout(function(){
          loadingStop();
          initTheme = true;
        },100)

      };
      img.src = obj.bg;

    },
    zd_qrcode = null,
    cropGesture = null,
    defaultbgStatue = false;

window.indexPageReady = function(){

    if(window.isAndroid){
      window.cameraApi = B612Kaji.Native.android.Function.getInstance();
    }else if(window.isIos){
      window.cameraApi = B612Kaji.Native.ios.Function.getInstance();
    }

    var aWidth = $('#cropLayer').offset().width;
    $('#cropLayer').css({
      height:aWidth,
      left:($('#cropSection').width() - aWidth) / 2
    })
    $('#dropArea').css({
      width:aWidth,
      height:aWidth,
      left:($('#cropSection').width() - aWidth) / 2,
      top:$('#cropLayer').offset().top + $cropSection.scrollTop()
    })

    var $canvas = $("#cropCanvas");
    canvasDom = $canvas[0];
    canvasCtx = canvasDom.getContext("2d");
    cropGesture = new EZGesture($dropArea[0], $defaultImgSet[0], {
        targetMinWidth : 460,
        targetMinHeight: 460
    })
    cropGesture.targetMinWidth = canvasDom.width;
    cropGesture.targetMinHeight = canvasDom.height;
    $cropSection.css("visibility", "hidden");
    $cropSection.css("display", "");
    if(defaultbgStatue)loadingStop();


    getCameraImage(function(res){
      loadingStart();
      $cropSection.css("visibility", "hidden");
      $cropSection.css("display", "");
      cropStart();
      setTimeout(function(){
        cropChanged(res)
      },0)

      $('.firstPage_choose').css('display','none');
      $('#audio_control').css('opacity','1')
    })

    document.querySelector('#firstPage .chooseBtn').addEventListener(_touch,function(){
      $('.firstPage_choose').css('display','flex');
      cropStart();
      $('#audio_control').css('opacity','.3')
    },false);

    window.setTimeout(function(){

        // 选择相机/选择相册
        $('.firstPage_choose').unbind(_touch);
        $('.firstPage_choose').on(_touch,function(){
          $('.firstPage_choose').css('display','none');
          $('#audio_control').css('opacity','1')
        })
        $('.firstPage_choose .wpr').unbind(_touch);
        $('.firstPage_choose .wpr').on(_touch,function(e){
          e.stopPropagation();
        })

        // 统一弹出框
        $('.nextGuide .confirm').unbind(_touch);
        $('.nextGuide .confirm').on(_touch,function(ev){
          $('.nextGuide').css('display','none');
          ev.stopPropagation();
        })

        // 打开相机
        document.querySelector('.openCamera').addEventListener(_touch,function(){
          openCameraBefore()
        },false)

        // 打开相册
        document.querySelector('.openGallery').addEventListener(_touch,function(){
          openGalleryBefore()
        },false)

        // 检测断网
        window.addEventListener("offline", function(e){
          $('.nextGuide .p1').empty().html('请检查网络链接')
          $('.nextGuide').css('display','flex');
        })


    },20)

}

// 首屏弹层时 加载其余
function cropStart(res){

  // 不管是否选择文件 都开始加载主题1
  if(!initTheme){changeTheme(themes[0])};

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
          _hmt.push(['_trackEvent', 'themesm'+themeStlye, 'click','模板' + +themeStlye + '的PV']);
      })
  })

  cropStartStatus = true;
}

if(lowVersion){
// 二维码引导
  $('#qrGuide .btn').unbind(_touch);
  $('#qrGuide .btn').on(_touch,function(){
    loadingStart();
    _hmt.push(['_trackEvent', 'upQrBtn', 'click', '上传二维码点击量'])
    openCamera(function(res){
      if(res.length == 0){
        loadingStop()
        return false;
      };
      setTimeout(function(){
        // qrcode.decode(res);
        var img = new Image();
        img.onload = function(){
          $('#testImg')[0].src = this.src;
          $('#testImg').attr({width:this.width,height:this.height})
          // $('#testImg').attr(height,this.height)
          // $('#eCode')[0].src = this.src;
          // $('#proSection img')[1].src="./static/img/theme1-foot.jpg";
          setTimeout(function(){
            $('#toNext').trigger('click');
          },0)
        }
        img.src=res;
      },0)
    },{type:'imageAlbum'})
  });

  _hmt.push(['_trackEvent', 'lowdevice', 'visited','低端机统计量']);
}

function openCameraBefore(){
  loadingStart();
  openCamera(function(res){
    if(res.length == 0){
      loadingStop();
      return false;
    };
    $('.firstPage_choose').css('display','none');
    $('#audio_control').css('opacity','1')
    cropChanged(res)
    _hmt.push(['_trackEvent', 'camera', 'click','使用咔叽拍照']);
  },{type:"imageCamera"})
}

function openGalleryBefore(){
  loadingStart();
  openCamera(function(res,type){
    if(res.length == 0){
      loadingStop();
      return false;
    };

    $('.firstPage_choose').css('display','none');
    $('#audio_control').css('opacity','1')

    cropChanged(res)
    _hmt.push(['_trackEvent', 'gallery', 'click','从相册选取']);
  },{type:"imageAlbum"})
}

// 转换为可用 img base64
function cropChanged(res){
    if(!initTheme){changeTheme(themes[0]);}
    // $cropSection.css('visibility','visible');
    $('#proSection').css('display','none')
    $('#firstPage').css('display','none')
    loadingStart()
    var img = new Image();
    img.src = res;
    img.onload = function(){
      cropLoaded(this);
      timer = null;
      canvasDom.setAttribute('width',750)
      canvasDom.setAttribute('height',1027)
      $('#megaPixImage').css({'width':this.width,'height':this.height})
    }
}

// 安装给页面的 img 的src
function cropLoaded(img){
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
      $cropSection.css("display", "");
      $cropSection.css("visibility", "visible");
      var timer = setInterval(function(){
        if(initTheme){
          clearInterval(timer);
          loadingStop();
        }
      },10)
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
      _hmt.push(['_trackEvent', 'smQrEnter', 'click', '上传二维码按钮的点击'])
      if(!upqrStatue && !lowVersion){
        upqr()
      }
    })
    $('#qrGuide .return').unbind(_touch);
    $('#qrGuide .return').on(_touch,function(){
      $('#qrGuide').css('display','none');
    })

    if($('#qrGuide img')[0].getAttribute('src').length == 0){
      if(!lowVersion){
        setTimeout(function(){
          loadScript('./static/js/qrcode.js');
          loadScript('./static/js/llqrcode.js');
        },0)
      }

      $('#qrGuide img').each(function(index,el){
        el.src= './static/img/' + qrImgs[index]
      })
    }
}

function toReChoose(){
  $('.firstPage_choose').css('display','flex');
  $('#audio_control').css('opacity','.3')
}

function cropStop(){
    console.log('cropStop');
}

function cropConfirm(evt) {
  loadingStart()
  $('#proSection .view').height($('#theme_bg').height())
   var $cropImg = $defaultImgSet;
   var canvasScale =  canvasDom.height / $('#cropLayer .wpr').height();
   var megaPixImageScale = $('#megaPixImage').width() / $cropImg.width();

   var imgOrigin = {
       x: parseInt($cropImg.css('left')) || 0,
       y: parseInt($cropImg.css('top')) || 0
   };
   var imgSize = {
       width: $cropImg.width(),
       height: $cropImg.height()
   };
   // 画主题图片
   var sa = canvasDom.width/$themeBgImg.width(),
        as = $themeBgImg.width()/canvasDom.width;
   canvasCtx.scale(sa,sa);
   $('#proSection .vwpr')[0].style.transform = 'scale(' + as + ')';
   $('#proSection .vwpr')[0].style.webkitTransform = 'scale(' + as + ')';
   canvasCtx.drawImage($themeBgImg[0],0,0,750,1027,0,0,$themeBgImg.width(),$themeBgImg.height())
   // 画用户头像
   canvasCtx.drawImage($cropImg[0], Math.abs(imgOrigin.x)*megaPixImageScale, Math.abs(imgOrigin.y)*megaPixImageScale, $dropArea.width()*megaPixImageScale, $dropArea.height()*megaPixImageScale, $dropArea.offset().left,$dropArea.offset().top+ $cropSection.scrollTop(),$dropArea.width(),$dropArea.height());
   // 画用户头像框
   // canvasCtx.drawImage($themeHead[0], 0, 0, parseInt($themeHead.attr('data-width')), parseInt($themeHead.attr('data-height')), $themeHead.offset().left,$themeHead.offset().top + $cropSection.scrollTop(),$themeHead.width(),$themeHead.height());
   // 画用户二维码
   // 23.67  18.75
   if(lowVersion){
     var ecodeS = window.isAndroid?0.1875:0.2335;
     var ecode = {
       'left':$('#testImg').attr('width')*0.2367,
       'top': $('#testImg').attr('height')*ecodeS,
       'width': $('#testImg').attr('width')*.5266
     };
     canvasCtx.drawImage($('#testImg')[0], ecode.left, ecode.top, ecode.width, ecode.width, $('#eCode').offset().left,$('#eCode').offset().top + $cropSection.scrollTop(),$('#eCode').width(),$('#eCode').height());
   }else{
     canvasCtx.fillStyle="#fff";
     canvasCtx.fillRect($('#eCode').offset().left-2,$('#eCode').offset().top + $cropSection.scrollTop() - 2,$('#eCode').width()+1,$('#eCode').height()+1);
     canvasCtx.drawImage($("#eCode")[0],0,0,424,424,$("#eCode").offset().left,$("#eCode").offset().top+$cropSection.scrollTop(),$("#eCode").width(),$("#eCode").height())
   }
   setTimeout(function(){
       proSave()
   },160)

    return preventEventPropagation(evt);
}

function proSave(){

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
        // $('.toast').addClass('run');
        $('.toast').show().addClass('run');
        setTimeout(function(){
          $('.toast').removeClass('run').hiden()
        },2100)
    }
    img.src = dataURL;

    setTimeout(function(){
      var themeCount = $('#theme_foot span').find('.item.active').index() +1;
      $('#proSection .save').on(_touch,function(){
        saveImage(function(res){
          $('.nextGuide .p1').empty().html('保存好了~<br/>分享给亲朋好友领红包吧')
          $('.nextGuide').css('display','flex');
          _hmt.push(['_trackEvent', 'saveImageWithTheme'+themeCount, 'save', '模板'+ themeCount + '的保存量']);
          $('.nextGuide .confirm').on(_touch,function(){
            $('#proSection .share').trigger('click')
          })
        },img.src)
      })

      $('#proSection .share').on(_touch,function(){
        shareImageWithCallback(
          function(res){
            _hmt.push(['_trackEvent', 'shareImageWithTheme'+themeCount, 'save', '模板'+ themeCount + '的分享量']);
          },
          function(res){
            _hmt.push(['_trackEvent', 'shareImageWithTheme'+themeCount, 'save', '模板'+ themeCount + '的分享量']);
          },
          img.src
        )
      })
    },0)


}

var upqr = function(){
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
  	width : 400,
  	height : 400
  });
  zd_qrcode.makeCode('');
  // 二维码引导
  $('#qrGuide .btn').unbind(_touch);
  $('#qrGuide .btn').on(_touch,function(){
    loadingStart();
    _hmt.push(['_trackEvent', 'upQrBtn', 'click', '上传二维码点击量'])
    openCamera(function(res){
      if(res.length == 0){
        loadingStop()
        return false;
      };
      setTimeout(function(){
        var img = new Image();
        img.onload = function(){
          qrcode.decode(res);
        }
        img.src=res;
      },0)
    },{type:'imageAlbum'})
  });

  function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function read(a){
    loadingStop();
    $('#handleQR')[0].value = '';
    if(!!(a.indexOf('wxp:') > -1)){
      zd_qrcode.makeCode(htmlEntities(a))
      $('#eCode')[0].src = $('#zd_qrcode img')[0].src;
      $('#qrGuide').css('display','none');
      // $('#proSection img')[1].src="./static/img/theme1-foot.jpg";
      loadingStart();
      setTimeout(function(){
        _hmt.push(['_trackEvent', 'qrcodeUpSuc', 'click','二维码上传成功量']);
        $('#toNext').trigger('click');
      },0)
    }else if(a.indexOf('Failed') > -1){
      // $('.nextGuide .p1').empty().html('服务端')
      // $('.nextGuide').css('display','flex');
      console.log('error 请联系技术人员')
      _hmt.push(['_trackEvent', 'qrcodeUpFail', 'click','不支持的机型 异常']);
    }else{
      setTimeout(function(){
        $('.nextGuide .p1').empty().html('未识别到收款二维码<br/>收不到红包哦<br/>')
        $('.nextGuide').css('display','flex');
      },0)
    }

  }


  function load(){
    if(window.File && window.FileReader){
      initCanvas(200, 150);
      qrcode.callback = read;
     }
  }
  load();

  upqrStatue = true;
}
