var B612Kaji = B612Kaji || {};
B612Kaji.Native = B612Kaji.Native || {};
B612Kaji.Native.android = {};

B612Kaji.Native.android.Function = function() {
	this.callback = {};
}

B612Kaji.Native.android.Function.prototype = {

	saveImage: function(callback,urlOrBase64Image) {
		this.callback.saveImage = function(result) {
			var resultJson = JSON.parse(result);
			callback(resultJson);
		};
		window.B612KajiBridgeInterface.saveImage("B612Kaji.Native.android.Function.getInstance().callback.saveImage", urlOrBase64Image);
	},
	closeWindow: function() {
		window.B612KajiBridgeInterface.close();
	},

	shareImageWithCallback: function(openCallback,clickCallback,base64Image) {
    this.callback.shareImageWithCallback = function(result) {
      var resultJson = JSON.parse(result);
      openCallback(resultJson);
    };

    this.callback.clickShareButton = function(result) {
      var resultJson = JSON.parse(result);
      clickCallback(resultJson);
    };

		window.B612KajiBridgeInterface.shareImageWithCallback(
		"B612Kaji.Native.android.Function.getInstance().callback.shareImageWithCallback",
		"B612Kaji.Native.android.Function.getInstance().callback.clickShareButton",
		base64Image);
	},

	eventCamera: function(callback,options) {
		this.callback.eventCamera = function(result) {
			callback(result);
		};

		window.B612KajiBridgeInterface.eventCamera("B612Kaji.Native.android.Function.getInstance().callback.eventCamera",JSON.stringify(options));
	},

	getCameraImage: function(callback) {
		this.callback.getCameraImage = function(result) {
			callback(result);
		};
		window.B612KajiBridgeInterface.getCameraImage("B612Kaji.Native.android.Function.getInstance().callback.getCameraImage");
	},
}

B612Kaji.Native.android.Function.getInstance = function() {
	if (B612Kaji.Native.android.Function.instance == null) {
		B612Kaji.Native.android.Function.instance = new B612Kaji.Native.android.Function();
	}
	return B612Kaji.Native.android.Function.instance;
}
B612Kaji.Native.android.Function.instance = null;
