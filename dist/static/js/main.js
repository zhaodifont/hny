function loadingStart(){$(".loadingDiv").css("display","")}function loadingStop(){$(".loadingDiv").css("display","none")}var canvasDom,canvasCtx,$upload=$("#upload"),$cropSection=$("#cropSection"),$defaultImgSet=$("#cropLayer img"),$dropArea=$("#dropArea span"),$reChoose=$("#reChoose"),$toNext=$("#toNext"),cropGesture=null;function cropChoose(){console.log("cropChoose"),cropStart($upload)}function cropStart(o){$upload.unbind("change"),$upload.one("change",cropChanged),$upload.trigger("click")}function cropChanged(o){if(console.log("cropChanged"),console.log(this.files),this.files.length<1)return cropStop(),preventEventPropagation(o);var e=this.files[0],t=new FileReader;return t.onload=function(){var o=this.result,t=new BinaryFile(o),i=EXIF.readFromBinaryFile(t),r=new Image;r.onload=function(){cropLoaded(this),loadingStop()},new MegaPixImage(e).render(r,{maxWidth:960,maxHeight:960,orientation:i.Orientation})},t.readAsBinaryString(e),preventEventPropagation(o)}function cropLoaded(o){var e=window.supportTouch;$cropSection.css("display",""),console.log("cropLoaded");var t=o.width,i=o.height,r=$dropArea.width()/t,n=$dropArea.height()/i,a=r>n?r:n;console.log("imgWidth",t),console.log("imgHeight",i),cropGesture.targetMinWidth=t*a,cropGesture.targetMinHeight=i*a;var c=.5*($dropArea.width()-cropGesture.targetMinWidth),s=.5*($dropArea.height()-cropGesture.targetMinHeight);$defaultImgSet.css("display",""),$defaultImgSet.width(cropGesture.targetMinWidth),$defaultImgSet.height(cropGesture.targetMinHeight),$defaultImgSet.css("left",[c,"px"].join("")),$defaultImgSet.css("top",[s,"px"].join("")),$defaultImgSet[0].src=o.src,cropGesture.unbindEvents(),cropGesture.bindEvents(),$reChoose.unbind(e?"touchend":"click"),$reChoose.on(e?"touchend":"click",cropStart()),$toNext.unbind(e?"touchend":"click"),$toNext.on(e?"touchend":"click",cropConfirm)}function cropStop(){console.log("cropStop")}function cropConfirm(o){var e=canvasDom.height/$("#cropLayer .wpr").height(),t=($("#cropLayer .wpr").width(),$cropSection.width(),$defaultImgSet),i={x:parseInt(t.css("left"))||0,y:parseInt(t.css("top"))||0};console.log("imgOrigin x,y",i.x,i.y);t.width(),t.height();return console.log("imgSize ",i.x,i.y,$("#cropLayer .wpr").width(),$("#cropLayer .wpr").height()),canvasCtx.clearRect(0,0,canvasDom.width,canvasDom.height),canvasCtx.drawImage(t[0],Math.abs(i.x)*e,Math.abs(i.y)*e,$("#cropLayer .wpr").width(),$("#cropLayer .wpr").height(),10,10,$("#cropLayer .wpr").width(),$("#cropLayer .wpr").width()),preventEventPropagation(o)}window.indexPageReady=function(){loadingStart(),$("#firstPage .chooseBtn").on("click",cropChoose),window.setTimeout(function(){cropGesture=new EZGesture($dropArea[0],$defaultImgSet[0],{targetMinWidth:420,targetMinHeight:420});var o=$("#cropCanvas");canvasDom=o[0],canvasCtx=canvasDom.getContext("2d"),cropGesture.targetMinWidth=canvasDom.width,cropGesture.targetMinHeight=canvasDom.height,$cropSection.css("visibility","hidden"),$cropSection.css("display",""),$cropSection.css("display","none"),$cropSection.css("visibility","visible")},0),loadingStop()},$("#defaultPic div").on("click",function(){console.log("2222")}),$cropSection.find(".item").on("click",function(){console.log("choose style")});