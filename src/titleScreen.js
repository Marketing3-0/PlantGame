/* 
 * This is the title screen to handle the game title
 * 
 * It should do the following:
 * 1. setup the title screen
 * 2. get the asset map from caller
 * 3. controls the screen flows and states of the game
 * 4. it should interact withe other classes  
 */
(function() {
    var titleBk, titleAni, playBtn, tutorialBtn;
    
    var screenHolder = new createjs.Container();
    var currentScreen;    
    var assetMap ={};
    var gameSound;
    var tweenDone= true;
    
    function titleScreen() {
        this.Container_constructor();
        assetMap = window.loader;
        gameSound = window.gameSound;
        this.buildUI();
    }
    
    var p = createjs.extend(titleScreen, createjs.Container);

    p.buildUI = function(){
        titleBk = new createjs.Bitmap(assetMap.getResult("_titleBk"));
        var img1 = new createjs.Bitmap(assetMap.getResult("_playOut"));
        var img2 = new createjs.Bitmap(assetMap.getResult("_playOver"));
        playBtn = new Button(img1,img2);
        tutorialBtn = new createjs.Bitmap(assetMap.getResult("_tutorialBtnBk"));

        var spriteSheet = new createjs.SpriteSheet({
                        framerate: 30,
                        "images": [assetMap.getResult("_titleAni")],
                        "frames": {"regX": -46.7, "height": 966.05, "count": 64, "regY": -141.45, "width": 460.35},
                        // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                        "animations": {
                                "run": [0, 343, "run"]
                        }
                });
        titleAni = new createjs.Sprite(spriteSheet, "run");
        //titleAni.scaleX = titleAni.scaleY = 0.8;
        titleAni.x= 256.40;
        titleAni.y= 74.05;
        titleAni.gotoAndPlay("run");
        playBtn.x = 140;
        playBtn.y = 260;
        tutorialBtn.x = 120;
        tutorialBtn.y = 360;    
        playBtn.addEventListener("click", handleGameStart);
        tutorialBtn.addEventListener("click", handleTutorialScreen);
        cursor = new createjs.Bitmap(assetMap.getResult("_cursor"));
        cursor.x = stage.mouseX;
        cursor.y = stage.mouseY;
        this.addChild(titleBk, playBtn, tutorialBtn, cursor);
        cursor.name ="theCursor";
        screenHolder.addChild(this);
        screenHolder.name="holderTitleScr";
        stage.addChild(screenHolder);
        // hide the system cursor
        stage.cursor = 'none';    
        stage.canvas.style.cursor = "none";
        stage.addEventListener("stagemousemove", onMouseMove);
        var src = window.loader.getResult("bgMusic");
        gameSound.playMusicOnce("bgMusic");
    };

    onMouseMove = function(event){
        cursor.x = stage.mouseX;
        cursor.y = stage.mouseY;
        window.stage.update();
    };
    
    handleGameStart = function(event){
        gameSound.playEffect("rightSnd");
        console.log("Should switch to game screen");
        currentScreen = new gameScreen();
        console.log("game's numENCHILDR : "+ currentScreen.numChildren);
        //game.x = window.STAGE_WIDTH;
        window.stage.addChild(currentScreen);
        createjs.Tween.get(screenHolder).to({x: -window.STAGE_WIDTH}, 1000, createjs.Ease.linear).call(p.tweenComplete);
        createjs.Tween.get(currentScreen).to({x: 0}, 1000, createjs.Ease.linear).call(onCurrentIn);
    }
    
    onCurrentIn = function(){
        console.log("game screen should in.");
    }
    
    p.tweenComplete =function(){
        currentScreen.startPlay();
        
        while( screenHolder.numChildren >=1 ){
            screenHolder.removeChildAt(screenHolder.numChildren-1);
        };
        screenHolder.x =0;
        screenHolder.addChild(currentScreen);
        stage.addChildAt(cursor, stage.numChildren);
        stage.addEventListener("screenChange", onHandleScreenChange);
        stage.update();	
    };
    

    
    onHandleScreenChange = function(event){
        console.log("get events from tutorial.");
        while( screenHolder.numChildren >=1 ){
            screenHolder.removeChildAt(screenHolder.numChildren-1);
        };
        
        if( event.data == window.GAMESCREEN){
            currentScreen = new gameScreen();
            currentScreen.buildUI();
            currentScreen.startPlay();
        }
        screenHolder.addChild(currentScreen);
        stage.addChildAt(cursor, stage.numChildren);
        currentScreen.addEventListener("screenChange", onHandleScreenChange);
        stage.update();
    };
    
    // when players click on tutorial, will add the tutorial to the screen
    handleTutorialScreen = function(event){
        while( screenHolder.numChildren >=1 ){
            screenHolder.removeChildAt(screenHolder.numChildren-1);
        };
        var instance=createjs.Sound.play(window.loader.getResult("rightSnd"));
        if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) {
            console.log("Sound effect fails");
            return;
	}
        currentScreen = new TutorialScreen();
        screenHolder.addChild(currentScreen);
        for(var i=0; i<screenHolder.numChildren; i++){
            var obj = screenHolder.getChildAt(i);
            console.log("screenHolder's child "+i +": " + obj);
        }
        
        for(i=0; i<currentScreen.numChildren; i++){
            obj = currentScreen.getChildAt(i);
            console.log("For currentScreen, child "+i +": " + obj);
        }
        
        stage.addChildAt(cursor, stage.numChildren);
        for(i=0; i<stage.numChildren; i++){
            obj = stage.getChildAt(i);
            console.log("For Stage, child "+i +": " + obj);
        }
        stage.addEventListener("screenChange", onHandleScreenChange);
        stage.update();
    };    

    window.GAMESCREEN ="gameScreen";
    window.titleScreen = createjs.promote(titleScreen, "Container");
}());


