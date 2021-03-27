const fs = require('fs');
const midi = require('midi');
 
var input = new midi.Input();
console.log('미디포트 '+ input.getPortCount() +'개');
console.log(input.getPortName(0));

//변수 초기화
var data = [];
var status = [];
var start = false;
var prevevent = 0;

//미디 이벤트 들어왔을 때
input.on('message', function(deltaTime, message){
	//채널4 NOTE ON
	//147: 4, 146: 3
	if(message[0] == 147){
	//if(message[0] == 147 || message[0] == 146){
		if(start == false){
			start = new Date().getTime();
			status[message[1]] = false;
			console.log('0: 곡 시작');
		}
		else{
			now = (new Date().getTime()) - start;
			
			//1ms 보정
			if(now-1 == prevevent){ now = prevevent; }
			else{ prevevent = now; }
			
			console.log(now +': '+ message[1] +', '+ message[2]);
			
			//캡처 종료신호 (C0 NOTE ON)
			if(message[1] == 0)
				fileexport();
			
			//ON / OFF
			if(message[2] > 10){
				noteoff(message[1], status[message[1]], now);
				status[message[1]] = now;
			}
			else
				noteoff(message[1], status[message[1]], now);
		}
	}
	//채널4 NOTE OFF
	else if(message[0] == 131){
		noteoff(message[1], status[message[1]], now);
	}
});

//NOTE OFF
function noteoff(pos, start, end){
	if(status[pos] != false && status[pos] != undefined){
		if(start < end){
			status[pos] = false;
			data.push([pos,start,end]);
		}
	}
}

//캡처 종료
function fileexport(){
	console.log('캡처 종료');
	console.log(data);
	fs.writeFileSync('./result.json', JSON.stringify(data));
	process.exit();
}

input.openPort(0);