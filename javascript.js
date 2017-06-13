$("#button1").on("click", function() {
	$("#box").animate({height:"+=30", width:"+=30"}, "fast");
});

$("#button2").on("click", function() {
	$("#box").css("background-color", "blue");
});

$("#button3").on("click", function() {
	$("#box").css("opacity","-=.1");
});

$("#button4").on("click", function() {
	location.reload(true);
});

$("#button5").on("click", function() {
	$("body").css("background-color", randomColor());
});

function randomColor() {
	var color = '#';
	var digits = '0123456789ABCDEF';

	for (var i = 0; i < 6; i++) {
		var randomDigit = Math.floor(Math.random()*digits.length);
		color += digits[randomDigit];
	}
	return color.toString();
}