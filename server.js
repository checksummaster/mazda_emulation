

var WebSocketServer = require('ws').Server



var globalcontextSeq = 0;
var currAppId = 1;

transitionFalse = JSON.stringify( {"msgType": "transition", "enabled": false} );
transitionTrue = JSON.stringify( {"msgType": "transition", "enabled": true} );

var goBackStack = [];

var fakeCtxtChgMsgs = function(ws, uiaId, ctxtId, params, contextSeq)
{
 
    if ( typeof(contextSeq) == 'undefined') {
        contextSeq = globalcontextSeq;
        globalcontextSeq += 1;
    }
    var ctxtChgMsg = JSON.stringify( {"msgType": "ctxtChg", "ctxtId": ctxtId, "uiaId": uiaId, "params": params, "contextSeq": contextSeq} );
    var focusStackMsg = JSON.stringify( {"msgType": "focusStack", "appIdList": [ {"id": uiaId}, {"id": currAppId} ]} );
    ws.send(transitionTrue);
    console.log('guiifm send: %s', transitionTrue);
    ws.send(ctxtChgMsg);
    console.log('guiifm send: %s', ctxtChgMsg);
    ws.send(focusStackMsg);
    console.log('guiifm send: %s', focusStackMsg);
    ws.send(transitionFalse);
    console.log('guiifm send: %s', transitionFalse);

    if ( uiaId === "system" || uiaId ===  "vdt" || uiaId === "syssettings") {
        goBackStack.push({uiaId:uiaId, ctxtId:ctxtId, params:params, contextSeq:contextSeq });
    }
}

//{"msgType":"event","eventId":"Global.GetStartupSettings","uiaId":"common","params":"{}","fromVui":false,"currentUiaId":"","currentContextId":""}

var MmuiCallback = function(ws,uiaId, eventId, params)
{
    //console.log("TO MMUI MESSAGE: uiaId:" + uiaId + ", eventId:" + eventId + ", params:" + params);
    var msg_type = "";
    var app_id = "";
    var event_id = "";
    var params_obj = null;

    switch (eventId)
    {
        case "Global.GetStartupSettings":
            //fakeCtxtChgMsgs(ws,"system", "HomeScreen");
            fakeCtxtChgMsgs(ws,"system", "Applications");
            break;
        case "SelectDriveRecord":
            fakeCtxtChgMsgs(ws,"vdt","DriveChartDetails");
            break;
        case "Global.InitGui":
        case "Global.IntentHome":
            fakeCtxtChgMsgs(ws,"system", "HomeScreen");
            break;
        case "Global.GoBack":
            if (goBackStack.length > 1 ) {
                goBackStack.pop();
                context = goBackStack[goBackStack.length-1];
                fakeCtxtChgMsgs(ws,context.uiaId, context.ctxtId, context.params, context.contextSeq);

            }
            break;
        case "SelectApplications":
            fakeCtxtChgMsgs(ws,"system", "Applications");
            break;
        case "SelectEntertainment":
            fakeCtxtChgMsgs(ws,"system", "Entertainment");
            break;
        case "SelectCommunication":
            fakeCtxtChgMsgs(ws,"system", "Communication");
            break;
        case "SelectNavigation":
            fakeCtxtChgMsgs(ws,"system", "Navigation");
            break;
        case "SelectSettings":
            fakeCtxtChgMsgs(ws,"system", "Settings");
            fakeCtxtChgMsgs(ws,"syssettings","DisplayTab");
            //this.SendCarSettings();
            //sendMmuiMsg(JSON.stringify({"msgType":"msg","uiaId":"vehsettings","msgId":"IgnitionStatus","params":{"payload":{"evData":1}}} ));
            //sendMmuiMsg(JSON.stringify({"msgType":"msg","uiaId":"vehsettings","msgId":"CanStatus","params":{"payload":{"evData":1}}} ));
            break;
        case "Global.IntentSettingsTab":
            switch (params.payload.settingsTab)
            {
                case "HUD":
                    //not implemented in debug mode iet
                    //fakeCtxtChgMsgs(ws,"syssettings","HUDTab");
                    break;
                case "Display":
                    fakeCtxtChgMsgs(ws,"syssettings","DisplayTab");
                    break;
                case "Safety":
                    fakeCtxtChgMsgs(ws,"vehsettings","SafetyTab");
                    break;
                case "Sound":
                    fakeCtxtChgMsgs(ws,"audiosettings","SoundTab");
                    break;
                case "Clock":
                    fakeCtxtChgMsgs(ws,"syssettings","ClockTab");
                    break;
                case "Vehicle":
                    fakeCtxtChgMsgs(ws,"vehsettings","VehicleSettingsTab");
            
                    break;
                case "Devices":
                    fakeCtxtChgMsgs(ws,"syssettings","DevicesTab");
                    break;
                case "System":
                    fakeCtxtChgMsgs(ws,"syssettings","SystemTab");
                    break;
            }
            break;
        case "GoDoorLock":
            fakeCtxtChgMsgs(ws,"vehsettings","DoorLock");
            break;
        case "GoUnlockMode":
            fakeCtxtChgMsgs(ws,"vehsettings","UnlockMode");
        case "GoDoorLockMode":
            fakeCtxtChgMsgs(ws,"vehsettings","DoorLockMode");


        default:
            if (eventId.substr(0,6) === "Select" ) {
                fakeCtxtChgMsgs(ws,uiaId,eventId.substr(6));
            }

    }
    return true;
}




var appsdk = new WebSocketServer({ port: 2800 });
appsdk.on('connection', function connection(ws) {

    console.log("Connection appsdk");
    
  ws.on('message', function incoming(message) {
    console.log('appsdk received: %s', message);
  });

  //ws.send('something');
});

var guiifm = new WebSocketServer({ port: 2700 });
guiifm.on('connection', function connection(ws) {

    console.log("Connection guiifm");
    
  ws.on('message', function incoming(message) {
    console.log('guiifm received: %s', message);
    var data = JSON.parse(message);
    MmuiCallback(ws,data.uiaId, data.eventId, data.params )



  });

  //ws.send('something');
});

var dbapi = new WebSocketServer({ port: 2766 });
dbapi.on('connection', function connection(ws) {

    console.log("Connection dbapi");
    
  ws.on('message', function incoming(message) {
    console.log('dbapi received: %s', message);
  });

  //ws.send('something');
});



//    this.appsdkSocket = {"uri": "ws://" + ip +":2800", "protocol": "ihu-appsdk-protocol"};
    
//    this.mmuiSocket = {"uri": "ws://" + ip +":2700", "protocol": "ihu-guiifm-protocol"};   
    
//    this.dbapiSocket = {"uri": "ws://" + ip +":2766", "protocol": "ihu-dbapi-protocol"};    