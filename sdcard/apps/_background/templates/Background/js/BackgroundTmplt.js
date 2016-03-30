/*
  Copyright 2016 Alexandre Lefebvre
 __________________________________________________________________________

 Filename: BackgroundTmplt.js
 __________________________________________________________________________
 */

log.addSrcFile("BackgroundTmplt.js", "background");

/*
 * =========================
 * Constructor
 * =========================
 */
function BackgroundTmplt(uiaId, parentDiv, templateID, controlProperties)
{
    this.divElt = null;
    this.templateName = "BackgroundTmplt";

    this.onScreenClass = "BackgroundTmplt";

    log.debug("  templateID in BackgroundTmplt constructor: " + templateID);

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
    this.divElt.className = "TemplateWithStatusLeft BackgroundTmplt";

    parentDiv.appendChild(this.divElt);

    this.slider = document.createElement('div');
    this.slider.style.position = 'absolute';
    this.divElt.appendChild(this.slider);


    this.select = -1;
    this.imagelist = [];

    utility.loadScript("apps/_custom/_background/images/background/list.js", null, function() {

        for (var i = 0; i < iconlist.length ; i++) {
            var img = document.createElement('img');
            img.setAttribute('src','apps/_custom/_background/images/' + iconlist[i] );
            img.setAttribute('width','225px');
            img.setAttribute('height','135px');
            this.slider.appendChild(img);
            this.imagelist.push({
                img:img,
                link: 'apps/_custom/_background/images/' + backgroundlist[i]
            });
        }        
        this.MakeSelection(0);
        

    }.bind(this));
 

};

BackgroundTmplt.prototype.MakeSelection = function(selection)
{
    if (this.select != -1 ) {
        this.imagelist[this.select].img.style.border = "";
    }
    this.select = selection;
    this.imagelist[this.select].img.style.border = "3px solid #73AD21";


    var rect = this.imagelist[this.select].img.getBoundingClientRect();
    var pagetop = this.divElt.getBoundingClientRect().top;
    var slidertop = this.slider.getBoundingClientRect().top;

    if (rect.bottom >  480 ) {
        slidertop -= rect.bottom - 480;
        this.slider.style.top = slidertop - pagetop + "px";

    }

    if (rect.top < pagetop ) {
        slidertop += pagetop - rect.top;
        this.slider.style.top = slidertop - pagetop + "px";
    }

  
};

BackgroundTmplt.prototype.setBackground = function()
{
    localStorage.setItem("background", "url('" + this.imagelist[this.select].link  + "')");
    document.getElementById('CommonBgImg1').style.background = "url('" + this.imagelist[this.select].link  + "')"; 
    framework.sendEventToMmui("common", "Global.GoBack");   
};

BackgroundTmplt.prototype.selectUp = function()
{
    if (this.select > 2 ) {
        this.MakeSelection(this.select-3);
    }    
}

BackgroundTmplt.prototype.selectDown = function()
{
    if (this.select < this.imagelist.length - 3 ) {
        this.MakeSelection(this.select+3);
    }}

BackgroundTmplt.prototype.selectLeft = function()
{
    if (this.select > 0 ) {
        this.MakeSelection(this.select-1);
    }
}

BackgroundTmplt.prototype.selectRight = function()
{
    if (this.select < this.imagelist.length - 1 ) {
        this.MakeSelection(this.select+1);
    }
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
BackgroundTmplt.prototype.handleControllerEvent = function(eventID)
{
    log.debug("handleController() called, eventID: " + eventID);

    var retValue = ''; //'giveFocusLeft';

    switch (eventID)
    {
        case "acceptFocusInit":
        case "acceptFocusFromLeft":
        case "acceptFocusFromRight":
        case "acceptFocusFromtTop":
        case "acceptFocusFromBottom":
        case "lostFocus":
        case "touchActive":
        case "controllerActive":
           break;

        case "cw":
            this.selectRight();
            break;
        case "ccw":
            this.selectLeft();
            break;

        case "selectStart":
            this.setBackground();
            break;
        case "select":
            break;
        case "selectHold":
            break;

        case "leftHold":
            break;
        case "leftStart":
            this.selectLeft();
            break;
        case "left":
            break;

        case "rightHold":
            break;
        case "rightStart":
            this.selectRight();
            break;
        case "right":
            break;

        case "upHold":
            break;
        case "upStart":
            this.selectUp();
            break;
        case "up":
            break;
 
        case "downHold":
            break;
        case "downStart":
            this.selectDown();
            break;
        case "down":
            break;

        default:
            // No action
            break;
    }

    
    return retValue;
};
/*
 * Called by the app during templateNoLongerDisplayed. Used to perform garbage collection procedures on the template and
 * its controls.
 */
BackgroundTmplt.prototype.cleanUp = function()
{

};

framework.registerTmpltLoaded("BackgroundTmplt");
