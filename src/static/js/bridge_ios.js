var B612Kaji = B612Kaji || {};
B612Kaji.Native = B612Kaji.Native || {};
B612Kaji.Native.ios = {};

B612Kaji.Native.ios.Function = function() {
	this.callback = {};
}

B612Kaji.Native.ios.Function.prototype = {

	openCustomURLinIFrame: function(src) {
	    
		var rootElm = document.documentElement;
	    var newFrameElm = document.createElement("IFRAME");

	    newFrameElm.setAttribute("src",src);
	    rootElm.appendChild(newFrameElm);
	    newFrameElm.parentNode.removeChild(newFrameElm);
	},

	calliOSFunction: function(functionName, args, successCallback) {
		    
		var url = "b612cn://native/";
	    var callInfo = {};
		callInfo.functionName=functionName;
	    if (successCallback) {
	        callInfo.success = successCallback;
	    }
	    if (args) {
	        callInfo.args = args;
	    }
		 url += JSON.stringify(callInfo);

	    this.openCustomURLinIFrame(url);
	},

	saveImage: function(successCallback, options) {
		this.callback.saveImage = function(result) {
			var json = JSON.parse(result);
			successCallback(json);
		};
		this.calliOSFunction("saveImage", options, "B612Kaji.Native.ios.Function.getInstance().callback.saveImage");
	},

	shareImage: function(successCallback, options) {
		this.callback.shareImage = function(result) {
			var json = JSON.parse(result);
			successCallback(json);
		};
		this.calliOSFunction("shareImage", options, "B612Kaji.Native.ios.Function.getInstance().callback.shareImage");
	},
	shareImageWithCallback: function(openCallback,clickCallback, options) {
		this.callback.shareImageWithCallback = function(result) {
			var json = JSON.parse(result);
			openCallback(json);
		};
		this.callback.clickShareButton = function(result) {
			var json = JSON.parse(result);
			clickCallback(json);
		};
		options.clickShareButton = "B612Kaji.Native.ios.Function.getInstance().callback.clickShareButton";
		this.calliOSFunction("shareImage", options, "B612Kaji.Native.ios.Function.getInstance().callback.shareImageWithCallback");
	},

	eventCamera: function(successCallback, options) {
		this.callback.eventCamera = function(result) {
			var json = JSON.parse(result);
			successCallback(json);
		};
		this.calliOSFunction("eventCamera", options, "B612Kaji.Native.ios.Function.getInstance().callback.eventCamera");
	},

	getCameraImage: function(successCallback) {
		this.callback.getCameraImage = function(result) {
			var json = JSON.parse(result);
			successCallback(json);
		};
		this.calliOSFunction("getCameraImage", null, "B612Kaji.Native.ios.Function.getInstance().callback.getCameraImage");
	},

	closeWindow: function() {
		this.calliOSFunction("close",null,null);
	}
}


B612Kaji.Native.ios.Function.getInstance = function() {
	if (B612Kaji.Native.ios.Function.instance == null) {
        B612Kaji.Native.ios.Function.instance = new B612Kaji.Native.ios.Function();
	}
	return B612Kaji.Native.ios.Function.instance;
}

B612Kaji.Native.ios.Function.instance = null;
