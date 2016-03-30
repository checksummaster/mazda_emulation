/*
 Copyright 2016 Herko ter Horst
 __________________________________________________________________________

 Filename: HelloWorldTmplt.js
 __________________________________________________________________________
 */

log.addSrcFile("HelloWorldTmplt.js", "helloworld");

/*
 * =========================
 * Constructor
 * =========================
 */
function HelloWorldTmplt(uiaId, parentDiv, templateID, controlProperties)
{
    this.divElt = null;
    this.templateName = "HelloWorldTmplt";

    this.onScreenClass = "HelloWorldTmplt";

    log.debug("  templateID in HelloWorldTmplt constructor: " + templateID);

    //@formatter:off
    //set the template properties
    this.properties = {
        "statusBarVisible" : true,
        "leftButtonVisible" : true,
        "rightChromeVisible" : true,
        "hasActivePanel" : false,
        "isDialog" : false
    };
    //@formatter:on

    // create the div for template
    this.divElt = document.createElement('div');
    this.divElt.id = templateID;
    this.divElt.className = "TemplateWithStatusLeft HelloWorldTmplt";

    parentDiv.appendChild(this.divElt);

    // do whatever you want here
    this.divElt.innerHTML = "<p>Hello MZD Connect World</p>";
}

/*
 * =========================
 * Standard Template API functions
 * =========================
 */

/* (internal - called by the framework)
 * Handles multicontroller events.
 * @param   eventID (string) any of the “Internal event name” values in IHU_GUI_MulticontrollerSimulation.docx (e.g. 'cw',
 * 'ccw', 'select')
 */
HelloWorldTmplt.prototype.handleControllerEvent = function(eventID)
{
    log.debug("handleController() called, eventID: " + eventID);

    var retValue = 'giveFocusLeft';
    return retValue;
};
/*
 * Called by the app during templateNoLongerDisplayed. Used to perform garbage collection procedures on the template and
 * its controls.
 */
HelloWorldTmplt.prototype.cleanUp = function()
{

};

framework.registerTmpltLoaded("HelloWorldTmplt");
