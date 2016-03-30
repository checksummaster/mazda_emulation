/*
 Copyright 2016 Herko ter Horst
 __________________________________________________________________________

 Filename: _helloworldApp.js
 __________________________________________________________________________
 */

log.addSrcFile("_setupApp.js", "_setup");

function _setupApp(uiaId)
{
    log.debug("Constructor called.");

    // Base application functionality is provided in a common location via this call to baseApp.init().
    // See framework/js/BaseApp.js for details.
    baseApp.init(this, uiaId);
}


/*********************************
 * App Init is standard function *
 * called by framework           *
 *********************************/

/*
 * Called just after the app is instantiated by framework.
 * All variables local to this app should be declared in this function
 */
_setupApp.prototype.appInit = function()
{
    log.debug("_helloworldApp appInit  called...");

    //Context table
    //@formatter:off
    this._contextTable = {
        "Start": { // initial context must be called "Start"
            "sbName": "Setup",
           // "template": "HelloWorldTmplt",
           // "templatePath": "apps/_custom/_helloworld/templates/HelloWorld", //only needed for app-specific templates
            "readyFunction": this._StartContextReady.bind(this)
        } // end of "HelloWorld"
    }; // end of this.contextTable object
    //@formatter:on

    //@formatter:off
    this._messageTable = {
        // haven't yet been able to receive messages from MMUI
    };
    //@formatter:on
};

/**
 * =========================
 * CONTEXT CALLBACKS
 * =========================
 */
_setupApp.prototype._StartContextReady = function ()
{
    // do anything you want here
};

/**
 * =========================
 * Framework register
 * Tell framework this .js file has finished loading
 * =========================
 */
framework.registerAppLoaded("_setup", null, false);
