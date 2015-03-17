/* 
 * Make a new class to handle the game logic
 * 
 * It should do the following:
 * 1. setup the game screen
 * 2. get the asset map from caller
 * 3. dispatch event when it is done 
 */
(function() {
        
    var uiContainer = new createjs.Container();
    var plantContainer = new createjs.Container();
    var foodContainer = new createjs.Container();
    var lifeContainer = new createjs.Container();
    var lifeSign;
    var lifeList= [];
    var score=0;
    var scoreTxt;
    
    function gameScreen() {
        this.Container_constructor();
        this.buildUI();
    }
    var p = createjs.extend(gameScreen, createjs.Container);

    p.buildUI = function(){
        var spriteSheet = new createjs.SpriteSheet({
				framerate: 30,
				"images": [window.loader.getResult("_lifeSign")],
				"frames": {"regX": 0, "height": 48, "count": 2, "regY": 0, "width": 23},
				// define two animations, run (loops, 1.5x speed) and jump (returns to run):
				"animations": {
					"full": [0, 0, "full"],
                                        "half": [1, 1, "half"]
				}
			});
        for(var i=0; i<5; i++){
            lifeSign = new createjs.Sprite(spriteSheet, "full");
            var w = lifeSign.getBounds().width;
            lifeSign.x = i*(w +10);
            lifeList.push(lifeSign);
            lifeContainer.addChild(lifeSign);
        }
        scoreTxt = new createjs.Text("", "bold 24px Arial", "#FF0000");
	scoreTxt.maxWidth = 100;
                
        var uiBk = new createjs.Bitmap(window.loader.getResult("_gameTitleBk"));
        uiBk.x = 30;
        lifeContainer.x = uiBk.x + 610;
        lifeContainer.y = 22;
        scoreTxt.x = lifeContainer.x - 130;
        scoreTxt.y = lifeContainer.y+18;
        scoreTxt.textAlign="center";
        foodContainer.x = 110;
        var h = lifeContainer.getBounds().height;
        foodContainer.y = h -10;
        plantContainer.x = foodContainer.x;
        plantContainer.y = 170;
        p.addFood();
        p.addPlants();
        var bk = new createjs.Bitmap( window.loader.getResult("_gameBk"));
        uiContainer.addChild(bk, uiBk, foodContainer, lifeContainer, scoreTxt, plantContainer);
        this.addChild(uiContainer);
        this.x = window.STAGE_WIDTH;
        var diff = ( stage == window.stage)?  "same": "not the same";
        console.log("this stage and the window's stage is "+diff)
    };

    p.startPlay = function(){
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", p.tick);
    };
    
    p.addPlants = function(){
        for( var i=0; i<3; i++){
            var plant = new createjs.SpriteSheet({
                                    framerate: 30,
                                    "images": [window.loader.getResult("_flower1ani")],
                                    "frames": {"regX": 0, "height": 133, "count": 2, "regY": 0, "width": 109},
                                    // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                                    "animations": {
                                            "close": [0, 0, "close"],
                                            "open": [1, 1, "open"]
                                    }
                            });
            var thePlant = new createjs.Sprite(plant, "close");
            thePlant.gotoAndStop("close");
            thePlant.y = 195;
            thePlant.x = i*(thePlant.getBounds().width +105);
            thePlant.state = "close";
            thePlant.addEventListener("click", onClickPlant);
            plantContainer.addChild( thePlant );
        }
    };   
    
    p.addFood = function(){
        var foodList =["_fly", "_fries", "_burger"];
        for( var j=0; j<3; j++){
            var i = Math.floor( Math.random()*4);
            if( i!=3){
                var img = new createjs.Bitmap( window.loader.getResult(foodList[i]));
                img.nature = (i>0)? "bad" : "good";
                foodContainer.addChild( img );
                img.x = 20 + i*220; 
            }
        }
    };
    
    // generate random food
    p.tick = function(event){
        // move all the food
        var needToRemove = []; 
        var numFood = foodContainer.numChildren;
        for( var i=0; i<numFood; i++){
            var food = foodContainer.getChildAt(i);
            if(food !=null){
                food.y += 5;
                // check catch or not
                for(j=0; j<plantContainer.numChildren; j++){
                    var plant = plantContainer.getChildAt(j);
                    var point = foodContainer.localToGlobal(food.x, food.y);
                    var localP = plant.globalToLocal( point.x, point.y);
                    if( plant && plant.hitTest(localP.x, localP.y)){
                        needToRemove.push(food);
                        console.log("plants get a food");
                        if( food.nature=="good"){
                            console.log("score!");
                            score +=50;
                            scoreTxt.text = score;
                        }else{
                            // lose a life
                            window.gameSound.playEffect("wrongSnd");
                            if(lifeContainer.numChildren!=0){
                                var life =lifeContainer.getChildAt(lifeContainer.numChildren-1);
                                if( life.currentFrame ==0){
                                    life.gotoAndStop("half");
                                }else{
                                    lifeContainer.removeChild(life);
                                }                            
                            }else{
                                createjs.Ticker.removeEventListener("tick", p.tick);
                                scoreTxt.text="You Lose!";
                            }
                        }
                        j = plantContainer.numChildren;
                    }
                }
            }
        }
        
        if( needToRemove.length!=0){
            do{
                food = needToRemove.pop();
                foodContainer.removeChild(food);
            }while( needToRemove.length!=0);

            // add new food
            p.addFood();
        }    
        
        stage.update();
    };
    
    onClickPlant = function(event){
        var plant = event.currentTarget;
        if( plant.state=="close"){
            plant.gotoAndStop("open");
            plant.state ="open";
        }else{
            plant.gotoAndStop("close");
            plant.state ="close";
        }
    }

    window.gameScreen = createjs.promote(gameScreen, "Container");
}());


