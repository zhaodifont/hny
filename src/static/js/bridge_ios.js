var CONFIG = {
	b612Scheme: "b612cnb://"
}
var B612Kaji = B612Kaji || {};
B612Kaji.Native = B612Kaji.Native || {};
B612Kaji.Native.ios = {};

B612Kaji.Native.ios.Function = function () {
  this.callback = {};
}

B612Kaji.Native.ios.Function.prototype = {

	openCustomURLinIFrame: function (src) {
		var rootElm = document.documentElement;
		var newFrameElm = document.createElement("IFRAME");

		newFrameElm.setAttribute("src", src);
		rootElm.appendChild(newFrameElm);
		newFrameElm.parentNode.removeChild(newFrameElm);
	},

	calliOSFunction: function (functionName, args, sCallback) {
		var url = CONFIG.b612Scheme + "native/";
		var callInfo = {};
			callInfo.functionName = functionName;
		if (sCallback) {
			callInfo.success = sCallback;
		}
		if (args) {
			callInfo.args = args;
		}
		url += JSON.stringify(callInfo);

		this.openCustomURLinIFrame(url);
	},

	saveImage: function (cb,imageUrl) {
		this.callback.saveImage = function (result) {
			var json = JSON.parse(result);
			cb(json)
		};
		var options = {"imageUrl" : imageUrl};
		this.calliOSFunction("saveImage", options, "B612Kaji.Native.ios.Function.getInstance().callback.saveImage");
	},

	shareImage: function (imageUrl) {
		this.callback.shareImage = function (result) {
			var json = JSON.parse(result);
			// console.log("success : " + json.success + " errorMessage : " + json.errorMessage);
		};
		var options = {"imageUrl" : imageUrl};
		this.calliOSFunction("shareImage", options, "B612Kaji.Native.ios.Function.getInstance().callback.shareImage");
	},

	shareImageWithCallback: function(imageUrl, sCallback) {
		this.callback.shareImage = function (result) {
			var json = JSON.parse(result);
			// console.log("success : " + json.success + " errorMessage : " + json.errorMessage);
		};
		this.callback.clickShareButton = function(result) {
			var json = JSON.parse(result);
			// console.log("success : " + json.success + " errorMessage : " + json.errorMessage);
			sCallback(result);
		};
		var options = {};
		options.imageUrl = imageUrl;
		options.clickShareButton = "B612Kaji.Native.ios.Function.getInstance().callback.clickShareButton";
		this.calliOSFunction("shareImage", options, "B612Kaji.Native.ios.Function.getInstance().callback.shareImage");
	},

	eventCamera: function(sCallback, type, cameraPosition, filterId) {
		this.callback.eventCamera = function(result) {
			var json = JSON.parse(result);
			sCallback(json, type);
		};
		var options = {"type" : type};
		if (cameraPosition != undefined) {
			options.cameraPosition = cameraPosition;
		}
		if (filterId != undefined) {
			options.filterId = filterId;
		}
		this.calliOSFunction("eventCamera", options, "B612Kaji.Native.ios.Function.getInstance().callback.eventCamera");
	},

	getCameraImage: function(sCallback) {
		this.callback.getCameraImage = function(result) {
			var json = JSON.parse(result);
			// alert(!!json)
			// alert("success : " + json.success + " errorMessage : " + json.errorMessage + "base64Image : " + json.base64Image.length);
			sCallback(json);
		};
		this.calliOSFunction("getCameraImage", null, "B612Kaji.Native.ios.Function.getInstance().callback.getCameraImage");
	},

	appInfo: function(sCallback) {
		this.callback.appInfo = function(result) {
			sCallback(result);
		};
		this.calliOSFunction("appInfo", null, "B612Kaji.Native.ios.Function.getInstance().callback.appInfo");
	}
}

B612Kaji.Native.ios.Function.getInstance = function () {
  if (B612Kaji.Native.ios.Function.instance == null) {
    B612Kaji.Native.ios.Function.instance = new B612Kaji.Native.ios.Function();
  }
  return B612Kaji.Native.ios.Function.instance;
}
B612Kaji.Native.ios.Function.instance = null;
