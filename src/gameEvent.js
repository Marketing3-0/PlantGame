(function() {

function gameEvent(type, data) {
	this.Event_constructor();
	
	this.type = type;
	this.data = data;
        new createjs.Event(type, this.bubbles, this.cancelable );
}
var p = createjs.extend(gameEvent, createjs.Event);


p.clone = function() {
    return new gameEvent(this.type, this.data);
} ;


window.gameEvent = createjs.promote(gameEvent, "Event");
}());


