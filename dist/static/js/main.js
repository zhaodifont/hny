function loadingStart(){$(".loadingDiv").css("display","block")}function loadingStop(){$(".loadingDiv").css("display","none")}var canvasDom,canvasCtx,lowSysVersion=function(){if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){var e=[10,1,1],t=navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);t.shift();for(var o=0;o<e.length;o++){if((a=parseInt(t[o],10)||0)<=(r=parseInt(e[o],10)||0))return!0;if(a>r)return!1}return!1}if(/(Android)/i.test(navigator.userAgent)){var i=[4,5,0],n=navigator.userAgent.match(/Android (\d+)\.(\d+)\.?(\d+)?/);n.shift();for(o=0;o<i.length;o++){var a,r;if((a=parseInt(n[o],10)||0)<=(r=parseInt(i[o],10)||0))return!0;if(a>r)return!1}return!1}},lowVersion=lowSysVersion(),_touch=window.supportTouch?"touchend":"click",openCamera=function(e,t,o,i){return window.isAndroid?window.cameraApi.eventCamera(function(t){e(t)},t):window.isIos?window.cameraApi.eventCamera(function(t,o){t.success?(t=t.base64Image,e(t)):loadingStop()},t.type,o,i):void console.log("error")},saveImage=function(e,t){return window.cameraApi.saveImage(function(t){e(t)},t)},shareImageWithCallback=function(e,t,o){return window.isAndroid?window.cameraApi.shareImageWithCallback(function(t){e(t)},function(e){t(e)},o):window.isIos?window.cameraApi.shareImage(o):void 0},getCameraImage=function(e){return document.title=1111,window.cameraApi.getCameraImage(function(t){$("#testTxt").show().text(window.getCameraS+"___ --00"),window.isAndroid&&t?(alert(22222),e(t)):window.isIos&&t.base64Image&&(window.getCameraS=!0,e(t.base64Image))})},$upload=$("#upload"),$cropSection=$("#cropSection"),$defaultImgSet=$("#cropImg"),upqrStatue=!1,cropStartStatus=!1,initTheme=!1,$dropArea=$("#dropArea"),$reChoose=$("#reChoose,#reChooseb"),$toNext=$("#toNext"),$themeBgImg=$("#themeBgImg"),$themeFoot=$("#theme_foot"),$themeSelectWpr=$(".styleChoose .wpr span"),qrImgs=["qr_guide_t.png","qr_guide1.png","qr_guide2.png","qr_guide3.png","qr_guide4.png"],themeStlye=1,themes=[{bg:"./static/img/theme1-bg.jpg?v=123a",foot:"./static/img/theme1-foot.jpg",sm:"./static/img/theme1-sm.jpg",eqpos:{bottom:"1.09rem",right:"41.866%"}},{bg:"./static/img/theme2-bg.jpg",foot:"./static/img/theme1-foot.jpg",sm:"./static/img/theme2-sm.jpg",eqpos:{bottom:"1.03rem",right:"17.06%"}},{bg:"./static/img/theme3-bg.jpg",foot:"./static/img/theme1-foot.jpg",sm:"./static/img/theme3-sm.jpg",eqpos:{bottom:".94rem",right:"15.06%"}},{bg:"./static/img/theme4-bg.jpg",foot:"./static/img/theme1-foot.jpg",sm:"./static/img/theme4-sm.jpg",eqpos:{bottom:"1.19rem",right:"41.866%"}},{bg:"./static/img/theme5-bg.jpg",foot:"./static/img/theme1-foot.jpg",sm:"./static/img/theme5-sm.jpg",eqpos:{bottom:"1.33rem",right:"18.4%"}}],changeTheme=function(e){loadingStart(),$themeFoot.find("img")[0].style.width="100%",$themeFoot.find("img")[0].src=e.foot,$("#cropLayer").css({height:$("#cropLayer").offset().width,left:($("#cropSection").width()-$("#cropLayer").width())/2}),e.eqpos&&$("#eCode").css(e.eqpos),$("#dropArea").css({width:$("#cropLayer").width(),height:$("#cropLayer").height(),left:$("#cropLayer").offset().left,top:$("#cropLayer").offset().top+$cropSection.scrollTop()});var t=new Image;t.onload=function(){themeBgImg.src=t.src,setTimeout(function(){loadingStop(),initTheme=!0},260)},t.src=e.bg},zd_qrcode=null,cropGesture=null,defaultbgStatue=!1;function cropStart(e){initTheme||changeTheme(themes[0]),$themeSelectWpr.eq(0).empty(),themes.forEach(function(e,t,o){var i=document.createElement("div"),n=document.createElement("img");n.setAttribute("src",e.sm),n.style.width="100%",i.classList.add("item"),i.appendChild(n),$themeSelectWpr[0].appendChild(i)}),$("#theme_foot span").find(".item").eq(0).addClass("active"),$("#theme_foot span").find(".item").each(function(e,t){$(t).unbind(_touch)}),$("#theme_foot span").find(".item").each(function(e,t){$(t).on(_touch,function(){$("#theme_foot span").find(".item").removeClass("active");var t=$(this).index();if($(this).addClass("active"),t+1==themeStlye)return loadingStop(),!1;themeStlye=t+1,changeTheme(themes[e])})}),$("#testTxt").show().text(window.getCameraS+"___ 1"),cropStartStatus=!0}function openCameraBefore(){loadingStart(),openCamera(function(e){if(0==e.length)return loadingStop(),!1;$(".firstPage_choose").css("display","none"),cropChanged(e)},{type:"imageCamera"})}function openGalleryBefore(){loadingStart(),openCamera(function(e,t){if(0==e.length)return loadingStop(),!1;$(".firstPage_choose").css("display","none"),cropChanged(e)},{type:"imageAlbum"})}function cropChanged(e){initTheme||changeTheme(themes[0]),$("#proSection").css("display","none"),$("#firstPage").css("display","none"),loadingStart(),$("#testTxt").show().text(window.getCameraS+"___ 2.1"+e.length);var t=new Image;t.src=e,t.onload=function(){cropLoaded(this),canvasDom.setAttribute("width",750),canvasDom.setAttribute("height",1027),$("#megaPixImage").css({width:this.width,height:this.height}),$("#testTxt").show().text(window.getCameraS+"___ 2")}}function cropLoaded(e){$("#testTxt").show().text(window.getCameraS+"___ 3.1");var t=e.width,o=e.height,i=$dropArea.width()/t,n=$dropArea.height()/o,a=i>n?i:n;cropGesture.targetMinWidth=t*a,cropGesture.targetMinHeight=o*a;var r=.5*($dropArea.width()-cropGesture.targetMinWidth),s=.5*($dropArea.height()-cropGesture.targetMinHeight);$defaultImgSet.css("display",""),$defaultImgSet.width(cropGesture.targetMinWidth),$defaultImgSet.height(cropGesture.targetMinHeight),$defaultImgSet.css("left",[r,"px"].join("")),$defaultImgSet.css("top",[s,"px"].join("")),$("#testTxt").show().text(window.getCameraS+"___ 3.11"),$defaultImgSet[0].src=e.src,$defaultImgSet[0].onload=function(){$cropSection.css("display",""),$cropSection.css("visibility","visible");var e=setInterval(function(){initTheme&&(clearInterval(e),loadingStop())},10);$("#testTxt").show().text(window.getCameraS+"___ 3.2")},initTheme&&loadingStop(),cropGesture.unbindEvents(),cropGesture.bindEvents(),$reChoose.unbind(_touch),$reChoose.on(_touch,toReChoose),$toNext.unbind(_touch),$toNext.on(_touch,cropConfirm),$("#eCode").unbind(_touch),$("#eCode").on(_touch,function(){$("#qrGuide").css("display",""),upqrStatue||lowVersion||upqr()}),$("#qrGuide .return").unbind(_touch),$("#qrGuide .return").on(_touch,function(){$("#qrGuide").css("display","none")}),0==$("#qrGuide img")[0].getAttribute("src").length&&(lowVersion||setTimeout(function(){loadScript("./static/js/qrcode.js"),loadScript("./static/js/llqrcode.js")},0),$("#qrGuide img").each(function(e,t){t.src="./static/img/"+qrImgs[e]}))}function toReChoose(){$(".firstPage_choose").css("display","flex")}function cropStop(){console.log("cropStop")}function cropConfirm(e){loadingStart(),$("#proSection .view").height($("#theme_bg").height());var t=$defaultImgSet,o=(canvasDom.height,$("#cropLayer .wpr").height(),$("#megaPixImage").width()/t.width()),i={x:parseInt(t.css("left"))||0,y:parseInt(t.css("top"))||0},n=(t.width(),t.height(),canvasDom.width/$themeBgImg.width()),a=$themeBgImg.width()/canvasDom.width;if(canvasCtx.scale(n,n),$("#proSection .vwpr")[0].style.transform="scale("+a+")",$("#proSection .vwpr")[0].style.webkitTransform="scale("+a+")",canvasCtx.drawImage($themeBgImg[0],0,0,750,1027,0,0,$themeBgImg.width(),$themeBgImg.height()),canvasCtx.drawImage(t[0],Math.abs(i.x)*o,Math.abs(i.y)*o,$dropArea.width()*o,$dropArea.height()*o,$dropArea.offset().left,$dropArea.offset().top+$cropSection.scrollTop(),$dropArea.width(),$dropArea.height()),lowVersion){var r=window.isAndroid?.1875:.2335,s={left:.2367*$("#testImg").attr("width"),top:$("#testImg").attr("height")*r,width:.5266*$("#testImg").attr("width")};canvasCtx.drawImage($("#testImg")[0],s.left,s.top,s.width,s.width,$("#eCode").offset().left,$("#eCode").offset().top+$cropSection.scrollTop(),$("#eCode").width(),$("#eCode").height())}else canvasCtx.fillStyle="#fff",canvasCtx.fillRect($("#eCode").offset().left-2,$("#eCode").offset().top+$cropSection.scrollTop()-2,$("#eCode").width()+1,$("#eCode").height()+1),canvasCtx.drawImage($("#eCode")[0],0,0,424,424,$("#eCode").offset().left,$("#eCode").offset().top+$cropSection.scrollTop(),$("#eCode").width(),$("#eCode").height());return setTimeout(function(){proSave()},160),preventEventPropagation(e)}function proSave(){var e="";window.isAndroid?e=(new JPEGEncoder).encode(canvasCtx.getImageData(0,0,canvasDom.width,canvasDom.height),200,!0):e=canvasDom.toDataURL("image/jpeg",1);var t=new Image;t.onload=function(){$("#proSection img")[0].src=t.src,$("#proSection").css("display","block"),loadingStop(),$(".toast").addClass("run"),setTimeout(function(){$(".toast").removeClass("run").hiden()},2100)},t.src=e,setTimeout(function(){$("#proSection .save").on(_touch,function(){saveImage(function(e){$(".nextGuide .p1").empty().html("保存好了~<br/>分享给亲朋好友领红包吧"),$(".nextGuide").css("display","flex"),$(".nextGuide .confirm").on(_touch,function(){$("#proSection .share").trigger("click")})},t.src)}),$("#proSection .share").on(_touch,function(){shareImageWithCallback(function(e){},function(e){},t.src)})},0)}window.indexPageReady=function(){window.isAndroid?window.cameraApi=B612Kaji.Native.android.Function.getInstance():window.isIos&&(window.cameraApi=B612Kaji.Native.ios.Function.getInstance()),cropGesture=new EZGesture($dropArea[0],$defaultImgSet[0],{targetMinWidth:750,targetMinHeight:750});var e=$("#cropCanvas");canvasDom=e[0],canvasCtx=canvasDom.getContext("2d"),cropGesture.targetMinWidth=canvasDom.width,cropGesture.targetMinHeight=canvasDom.height,$cropSection.css("visibility","hidden"),$cropSection.css("display",""),defaultbgStatue&&loadingStop(),B612Kaji.Native.android.Function.getInstance().getCameraImage(function(e){document.title="22334",$("#testTxt").show().text(e)}),document.querySelector("#firstPage .chooseBtn").addEventListener(_touch,function(){$(".firstPage_choose").css("display","flex"),cropStart()},!1),window.setTimeout(function(){!getCameraS&&loadScript("./static/js/count.js",function(){var e=Date.now()-new Date("2018/01/25").getTime(),t=0,o=(Math.floor(e/864e5),Math.floor(e/864e5)),i=Math.floor(e/36e5)-24*o,n=Math.floor(e/6e4)-24*o*60-60*i,a=Math.floor(e/1e3)-24*o*3600-3600*i-60*n;t=o<2?parseInt(24*o*3600*80+3600*i*80+60*n*80+80*a):o>=2&&o<4?parseInt(18144e3+3600*i*50+60*n*50+50*a):o>=4&&o<6?parseInt(22464e3+3600*i*30+60*n*30+30*a):o>=6&&o<8?parseInt(27648e3+3600*i*20+60*n*20+20*a):parseInt(31104e3+3600*i*5+60*n*5+5*a),document.querySelectorAll(".loadingDiv")[0].style.display="";var r=new Image;r.onload=function(){r.setAttribute("width","100%"),document.querySelectorAll(".guide")[0].appendChild(r),defaultbgStatue=!0},r.src="./static/img/firstPic.jpg";var s=t,c=parseInt(32*s),d=new CountUp("targetNum",0,c,0,1.5),g=new CountUp("joinNum",0,s,0,1),h=document.querySelector("#firstPage .t1"),m=document.querySelector("#firstPage .t2"),u=setInterval(function(){if(defaultbgStatue){if(clearInterval(u),u=null,loadingStop&&loadingStop(),!document.querySelector("#app").classList.contains("full")){var e=new Image;e.onload=function(){document.querySelector("#aside").src=this.src,document.querySelector("#aside").style.opacity=1},e.src="./static/img/aside.jpg"}h.classList.add("bounceInDown"),m.classList.add("fadeIn"),g.start(),d.start(function(){g=d=null})}},0)}),$(".firstPage_choose").unbind(_touch),$(".firstPage_choose").on(_touch,function(){$(".firstPage_choose").css("display","none")}),$(".firstPage_choose .wpr").unbind(_touch),$(".firstPage_choose .wpr").on(_touch,function(e){e.stopPropagation()}),$(".nextGuide .confirm").unbind(_touch),$(".nextGuide .confirm").on(_touch,function(e){$(".nextGuide").css("display","none"),e.stopPropagation()}),document.querySelector(".openCamera").addEventListener(_touch,function(){openCameraBefore()},!1),document.querySelector(".openGallery").addEventListener(_touch,function(){openGalleryBefore()},!1),window.addEventListener("offline",function(e){$(".nextGuide .p1").empty().html("请检查网络链接"),$(".nextGuide").css("display","flex")})},20)},lowVersion&&($("#qrGuide .btn").unbind(_touch),$("#qrGuide .btn").on(_touch,function(){loadingStart(),openCamera(function(e){if(0==e.length)return loadingStop(),!1;setTimeout(function(){var t=new Image;t.onload=function(){$("#testImg")[0].src=this.src,$("#testImg").attr({width:this.width,height:this.height}),$("#proSection img")[1].src="./static/img/theme1-foot.jpg",setTimeout(function(){$("#toNext").trigger("click")},0)},t.src=e},0)},{type:"imageAlbum"})}));var upqr=function(){var e,t,o;function i(e){loadingStop(),e.indexOf("wxp:")>-1?(zd_qrcode.makeCode(String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")),$("#eCode")[0].src=$("#zd_qrcode img")[0].src,$("#qrGuide").css("display","none"),$("#proSection img")[1].src="./static/img/theme1-foot.jpg",loadingStart(),setTimeout(function(){$("#toNext").trigger("click")},0)):e.indexOf("Failed")>-1?console.log("error 请联系技术人员"):setTimeout(function(){$(".nextGuide .p1").empty().html("未识别到收款二维码<br/>收不到红包哦<br/>"),$(".nextGuide").css("display","flex")},0),$("#handleQR")[0].value=""}(zd_qrcode=new QRCode(document.getElementById("zd_qrcode"),{width:400,height:400})).makeCode(""),$("#qrGuide .btn").unbind(_touch),$("#qrGuide .btn").on(_touch,function(){loadingStart(),openCamera(function(e){if(0==e.length)return loadingStop(),!1;setTimeout(function(){var t=new Image;t.onload=function(){qrcode.decode(e)},t.src=e},0)},{type:"imageAlbum"})}),window.File&&window.FileReader&&(t=200,o=150,(e=document.getElementById("qr-canvas")).style.width=t+"px",e.style.height=o+"px",e.width=t,e.height=o,gCtx=e.getContext("2d"),gCtx.clearRect(0,0,t,o),qrcode.callback=i),upqrStatue=!0};