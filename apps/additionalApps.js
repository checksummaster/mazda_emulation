var systemAppId = 'system';
var additionalApps = [];

_addAppFilesOverwrite = function(uiaId, mmuiMsgObj)
{
    log.debug("framework._addAppFiles called for: " + uiaId);

    var appName = null;
    var path = null;
    var jsPath = null;
    var cssPath = null;
    var cssRtlPath = null;

    this._lastAppLoaded = uiaId;

    if (uiaId == "common")
    {
        this._frameworkState = this._FWK_STATE_LOADING_CMN;

        appName = uiaId;

        // common is unique. "common" is not a uiaId, but we're using it here for convenience
        path = uiaId;
        jsPath = "common/js/Common.js";
    } else if (uiaId.substr(0,1) === "_") {
        this._frameworkState = this._FWK_STATE_LOADING_APP;

        appName = uiaId + "App";

        // file path is predictable (e.g. apps/system/)
        path = "apps/custom/" + uiaId;
        jsPath = path + "/js/" + appName + ".js";

    } else {
        this._frameworkState = this._FWK_STATE_LOADING_APP;

        appName = uiaId + "App";

        // file path is predictable (e.g. apps/system/)
        path = "apps/" + uiaId;
        jsPath = path + "/js/" + appName + ".js";
    }

    // Set the CSS paths
    cssPath = path + "/css/" + appName + ".css";
    cssRtlPath = path + "/css/" + appName + "_rtl.css";

    // store the js object for when the app finishes loading
    this._loadingAppJsObj = mmuiMsgObj;

    utility.loadCss(cssPath);
    if (this._rtlLanguage)
    {
        utility.loadCss(cssRtlPath);
    }
    utility.loadScript(jsPath);

    this._filesToLoad = new Object();
    this._filesToLoad[appName] = false;

}


/**
 * Sets up the additional apps and MMUI message interception magic
 */
function addAdditionalApps() {
	var category = 'Applications';

	// check that we're in the system app
	if(typeof framework === 'object' && framework._currentAppUiaId === systemAppId) {
		var systemApp = framework.getAppInstance(systemAppId);

		if(!systemApp.hasAdditionalApps) {


			GuiFramework.prototype._addAppFiles = _addAppFilesOverwrite;

			systemApp.hasAdditionalApps = true; // so we only do this if needed

			var script = document.createElement('script');
			document.body.appendChild(script);
		    script.type = 'text/javascript';
		    script.src = 'apps/custom/additionalApps.json';
		    script.onload = function(data) {
				for (var i = 0; i < additionalApps.length; ++i) {
					var additionalApp = additionalApps[i];
					systemApp._masterApplicationDataList.items.push({ appData : { appName : additionalApp.name, isVisible : true,  mmuiEvent : 'Select'+additionalApp.name }, text1Id : additionalApp.name, disabled : false, itemStyle : 'style01', hasCaret : false });
					framework.localize._appDicts[systemAppId][additionalApp.name] = additionalApp.label;
					framework.common._contextCategory._contextCategoryTable[additionalApp.name+'.*'] = category;
				}
			};


			// add additional apps to 'Applications' list
			

			// intercept app selection from the list to do our magic
			systemApp._contextTable[category].controlProperties.List2Ctrl.selectCallback = additionalAppMenuItemSelectCallback.bind(systemApp);

			// intercept MMUI messages in the framework
			framework.origRouteMmuiMsg = framework.routeMmuiMsg;
			framework.routeMmuiMsg = additionalAppRouteMmuiMsg.bind(framework);
			framework.sendEventToMmui = additionalAppSendEventToMmui.bind(framework);
		}
	}
}

/**
 * Using a disabled app from the list of apps in systemApp.js as a replacement to the MMUI
 */
var additionalAppReplacedAppName = 'vdt';
var additionalAppReplacedAppContext = 'DriveChartDetails';
var additionalAppReplacedMmuiEvent = 'SelectDriveRecord';

/**
 * Interceptor for systemApp._menuItemSelectCallback
 */
function additionalAppMenuItemSelectCallback(listCtrlObj, appData, params) {
	for (var i = 0; i < additionalApps.length; ++i) {
		var additionalApp = additionalApps[i];
		if(additionalApp.name === appData.appName) {
			framework.additionalAppName = appData.appName;
			framework.additionalAppContext = 'Start';
			appData = JSON.parse(JSON.stringify(appData));
			appData.appName = additionalAppReplacedAppName;
			appData.mmuiEvent = additionalAppReplacedMmuiEvent;
			break;
		}
	}
	this._menuItemSelectCallback(listCtrlObj, appData, params);
}

/**
 * Interceptor for Framework.routeMmuiMsg
 */
function additionalAppRouteMmuiMsg(jsObject) {
	switch(jsObject.msgType) {
		case 'ctxtChg':
			if(this.additionalAppName && jsObject.uiaId == additionalAppReplacedAppName) {
				jsObject.uiaId = this.additionalAppName;
				jsObject.ctxtId = this.additionalAppContext;
			}
			break;
		case 'focusStack':
			var additionalAppInFocusStack = false;
			if(this.additionalAppName) {
				for(var i = 0; i < jsObject.appIdList.length; i++) {
					var appId = jsObject.appIdList[i];
					if(appId.id == additionalAppReplacedAppName) {
						appId.id = this.additionalAppName;
					}
					if(appId.id == this.additionalAppName) {
						additionalAppInFocusStack = true;
					}
				}
			}
			if(!additionalAppInFocusStack) {
				this.additionalAppName = null;
				this.additionalAppContext = null;
			}
		case 'msg': // fall-through to alert
		case 'alert':
			if(this.additionalAppName && jsObject.uiaId == additionalAppReplacedAppName) {
				jsObject.uiaId = this.additionalAppName;
			}
			break;
		default:
			// do nothing
			break;	
	}

	this.origRouteMmuiMsg(jsObject);
}

/**
 * Interceptor for Framework.sendEventToMmui
 */
function additionalAppSendEventToMmui(uiaId, eventId, params, fromVui)
{
	if(uiaId == this.additionalAppName) {
		uiaId = additionalAppReplacedAppName;
	}

    var currentUiaId = this.getCurrentApp();
    var currentContextId = this.getCurrCtxtId();

    if(currentUiaId == this.additionalAppName) {
    	currentUiaId = additionalAppReplacedAppName;
    	currentContextId = additionalAppReplacedAppContext;
    }

    this.websockets.sendEventMsg(uiaId, eventId, params, fromVui, currentUiaId, currentContextId);

     // Let debug know about the message
    this.debug.triggerEvtToMmuiCallbacks(uiaId, eventId, params);
}

/**
 * Function to get the whole thing started.
 */
(function () {
	window.opera.addEventListener('AfterEvent.load', function (e) {
		addAdditionalApps();
	});
})();