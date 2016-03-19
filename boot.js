//////
// Let system thinking it under opera 12.10
//////
window.opera = {
    version: function () {
        return 12.10;
    }
};

///////
// make some config for working (Optionnal)
//////
guiConfig.pcLogging = true;             // Send log to console
guiConfig.debugPanelEnabled = true;     // Show virtual console

///////
// Log all (debug included, optionnal)
//////
for(var propertyName in log._logLevels) {
    log._logLevels[propertyName] = 1;
}

//////
// Overwrite main menu input (MainMenuCtrl.prototype._invokeSelectCallback)
// Because it jam in Chrome (pressing button wait some animation that will never begin) 
//////
_invokeSelectCallbackOverwrite = function(index)
{
    if (0 <= index && index < 5)
    {
        // Temporarily block input to allow time for a context change transition.
        // ** DO NOT **  block input indefinitely in case MMUI does not send a context change.
        if (this._allowInput)
        {
            this._allowInput = false;
            this._allowInputTimerId = setTimeout(function(){
                this._allowInput = true;
                this._allowInputTimerId = null;
            }.bind(this), 1000);
        }

        if (true) //index === this._fullyHighlightedIndex)
        {
            this._hasInvokedSelectCallback = true;
            if (this.properties.selectCallback)
            {
                var icon = this._coins[index].key.toLowerCase();
                this.properties.selectCallback(this, this.properties.appData, { "icon" : icon });
            }
        }
        else
        {
            log.info("_invokeSelectCallback: Select callback delayed because coin is not fully highlighted yet.");
            this._pendingInvokeSelectIndex = index;
        }
    }
};

//////
// Overwrite init function (GuiFramework.prototype._getStartupSettings)
// Because original function wait 20 sec to initialise gui
// and it let us choose the config we want 
////// 
_getStartupSettingsOverwrite = function()
{
    log.info("* * * * * GUI is ready.  Sending Global.GetStartupSettings event to MMUI. * * * * *");

    // Global.GetStartupSettings is newly added to get region and units settings from MMUI
    this.sendEventToMmui("common", "Global.GetStartupSettings");
    this.initGuiCalled = false;
    var self = this;
    if (!self.initGuiCalled)
    {
        self.initGuiCalled = true;

        framework.localize.setRegion(framework.localize.REGIONS.Japan);

        framework.localize.setLanguage("en_US", true);
        //framework.localize.setLanguage("fr_CN", true);
        //framework.localize.setLanguage("ja_JP", true);
        //framework.localize.setLanguage("zh_TW", true);

        framework.localize.setKeyboardLanguage("en_US");
        framework.localize.setTimeFormat(framework.localize.TIME_FORMATS.T12hrs);
        framework.localize.setTemperatureUnit(framework.localize.TMPRTURE_UNITS.Celsius);
        framework.localize.setDistanceUnit(framework.localize.DISTANCE_UNITS.Kilometers);
        framework.localize.setVehicleType("J36");

        framework.localize.setDisplayTheme(framework.localize.DISPLAY_THEMES.DisplayTheme_02);

        self.initGui();
    }
}

var timer = setInterval(function(){ 
    if ( MainMenuCtrl.prototype._invokeSelectCallback !== undefined ) {
        MainMenuCtrl.prototype._invokeSelectCallback = _invokeSelectCallbackOverwrite;
        clearInterval(timer);
    }
}, 100);

var timer2 = setInterval(function(){ 
    addAdditionalApps();
    if ( systemApp.hasAdditionalApps ) {
        clearInterval(timer2);
    }
}, 100);



GuiFramework.prototype._getStartupSettings = _getStartupSettingsOverwrite;


