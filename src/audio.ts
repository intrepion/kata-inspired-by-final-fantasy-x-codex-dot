let context:AudioContext|undefined,timer:number|undefined,step=0;
export function setMusic(on:boolean){
 if(!on){if(timer)window.clearInterval(timer);timer=undefined;void context?.suspend();return;}
 context??=new AudioContext();void context.resume();if(timer)return;
 const notes=[146.83,220,293.66,329.63,261.63,220,164.81,196];
 const play=()=>{if(!context||context.state!=='running')return;const osc=context.createOscillator(),gain=context.createGain();osc.type='sine';osc.frequency.value=notes[step++%notes.length];gain.gain.setValueAtTime(0,context.currentTime);gain.gain.linearRampToValueAtTime(.045,context.currentTime+.12);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+1.9);osc.connect(gain);gain.connect(context.destination);osc.start();osc.stop(context.currentTime+2);};
 play();timer=window.setInterval(play,1100);
}
