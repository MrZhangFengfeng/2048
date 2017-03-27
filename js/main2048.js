var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startX =0;
var startY =0;
var endX =0;
var endY =0;


$(document).ready(function(){
	newgame();
});

function newgame(){
    //为移动端做准备
    prepareForMobile();
	//初始化游戏
	init();
	//在随机两个格子生成数字
	gengerateOneNumber();
	gengerateOneNumber();
}

function prepareForMobile(){

    if(documentWidth>=500){
        $('.mainBox').css('width','500px');
        $('.mainBox').css('margin','0 auto');
        gridContainerWidth=500;
        cellSpace=20;
        cellSideLength=100;
    }

    $('#grid-container').css('width',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function init() {
	for (var i = 0; i < 4; i++){
		for (var j = 0; j < 4; j++){
			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
		}
	}

	for(var i=0;i<4;i++){
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for (var j = 0; j<4; j++) {
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}  
	} 
	updateBoardView();
    $('#score').text(0);
}

function updateBoardView(){
	$(".number-cell").remove();
	for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
        	$("#grid-container").append('<div class="number-cell" id="number-cell-'+ i +'-'+ j +'"></div>' );
        	var theNumberCell = $('#number-cell-'+i+'-'+j);

        	if(board[i][j]==0){
        		theNumberCell.css('width','0px');
        		theNumberCell.css('height','0px');
        		theNumberCell.css('top',getPosTop(i,j));
        		theNumberCell.css('left',getPosLeft(i,j));
        	}else{
        		theNumberCell.css('width',cellSideLength);
        		theNumberCell.css('height',cellSideLength);
        		theNumberCell.css('top',getPosTop(i,j));
        		theNumberCell.css('left',getPosLeft(i,j));
        		theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
        		theNumberCell.css('color',getNumberColor(board[i][j]));
        		theNumberCell.text(board[i][j]);
        	}
        	hasConflicted[i][j] = false;
        }
	$('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

function gengerateOneNumber(){
	if(nospace(board)){
		return false;
	}
	//随机一个位置
	var randx = parseInt(Math.floor(Math.random()*4));
	var randy = parseInt(Math.floor(Math.random()*4));

    var num=0;
	while(num<50){
       if(board[randx][randy]==0)
       		break;

      randx = parseInt(Math.floor(Math.random()*4));
	  randy = parseInt(Math.floor(Math.random()*4));
      num++;
	}
    
    if(num==50){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }

	//随机一个数字
	var randNumber = Math.random() <= 0.5 ? 2:4;
	//在随机位置放随机数字
	board[randx][randy] = randNumber;
	showNumberWithAnination(randx,randy,randNumber);

	return true;
}

$(document).keydown(function(){
	switch(event.keyCode){
        case 37://left
            event.preventDefault();
            if(moveLeft()){
            	setTimeout("gengerateOneNumber()",210);
            	setTimeout("isgameover()",300);
            }
        	break;

        case 38://up
            event.preventDefault();
        	if(moveUp()){
            	setTimeout("gengerateOneNumber()",210);
            	setTimeout("isgameover()",300);
            }
        	break;

        case 39://right
            event.preventDefault();
        	if(moveRight()){
            	setTimeout("gengerateOneNumber()",210);
            	setTimeout("isgameover()",300);
            }
        	break;

        case 40://down
            event.preventDefault();
       		if(moveDown()){
            	setTimeout("gengerateOneNumber()",210);
            	setTimeout("isgameover()",300);
            }
        	break;

        default:
       	    break;
	}
});

document.addEventListener('touchstart',function(event){
    event.preventDefault();

    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;

});

document.addEventListener('touchend',function(event){
    event.preventDefault();

    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;

    var deltaX = endX - startX;
    var deltaY = endY - startY;

    if(Math.abs(deltaX) < 0.2*documentWidth && Math.abs(deltaY) < 0.2*documentWidth){
        return;
    }

    if(Math.abs(deltaX) >= Math.abs(deltaY)){
        if(deltaX>0){
            //向左
            if(moveRight()){
                setTimeout("gengerateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }else{
            //向右
            if(moveLeft()){
                setTimeout("gengerateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
    else{
        if(deltaY>0){
            //向下
            if(moveDown()){
                setTimeout("gengerateOneNumber()",210);
                setTimeout("isgameover()",300);
            }

        }else{
            //向上
            if(moveUp()){
                setTimeout("gengerateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
});

function isgameover(){
	if(nospace() && nomove()){
		gameover();
	}
}

function gameover(){
	alert('GameOver!');
}

function moveLeft(){
	if(!canMoveLeft(board))
      return false;
    //moveLeft
    for(var i=0;i<4;i++){
    	for(var j=1;j<4;j++){
    		if(board[i][j]!=0) {
    			for(var k=0;k<j;k++){
    				if(board[i][k]==0 && noBlockLeft(i,k,j,board)){
    					//moveLeft
    					showMoveAnimation(i,j,i,k);
    					board[i][k] = board[i][j];
    					board[i][j] = 0;
    					continue;
    				}else if( board[i][k]==board[i][j] && noBlockLeft(i,k,j,board) && hasConflicted[i][k]!=true ){
    					//move
    					showMoveAnimation(i,j,i,k);
    					//add
    					board[i][k] += board[i][j];
    					board[i][j] = 0;

    					score += board[i][k];
    					updateScore(score);
                        
    					hasConflicted[i][k] = true;	
    				}
    				continue;
    			}
    		}
    	}
    }
    setTimeout("updateBoardView()",200);
	return true;
}


function moveUp(){
	if(!canMoveUp(board))
      return false;
    //moveUp
    for(var i=1;i<4;i++){
    	for(var j=0;j<4;j++){
    		if(board[i][j]!=0) {
    			for(var k=0;k<i;k++){
    				if(board[k][j]==0 && noBlockUp(j,k,i,board)){
    					//moveUp
    					showMoveAnimation(i,j,k,j);
    					board[k][j] = board[i][j];
    					board[i][j] = 0;
    					continue;
    				}else if(board[k][j]==board[i][j] && noBlockUp(j,k,i,board) && hasConflicted[k][j]!=true){
    					//move
    					showMoveAnimation(i,j,k,j);
    					//add
    					board[k][j] += board[i][j];
    					board[i][j] = 0;

    					score += board[k][j];
    					updateScore(score);

    					hasConflicted[k][j] = true;
    				}
    				continue;
    			}
    		}
    	}
    }
    setTimeout("updateBoardView()",200);
	return true;
}

function moveRight(){
	if(!canMoveRight(board))
      return false;
    //moveRight
    for(var i=0;i<4;i++){
    	for(var j=2;j>=0;j--){
    		if(board[i][j]!=0) {
    			for(var k=3;k>j;k--){
    				if(board[i][k]==0 && noBlockRight(i,k,j,board)){
    					//moveRight
    					showMoveAnimation(i,j,i,k);
    					board[i][k] = board[i][j];
    					board[i][j] = 0;
    					continue;
    				}else if(board[i][k]==board[i][j] && noBlockRight(i,k,j,board) && hasConflicted[i][k]!=true){
    					//move
    					showMoveAnimation(i,j,i,k);
    					//add
    					board[i][k] += board[i][j];
    					board[i][j] = 0;

    					score += board[i][k];
    					updateScore(score);

    					hasConflicted[i][k] = true;
    				}
    				continue;
    			}
    		}
    	}
    }
    setTimeout("updateBoardView()",200);
	return true;
}

function moveDown(){
	if(!canMoveDown(board))
      return false;
    //moveDown
    for(var i=2;i>=0;i--){
    	for(var j=0;j<4;j++){
    		if(board[i][j]!=0) {
    			for(var k=3;k>i;k--){
    				if(board[k][j]==0 && noBlockDown(j,k,i,board)){
    					//moveDown
    					showMoveAnimation(i,j,k,j);
    					board[k][j] = board[i][j];
    					board[i][j] = 0;
    					continue;
    				}else if(board[k][j]==board[i][j] && noBlockDown(j,k,i,board) && hasConflicted[k][j]!=true){
    					//move
    					showMoveAnimation(i,j,k,j);
    					//add
    					board[k][j] += board[i][j];
    					board[i][j] = 0;

    					score += board[k][j];
    					updateScore(score);

    					hasConflicted[k][j] = true;
    				}
    				continue;
    			}	
    		}
    	}
    }
    setTimeout("updateBoardView()",200);
	return true;
}
