function loadingStart(){$(".loadingDiv").css("display","")}function loadingStop(){$(".loadingDiv").css("display","none")}var canvasDom,canvasCtx,$upload=$("#upload"),$defaultImgSet=$("#cropLayer img").get(0),cropGesture=null;function cropChoose(){console.log("cropChoose"),cropStart($upload)}function cropStart(o){o.unbind("change"),o.one("change",cropChanged),o.trigger("click")}function cropChanged(o){if(console.log("cropChanged"),console.log(this.files),this.files.length<1)return cropStop(),preventEventPropagation(o);var n=this.files[0],e=new FileReader;return e.onload=function(){var o=this.result,e=new BinaryFile(o),i=EXIF.readFromBinaryFile(e),t=new Image;t.onload=function(){cropLoaded(this),loadingStop()},new MegaPixImage(n).render(t,{maxWidth:960,maxHeight:960,orientation:i.Orientation})},e.readAsBinaryString(n),preventEventPropagation(o)}function cropLoaded(o){$("#cropSection").css("display",""),console.log("cropLoaded"),$defaultImgSet.src=o.src}function cropStop(){console.log("cropStop")}window.indexPageReady=function(){loadingStart(),$("#firstPage .chooseBtn").on("click",cropChoose),window.setTimeout(function(){cropGesture=new EZGesture($("#dropArea span")[0],$("#cropImg")[0],{targetMinWidth:420,targetMinHeight:420});var o=$("#cropCanvas");canvasDom=o[0],canvasCtx=canvasDom.getContext("2d"),$("#cropSection").css("visibility","hidden"),$("#cropSection").css("display","");($("#cropSection").width()*canvasDom.height*100/(canvasDom.width*$("#cropSection").height())).toFixed(2);$("#cropSection").css("display","none"),$("#cropSection").css("visibility","visible")},0),loadingStop()},$("#defaultPic div").on("click",function(){console.log("2222")}),$("#cropSection .item").on("click",function(){console.log("choose style")});