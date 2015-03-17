/* 
 * The button that has mouse over and mouse out effect
 *
 */
(function() {

var container, text, overImg, outImg;

function Button( _overImg, _outImg, label) {
	this.Container_constructor();
	this.label = label;
	overImg = _overImg;
        outImg = _outImg;
	this.setup();
}
var p = createjs.extend(Button, createjs.Container);

p.setup = function() {
        outImg.alpha =1;
        overImg.alpha =0;
        if( this.label !=null && this.label.length !=0 ){
            text = new createjs.Text(this.label, "20px Arial", "#000");
            text.textBaseline = "top";
            text.textAlign = "center";

            var width = text.getMeasuredWidth()+30;
            var height = text.getMeasuredHeight()+20;

            text.x = width/2;
            text.y = 10;
            this.addChild( outImg, overImg, text );
        }else{
            this.addChild( outImg, overImg );
        }
	
//        stage.addChild( container );
	this.addEventListener("rollover", handleRollOver);
	this.addEventListener("rollout", handleRollOut);
	this.mouseChildren = false;
} ;

handleRollOver = function(event) {       
        outImg.alpha=0;
        if(text){
            overImg.alpha = text.alpha = 1;
        }else{
            overImg.alpha =1;
        }
        stage.update();
};

handleRollOut = function (event){
        outImg.alpha =1;
        if(text){
            overImg.alpha = text.alpha = 0;
        }else{
            overImg.alpha =0;
        }
        stage.update();
};

p.destroy= function(){
    	this.removeEventListener("rollover", this.handleRollOver);
	this.removeEventListener("rollout", this.handleRollOut);
        while(this.numChildren!=0){
            this.removeChildAt( this.numChildren-1);
        }
}

window.Button = createjs.promote(Button, "Container");
}());

