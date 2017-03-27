function showNumberWithAnination(i,j,random){
		var numberCell = $('#number-cell-'+i+'-'+j);

		numberCell.css('background-color',getNumberBackgroundColor(random));
		numberCell.css('color',getNumberColor(random));
		numberCell.text(random);

		numberCell.animate({
			width:cellSideLength,
			height:cellSideLength,
			top:getPosTop(i,j),
			top:getPosTop(i,j)
		},50)
}

function showMoveAnimation(fromx,fromy,tox,toy) {
	var numberCell = $('#number-cell-'+fromx+'-'+fromy);
	numberCell.animate({
		top:getPosTop(tox,toy),
		left:getPosLeft(tox,toy)
	},200);
}
function updateScore(score){
	$('#score').text(score);
}