(function() {

var uiContainer;
function TutorialScreen() {
	this.Container_constructor();
	this.buildUI();
}
var p = createjs.extend(TutorialScreen, createjs.Container);

p.buildUI = function() {
    var bk = new createjs.Bitmap(window.loader.getResult("_tutorialBk"));
    var btn = new createjs.Bitmap(window.loader.getResult("_tutBackBk"));
    uiContainer = new createjs.Container();
    btn.y = 550;
    btn.addEventListener("click", onBackBtn);
    uiContainer.addChild( bk, btn);    
    uiContainer.x= window.STAGE_WIDTH; 
    stage.addChild(uiContainer);
} ;

onBackBtn = function (event) {
    //alert("You clicked on the back button on tutorial");

    var newEvt = new createjs.Event("screenChange", true, true);
    newEvt.data = GAMESCREEN;
    //stage.addEventListener("screenChange", onEventTry);
    stage.dispatchEvent(newEvt);
} ;

onEventTry = function(event){
    console.log("get the event");
};

window.TutorialScreen = createjs.promote(TutorialScreen, "Container");
}());

