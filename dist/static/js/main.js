function loadingStart(){$(".loadingDiv").css("display","block")}function loadingStop(){$(".loadingDiv").css("display","none")}var _touch=window.supportTouch?"touchend":"click";function openCamera(e,t,o,i){return window.isAndroid?window.cameraApi.eventCamera(function(t){e(t)},t):window.isIos?window.cameraApi.eventCamera(function(t,o){t.success?(t=t.base64Image,e(t)):loadingStop()},t.type,o,i):void alert("error")}function saveImage(e,t){return window.cameraApi.saveImage(function(t){e(t)},t)}function shareImageWithCallback(e,t,o){return window.isAndroid?window.cameraApi.shareImageWithCallback(function(t){e(t)},function(e){t(e)},o):window.isIos?window.cameraApi.shareImage(o):void 0}function getCameraImage(e){return window.cameraApi.getCameraImage(function(t){var o=window.isAndroid?t:t.base64Image;e(o)})}window.indexPageReady=function(){window.setTimeout(function(){cropGesture=new EZGesture($dropArea[0],$defaultImgSet[0],{targetMinWidth:750,targetMinHeight:750});var e=$("#cropCanvas");canvasDom=e[0],canvasCtx=canvasDom.getContext("2d"),cropGesture.targetMinWidth=canvasDom.width,cropGesture.targetMinHeight=canvasDom.height,$cropSection.css("visibility","hidden"),$cropSection.css("display",""),defaultbgStatue&&loadingStop(),window.isAndroid?window.cameraApi=B612Kaji.Native.android.Function.getInstance():window.isIos&&(window.cameraApi=B612Kaji.Native.ios.Function.getInstance()),setTimeout(function(){getCameraImage(function(e){if(loadingStart(),cropStart(),0==e.length)return loadingStop(),!1;$(".firstPage_choose").unbind(_touch),$(".firstPage_choose").on(_touch,function(){$(".firstPage_choose").css("display","none")}),$(".firstPage_choose .wpr").unbind(_touch),$(".firstPage_choose .wpr").on(_touch,function(e){e.stopPropagation()}),$(".firstPage_choose").css("display","none"),cropChanged(e)})},0),document.querySelector("#firstPage .chooseBtn").addEventListener(_touch,function(){$(".firstPage_choose").css("display","flex"),$(".firstPage_choose").unbind(_touch),$(".firstPage_choose").on(_touch,function(){$(".firstPage_choose").css("display","none")}),$(".firstPage_choose .wpr").unbind(_touch),$(".firstPage_choose .wpr").on(_touch,function(e){e.stopPropagation()}),cropStart()},!1),window.addEventListener("offline",function(e){$(".offlineTip").css("display","flex")}),$(".offlineTip span").on("click",function(){$(".offlineTip").css("display","none")}),document.querySelector(".openCamera").addEventListener(_touch,function(){openCameraBefore()},!1),document.querySelector(".openGallery").addEventListener(_touch,function(){openGalleryBefore()},!1)},20)};var canvasDom,canvasCtx,$upload=$("#upload"),$cropSection=$("#cropSection"),$defaultImgSet=$("#cropImg"),upqrStatue=!1,cropStartStatus=!1,initTheme=!1,$dropArea=$("#dropArea"),$reChoose=$("#reChoose,#reChooseb"),$toNext=$("#toNext"),$themeBgImg=$("#themeBgImg"),$themeFoot=$("#theme_foot"),$themeSelectWpr=$(".styleChoose .wpr span"),qrImgs=["qr_guide_t.png","qr_guide1.png","qr_guide2.png","qr_guide3.png","qr_guide4.png"],cropGesture=null,themeStlye=1,themes=[{bg:"./static/img/theme1-bg.jpg?v=123a",foot:"./static/img/theme1-foot.jpg",sm:"./static/img/theme1-sm.jpg",eqpos:{bottom:"1.09rem",right:"41.866%"}},{bg:"./static/img/theme2-bg.jpg",foot:"./static/img/theme1-foot.jpg",sm:"./static/img/theme2-sm.jpg",eqpos:{bottom:"1.03rem",right:"17.06%"}},{bg:"./static/img/theme3-bg.jpg",foot:"./static/img/theme1-foot.jpg",sm:"./static/img/theme3-sm.jpg",eqpos:{bottom:".94rem",right:"15.06%"}},{bg:"./static/img/theme4-bg.jpg",foot:"./static/img/theme1-foot.jpg",sm:"./static/img/theme4-sm.jpg",eqpos:{bottom:"1.19rem",right:"41.866%"}},{bg:"./static/img/theme5-bg.jpg",foot:"./static/img/theme1-foot.jpg",sm:"./static/img/theme5-sm.jpg",eqpos:{bottom:"1.33rem",right:"18.4%"}}],changeTheme=function(e){loadingStart(),$themeFoot.find("img")[0].style.width="100%",$themeFoot.find("img")[0].src=e.foot,$("#cropLayer").css({height:$("#cropLayer").offset().width,left:($("#cropSection").width()-$("#cropLayer").width())/2}),e.eqpos&&$("#eCode").css(e.eqpos),$("#dropArea").css({width:$("#cropLayer").width(),height:$("#cropLayer").height(),left:$("#cropLayer").offset().left,top:$("#cropLayer").offset().top+$cropSection.scrollTop()});var t=new Image;t.onload=function(){themeBgImg.src=t.src,setTimeout(function(){loadingStop(),initTheme=!0},260)},t.src=e.bg},zd_qrcode=null;function cropStart(e){initTheme||(changeTheme(themes[0]),loadingStop()),$themeSelectWpr.eq(0).empty(),themes.forEach(function(e,t,o){var i=document.createElement("div"),n=document.createElement("img");n.setAttribute("src",e.sm),n.style.width="100%",i.classList.add("item"),i.appendChild(n),$themeSelectWpr[0].appendChild(i)}),$("#theme_foot span").find(".item").eq(0).addClass("active"),$("#theme_foot span").find(".item").each(function(e,t){$(t).unbind(_touch)}),$("#theme_foot span").find(".item").each(function(e,t){$(t).on(_touch,function(){$("#theme_foot span").find(".item").removeClass("active");var t=$(this).index();if($(this).addClass("active"),t+1==themeStlye)return loadingStop(),!1;themeStlye=t+1,changeTheme(themes[e])})}),cropStartStatus=!0}function openCameraBefore(){loadingStart(),openCamera(function(e){if(0==e.length)return loadingStop(),!1;$(".firstPage_choose").css("display","none"),cropChanged(e)},{type:"imageCamera"})}function openGalleryBefore(){loadingStart(),openCamera(function(e,t){if(0==e.length)return loadingStop(),!1;$(".firstPage_choose").css("display","none"),cropChanged(e)},{type:"imageAlbum"})}function cropChanged(e){initTheme||changeTheme(themes[0]),$cropSection.css("visibility","visible"),$("#proSection").css("display","none");var t=new Image;t.onload=function(){cropLoaded(this),canvasDom.setAttribute("width",750),canvasDom.setAttribute("height",1027),$("#megaPixImage").css({width:this.width,height:this.height})},t.src=e}function cropLoaded(e){$cropSection.css("display","");var t=e.width,o=e.height,i=$dropArea.width()/t,n=$dropArea.height()/o,a=i>n?i:n;cropGesture.targetMinWidth=t*a,cropGesture.targetMinHeight=o*a;var r=.5*($dropArea.width()-cropGesture.targetMinWidth),c=.5*($dropArea.height()-cropGesture.targetMinHeight);$defaultImgSet.css("display",""),$defaultImgSet.width(cropGesture.targetMinWidth),$defaultImgSet.height(cropGesture.targetMinHeight),$defaultImgSet.css("left",[r,"px"].join("")),$defaultImgSet.css("top",[c,"px"].join("")),$defaultImgSet[0].src=e.src,$defaultImgSet[0].onload=function(){loadingStop()},initTheme&&loadingStop(),cropGesture.unbindEvents(),cropGesture.bindEvents(),$reChoose.unbind(_touch),$reChoose.on(_touch,toReChoose),$toNext.unbind(_touch),$toNext.on(_touch,cropConfirm),$("#eCode").unbind(_touch),$("#eCode").on(_touch,function(){$("#qrGuide").css("display",""),upqrStatue||upqr()}),$("#qrGuide .return").unbind(_touch),$("#qrGuide .return").on(_touch,function(){$("#qrGuide").css("display","none")}),upqrStatue||(setTimeout(function(){loadScript("./static/js/qrcode.js"),loadScript("./static/js/llqrcode.js")},0),$("#qrGuide img").each(function(e,t){t.src="./static/img/"+qrImgs[e]}))}function toReChoose(){$(".firstPage_choose").css("display","flex")}function cropStop(){console.log("cropStop")}function cropConfirm(e){loadingStart(),$("#proSection .view").height($("#theme_bg").height());var t=$defaultImgSet,o=(canvasDom.height,$("#cropLayer .wpr").height(),$("#megaPixImage").width()/t.width()),i={x:parseInt(t.css("left"))||0,y:parseInt(t.css("top"))||0},n=(t.width(),t.height(),canvasDom.width/$themeBgImg.width()),a=$themeBgImg.width()/canvasDom.width;return canvasCtx.scale(n,n),$("#proSection .vwpr")[0].style.transform="scale("+a+")",$("#proSection .vwpr")[0].style.webkitTransform="scale("+a+")",canvasCtx.drawImage($themeBgImg[0],0,0,750,1027,0,0,$themeBgImg.width(),$themeBgImg.height()),canvasCtx.drawImage(t[0],Math.abs(i.x)*o,Math.abs(i.y)*o,$dropArea.width()*o,$dropArea.height()*o,$dropArea.offset().left,$dropArea.offset().top+$cropSection.scrollTop(),$dropArea.width(),$dropArea.height()),canvasCtx.fillStyle="#fff",canvasCtx.fillRect($("#eCode").offset().left-2,$("#eCode").offset().top+$cropSection.scrollTop()-2,$("#eCode").width()+1,$("#eCode").height()+1),canvasCtx.drawImage($("#eCode")[0],0,0,424,424,$("#eCode").offset().left,$("#eCode").offset().top+$cropSection.scrollTop(),$("#eCode").width(),$("#eCode").height()),setTimeout(function(){proSave()},160),preventEventPropagation(e)}function proSave(){$(".nextGuide").css("display","flex"),$(".nextGuide .confirm").unbind(_touch),$(".nextGuide .confirm").on(_touch,function(){$(".nextGuide").css("display","none")});var e="";window.isAndroid?e=(new JPEGEncoder).encode(canvasCtx.getImageData(0,0,canvasDom.width,canvasDom.height),200,!0):e=canvasDom.toDataURL("image/jpeg",1);var t=new Image;t.onload=function(){$("#proSection img")[0].src=t.src,$("#proSection").css("display","block"),loadingStop()},t.src=e,$("#proSection .save").on(_touch,function(){saveImage(function(e){alert("拜年红包图已存好，分享就收钱")},t.src)}),$("#proSection .share").on(_touch,function(){shareImageWithCallback(function(e){},function(e){},t.src)})}function upqr(){var e,t,o;function i(e){loadingStop(),e.indexOf("wxp:")>-1?(zd_qrcode.makeCode(String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")),$("#eCode")[0].src=$("#zd_qrcode img")[0].src,$("#qrGuide").css("display","none"),$("#proSection img")[1].src="./static/img/theme1-foot.jpg",loadingStart(),setTimeout(function(){$("#toNext").trigger("click")},0)):e.indexOf("Failed")>-1?alert("抱歉您的手机不支持此功能"):setTimeout(function(){alert("未识别到收款二维码，收不到红包哦")},0),$("#handleQR")[0].value=""}(zd_qrcode=new QRCode(document.getElementById("zd_qrcode"),{width:400,height:400})).makeCode(""),$("#qrGuide .btn").unbind(_touch),$("#qrGuide .btn").on(_touch,function(){loadingStart(),openCamera(function(e){if(0==e.length)return loadingStop(),!1;setTimeout(function(){qrcode.decode(e)},0)},{type:"imageAlbum"})}),window.File&&window.FileReader&&(t=200,o=150,(e=document.getElementById("qr-canvas")).style.width=t+"px",e.style.height=o+"px",e.width=t,e.height=o,gCtx=e.getContext("2d"),gCtx.clearRect(0,0,t,o),qrcode.callback=i),upqrStatue=!0}