const midi = require('midi');
 
var input = new midi.Input();
console.log('미디 포트의 수');
console.log(input.getPortCount());
console.log('미디 포트의 이름');
console.log(input.getPortName(0));

var data = [];
var status = [];
var start = false;
var prevevent = 0;

input.on('message', function(deltaTime, message) {
	//console.log('m:' + message + ' d:' + deltaTime);
	if(message[0] == 147){
		//채널4에 들어온 note on이면
		if(start == false){
			//아직 곡 시작 안 한 상태면
			start = new Date().getTime();
			status[message[1]] = false;
			console.log('0: 곡 시작');
		}
		else{
			//곡 시작했으면
			now = (new Date().getTime()) - start;
			
			//1ms 보정
			if(now-1 == prevevent){ now = prevevent; }
			else{ prevevent = now; }
			
			console.log(now +': '+ message[1] +', '+ message[2]);
			
			if(message[2] > 10){
				//ON
				status[message[1]] = now;
			}
			else{
				//OFF
				if(status[message[1]] != false){
					//console.log(status[message[1]] +'~'+ now);
					status[message[1]] = false;
				}
			}
		}
	}
	//console.log(message[0]);
});
input.openPort(0);

setTimeout(function() {
	//input.closePort();
}, 10000);

console.log('ㅎㅇ');