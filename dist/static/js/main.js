function loadingStart(){$(".loadingDiv").css("display","block")}function loadingStop(){$(".loadingDiv").css("display","none")}window.indexPageReady=function(){window.setTimeout(function(){cropGesture=new EZGesture($dropArea[0],$defaultImgSet[0],{targetMinWidth:750,targetMinHeight:750});var e=$("#cropCanvas");canvasDom=e[0],canvasCtx=canvasDom.getContext("2d"),cropGesture.targetMinWidth=canvasDom.width,cropGesture.targetMinHeight=canvasDom.height,$cropSection.css("visibility","hidden"),$cropSection.css("display",""),$cropSection.css("display","none"),$cropSection.css("visibility","visible"),loadingStop(),loadScript("./static/js/qrcode.js"),loadScript("./static/js/llqrcode.js"),$("#qrGuide .btn").unbind("click"),$("#qrGuide .btn").on("click",function(){$("#handleQR").trigger("click")})},40),document.querySelector("#firstPage .chooseBtn").onclick=function(){cropChoose()}};var canvasDom,canvasCtx,$upload=$("#upload"),$cropSection=$("#cropSection"),$defaultImgSet=$("#cropImg"),upqrStatue=!1,$dropArea=$("#dropArea"),$reChoose=$("#reChoose,#reChooseb"),$toNext=$("#toNext"),$themeBgImg=$("#themeBgImg"),$themeFoot=$("#theme_foot"),$themeSelectWpr=$(".styleChoose .wpr span"),qrImgs=["qr_guide_t.png","qr_guide1.png","qr_guide2.png","qr_guide3.png","qr_guide4.png"],cropGesture=null,themeStlye=1,themes=[{bg:"./static/img/theme1-bg.jpg",head:"./static/img/theme1-head.png",foot:"./static/img/theme1-foot.jpg",sm:"./static/img/theme1-sm.jpg",heado:{width:"110",height:"135"},cropLayerPos:{top:".46rem",left:"10.8%",width:"78.4%"},cropLayerWprPos:{top:"2.22rem",left:".52rem"}}],changeTheme=function(e){loadingStart(),$themeFoot.find("img")[0].style.width="100%",$themeFoot.find("img")[0].src=e.foot,$(".themeHead")[0].src=e.head;var t=e.cropLayerPos,o=e.cropLayerWprPos;for(var i in t)$("#cropLayer").css(i,t[i]);for(var i in o)$("#cropLayer .wpr").css(i,o[i]);var n=new Image;n.onload=function(){themeBgImg.src=n.src,setTimeout(function(){loadingStop()},260)},n.src=e.bg;var r=setInterval(function(){var e=$(".themeHead").attr("data-width");0!=e?(console.log("aW != 0",0!=e),clearInterval(r),r=null,$("#dropArea").css({left:$("#cropLayer .wpr").offset().left,top:$("#cropLayer .wpr").offset().top+$cropSection.scrollTop()}),$(".themeHead").css("width","100%")):$(".themeHead").attr({"data-width":$(".themeHead").offset().width,"data-height":$(".themeHead").height()})},60)},zd_qrcode=null;function cropChoose(){cropStart($upload)}function cropStart(e){changeTheme(themes[0]),loadingStop(),themes.forEach(function(e,t,o){$themeSelectWpr.eq(0).empty(),console.log($themeSelectWpr.eq(0));var i=document.createElement("div"),n=document.createElement("img");n.setAttribute("src",e.sm),n.style.width="100%",i.classList.add("item"),i.appendChild(n),$themeSelectWpr.eq(0).append(i)}),$upload.unbind("change"),$upload.one("change",cropChanged),$upload.trigger("click")}function cropChanged(e){if(changeTheme(themes[0]),$cropSection.css("visibility","visible"),$("#proSection").css("display","none"),this.files.length<1)return cropStop(),preventEventPropagation(e);var t=this.files[0],o=new FileReader;return o.onload=function(){var e=this.result,o=new BinaryFile(e),i=EXIF.readFromBinaryFile(o),n=new Image;n.onload=function(){cropLoaded(this),canvasDom.setAttribute("width",$themeBgImg[0].width),canvasDom.setAttribute("height",$themeBgImg[0].height),$("#megaPixImage").css({width:this.width,height:this.height})},new MegaPixImage(t).render(n,{maxWidth:750,maxHeight:750,orientation:i.Orientation})},o.readAsBinaryString(t),preventEventPropagation(e)}function cropLoaded(e){var t=window.supportTouch;$cropSection.css("display",""),$cropSection.find(".item").each(function(e,t){$(t).unbind("click")}),$cropSection.find(".item").each(function(e,t){$(t).on("click",function(){loadingStart();var t="../dist/static/img/style"+(e+1)+".png";console.log($(this).index()+1,themeStlye);var o=new Image,i=$(this).index();if(i+1==themeStlye)return loadingStop(),!1;o.onload=function(){console.log("loadimg"),$("#themeBgImg")[0].src=o.src,loadingStop(),themeStlye=i+1},o.src=t})});var o=e.width,i=e.height,n=$dropArea.width()/o,r=$dropArea.height()/i,a=n>r?n:r;console.log("imgWidth",o),console.log("imgHeight",i),cropGesture.targetMinWidth=o*a,cropGesture.targetMinHeight=i*a,console.log("ratio",a);var c=.5*($dropArea.width()-cropGesture.targetMinWidth),d=.5*($dropArea.height()-cropGesture.targetMinHeight);$defaultImgSet.css("display",""),$defaultImgSet.width(cropGesture.targetMinWidth),$defaultImgSet.height(cropGesture.targetMinHeight),$defaultImgSet.css("left",[c,"px"].join("")),$defaultImgSet.css("top",[d,"px"].join("")),$defaultImgSet[0].src=e.src,cropGesture.unbindEvents(),cropGesture.bindEvents(),$reChoose.unbind(t?"touchend":"click"),$reChoose.on(t?"touchend":"click",cropStart),$toNext.unbind(t?"touchend":"click"),$toNext.on(t?"touchend":"click",cropConfirm),$("#eCode").unbind("click"),$("#eCode").on("click",function(){$("#qrGuide").css("display","")}),$("#qrGuide .return").unbind("click"),$("#qrGuide .return").on("click",function(){$("#qrGuide").css("display","none")}),upqrStatue||upqr()}function cropStop(){console.log("cropStop")}function cropConfirm(e){var t=$defaultImgSet,o=$(".themeHead"),i=(canvasDom.height,$("#cropLayer .wpr").height(),$("#megaPixImage").width()/t.width()),n=($("#megaPixImage").width(),o.width(),{x:parseInt(t.css("left"))||0,y:parseInt(t.css("top"))||0});console.log("imgOrigin x,y",n.x,n.y);var r={width:t.width(),height:t.height()};return console.log("imgSize width height",r.width,r.height),canvasCtx.fillStyle="rgba(255, 255, 255, 0)",canvasCtx.clearRect(0,0,canvasDom.width,canvasDom.height),canvasCtx.drawImage($themeBgImg[0],0,0,$themeBgImg.width(),$themeBgImg.height()),canvasCtx.drawImage(t[0],Math.abs(n.x)*i,Math.abs(n.y)*i,$dropArea.width()*i,$dropArea.height()*i,$dropArea.offset().left,$dropArea.offset().top+$cropSection.scrollTop(),$dropArea.width(),$dropArea.height()),canvasCtx.drawImage(o[0],0,0,parseInt(o.attr("data-width")),parseInt(o.attr("data-height")),o.offset().left,o.offset().top+$cropSection.scrollTop(),o.width(),o.height()),canvasCtx.fillStyle="#fff",canvasCtx.fillRect($("#eCode").offset().left-2,$("#eCode").offset().top+$cropSection.scrollTop()-2,$("#eCode").width(),$("#eCode").height()),canvasCtx.drawImage($("#eCode")[0],0,0,124,124,$("#eCode").offset().left,$("#eCode").offset().top+$cropSection.scrollTop(),$("#eCode").width()+10,$("#eCode").height()+10),setTimeout(function(){loadingStart(),proSave(),$cropSection.find(".item").each(function(e,t){$(t).unbind("click")})},0),preventEventPropagation(e)}function proSave(){var e="";window.isAndroid?e=(new JPEGEncoder).encode(canvasCtx.getImageData(0,0,canvasDom.width,canvasDom.height),100,!0):e=canvasDom.toDataURL("image/jpeg",1);var t=new Image;t.onload=function(){$("#proSection img")[0].src=t.src,$("#proSection").css("display","block"),loadingStop()},t.src=e}function upqr(){function e(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function t(t){t.indexOf("error")>-1?alert("请输入有效的收款二维码"):(console.log("htmlEntities(a)",e(t)),zd_qrcode.makeCode(e(t)),$("#eCode")[0].src=$("#zd_qrcode img")[0].src,$("#qrGuide").css("display","none")),$("#handleQR")[0].value=""}var o,i,n;document.querySelector("#handleQR").addEventListener("change",function(){!function(e){for(var t=0;t<e.length;t++){var i=new FileReader;i.onload=(n=e[t],console.log("file:",n),function(e){gCtx.clearRect(0,0,o.width,o.height),qrcode.decode(e.target.result)}),i.readAsDataURL(e[t])}var n}(this.files)},!1),window.File&&window.FileReader&&(i=200,n=150,(o=document.getElementById("qr-canvas")).style.width=i+"px",o.style.height=n+"px",o.width=i,o.height=n,gCtx=o.getContext("2d"),gCtx.clearRect(0,0,i,n),qrcode.callback=t),(zd_qrcode=new QRCode(document.getElementById("zd_qrcode"),{width:100,height:100})).makeCode(""),upqrStatue=!0}