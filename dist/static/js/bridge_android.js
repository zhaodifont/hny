var B612Kaji=B612Kaji||{};B612Kaji.Native=B612Kaji.Native||{},B612Kaji.Native.android={},B612Kaji.Native.android.Function=function(){this.callback={}},B612Kaji.Native.android.Function.prototype={saveImage:function(a,i){this.callback.saveImage=function(i){var n=JSON.parse(i);a(n)},window.B612KajiBridgeInterface.saveImage("B612Kaji.Native.android.Function.getInstance().callback.saveImage",i)},closeWindow:function(){window.B612KajiBridgeInterface.close()},shareImageWithCallback:function(a,i,n){this.callback.shareImageWithCallback=function(i){var n=JSON.parse(i);a(n)},this.callback.clickShareButton=function(a){var n=JSON.parse(a);i(n)},window.B612KajiBridgeInterface.shareImageWithCallback("B612Kaji.Native.android.Function.getInstance().callback.shareImageWithCallback","B612Kaji.Native.android.Function.getInstance().callback.clickShareButton",n)},eventCamera:function(a,i){this.callback.eventCamera=function(i){a(i)},window.B612KajiBridgeInterface.eventCamera("B612Kaji.Native.android.Function.getInstance().callback.eventCamera",JSON.stringify(i))},getCameraImage:function(a){this.callback.getCameraImage=function(i){a(i)},window.B612KajiBridgeInterface.getCameraImage("B612Kaji.Native.android.Function.getInstance().callback.getCameraImage")}},B612Kaji.Native.android.Function.getInstance=function(){return null==B612Kaji.Native.android.Function.instance&&(B612Kaji.Native.android.Function.instance=new B612Kaji.Native.android.Function),B612Kaji.Native.android.Function.instance};