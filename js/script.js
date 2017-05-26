var chess=document.getElementById('chess');
var reset=document.getElementById('reset');
var context=chess.getContext('2d');
var piece=true;
var over=false;
window.onload=function(){
		drewChessBoard();
		initWin();
		initBoard();
	}
//赢法数组
var wins=Array();
	for (var i = 0 ; i < 15; i++) {
		 wins[i]=Array();
		for (var j = 0; j < 15; j++) {	
				wins[i][j]=Array();
			}
		}

var count=0;
for (var i=0;i<15;i++){
	for (var j=0;j<11;j++){
		for (var k=0;k<5;k++){
			wins[i][j+k][count]=true;
		}
		count++;
	}
}

for (var i=0;i<11;i++){
	for (var j=0;j<15;j++){
		for (var k=0;k<5;k++){
			wins[i+k][j][count]=true;
		}
		count++;
	}
}

for (var i=0;i<11;i++){
	for (var j=0;j<11;j++){
		for (var k=0;k<5;k++){
			wins[i+k][j+k][count]=true;
		}
		count++;
	}
}

for (var i=0;i<11;i++){
	for (var j=14;j>3;j--){
		for (var k=0;k<5;k++){
			wins[i+k][j-k][count]=true;
		}
		count++;
	}
}
//赢法的统计数组
var myWin=Array();
var pcWin=Array();

var initWin=function(){
	for(var i=0;i<count;i++){
		myWin[i]=0;
		pcWin[i]=0;
	}
}

var chessBoard=Array();
var initBoard=function(){
	for (var i = 0 ; i < 15; i++) {
		 chessBoard[i]=Array();
		for (var j = 0; j < 15; j++) {	
				chessBoard[i][j]=0;
			}
		}
}

var drewChessBoard=function(){
	context.strokeStyle="#BFBFBF";
	for (var i=0;i<15;i++)
	{
		context.moveTo(15,15+30*i);
		context.lineTo(435,15+30*i);
		context.stroke();
		context.moveTo(15+30*i,15);
		context.lineTo(15+30*i,435);
		context.stroke();
	}
}

var oneStep = function(i,j,piece){
	context.beginPath();
	context.arc(15+i*30,15+j*30,10,0,2*Math.PI);
	context.closePath();
	context.stroke();
	var grd=context.createRadialGradient(15+i*30,15+j*30,1,15+i*30,15+j*30,10);
	if(piece){
		grd.addColorStop(0,"#636766");
		grd.addColorStop(1,"#000000");
	}else{
		grd.addColorStop(0,"#F9F9F9");
		grd.addColorStop(1,"#D1D1D1");
	}

	context.fillStyle=grd;
	context.fill();
}

chess.onclick=function(e){
	if(over){
		return;
	}
	if(!piece){
		return;
	}
	var x=e.offsetX;
	var y=e.offsetY;
	var j=Math.floor(x/30);
	var i=Math.floor(y/30);
	if(chessBoard[i][j]==0){
		oneStep(j,i,piece);
		chessBoard[i][j]=1;
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				myWin[k]++;
				pcWin[k]=8;
				if(myWin[k]==5){
					window.alert("恭喜，你赢了！")
					over=true;
				}
			}
		}
		if(!over){
			piece=!piece;
			pcAI();
		}	
	}
}
var pcAI=function(){
	var max=0;
	var u=0,v=0;
	var myScore=Array();
	var pcScore=Array();
		for(var i=0;i<15;i++){
			myScore[i]=Array();
			pcScore[i]=Array();
			for(var j=0;j<15;j++){
				myScore[i][j]=0;
				pcScore[i][j]=0;
		}
	}
	for (var i=0;i<15;i++){
		for (var j=0;j<15;j++){
			if(chessBoard[i][j]==0){
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k]==1){
							myScore[i][j]+=200;
						}else if(myWin[k]==2){
							myScore[i][j]+=400;
						}else if(myWin[k]==3){
							myScore[i][j]+=2000;
						}else if(myWin[k]==4){
							myScore[i][j]+=10000;
						}
						if(pcWin[k]==1){
							pcScore[i][j]+=220;
						}else if(pcWin[k]==2){
							pcScore[i][j]+=440;
						}else if(pcWin[k]==3){
							pcScore[i][j]+=2100;
						}else if(pcWin[k]==4){
							pcScore[i][j]+=20000;
						}
					}
				}
				if(myScore[i][j]>max){
					max=myScore[i][j];
					u=i;
					v=j;
				}	else if(myScore[i][j]==max){
					if(pcScore[i][j] > pcScore[u][v]){
					    u = i;
					    v = j;    
					}
				}
				if(pcScore[i][j] > max){
				    max  = pcScore[i][j];
				    u = i;
				    v = j;
				}	else if(pcScore[i][j] == max){
				    if(myScore[i][j] > myScore[u][v]){
				        u = i;
				        v = j;    
				    }
				}
			}
		}
	}
	oneStep(v,u,false);
	chessBoard[u][v]=2;
	for(var k=0;k<count;k++){
		if(wins[u][v][k]){
			pcWin[k]++;
			myWin[k]=8;
			if(pcWin[k]==5){
				window.alert("别气馁，再接再厉！")
				over=true;
			}
		}
	}
	if(!over){
		piece=!piece;
	}	
}
reset.onclick=function(){
	context.clearRect(0,0,450,450);
	context.beginPath();
	drewChessBoard();
	initWin();
	initBoard();
	piece=true;
	over=false;
}	