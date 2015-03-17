/* 
 * The facilitate class for game sound.
 * So music can be played in loop  played once, pauseed, resumed
 * 
 */

(function() {
var soundVol, effectVol, currentMusic, currentEffect, isSongPlaying, instance, instanceEff;

function GameSound() {
    this.EventDispatcher_constructor();
}
var p = createjs.extend(GameSound, createjs.EventDispatcher);



p.playMusicOnce = function( music ) {    
    instance = createjs.Sound.play(music);  // play using id.  should be a string defined in the main html's loader class
    if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) {
        console.log("Game Sound, playing music once fails");
	return;
    }
    instance.addEventListener("complete", p.handleSoundOnceComplete, "MUSIC");
    instance.volume = window.SOUND_VOL;
    isSongPlaying = true;
    currentMusic = music;
};

p.playMusicInLoop = function (music) {
    instance = createjs.Sound.play(music,{loop: -1});  // play using id.  should be a string defined in the main html's loader class
    if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) {
        console.log("Game Sound, playing music once fails");
	return;
    }
    currentMusic = music;
    instance.volume = window.SOUND_VOL;
    isSongPlaying = true;
};

p.handleSoundOnceComplete = function(event, type) {       
    var theinstance = event.currentTarget;
    theinstance.removeEventlistener("complete", p.handleSoundOnceComplete, type);
    
    if(type=="EFFECT")
        currentEffect ="";
    else{
        currentMusic="";    
        isSongPlaying = false;
    } 
};

p.playEffect = function(eff){
    instanceEff = createjs.Sound.play(eff);  // play using id.  should be a string defined in the main html's loader class
    if (instanceEff == null || instanceEff.playState == createjs.Sound.PLAY_FAILED) {
        console.log("Game Sound, playing sound eff fails");
	return;
    }
    instanceEff.addEventListener("complete", p.handleSoundOnceComplete, "EFFECT");
    instance.volume = window.SOUND_VOL;
    currentEffect = eff;    
};

p.stopAll = function(){
    if(instance)
        instance.stop();
    if(instanceEff)
        instanceEff.stop();
}


window.SOUND_VOL =0.5;
window.EFFECT_VOL=1;
window.GameSound = createjs.promote(GameSound, "EventDispatcher");
}());
