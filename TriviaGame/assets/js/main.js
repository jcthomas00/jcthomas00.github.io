
var counterInterval, quizes = [];
var TIME_LIMIT = 5;
var ROUND_LENGTH = 3;

//object to keep score for each round
var score = {
	correct: 0,
	incorrect: 0,
	unanswered: 0,
	numQuestions: ROUND_LENGTH,
	reset : function() {
		this.correct = 0;
		this.incorrect = 0;
		this.unanswered = 0;
	}
}

//quiz object with constructor
function quiz(question, choices, correctIndex) {
	this.question = question;
	this.choices = choices;
	this.correctIndex = correctIndex;
}

//timer object to countdown seconds to answer
var timer = {
	time : TIME_LIMIT,
	running : false,
	start : function() {
			if (this.running === false) {
				this.running = true;
				counterInterval = setInterval(timer.countdown, 1000);
			}
	},
	countdown : function() {
		if (timer.time > 0) {
			$('#timer').html(--timer.time);
		}
		else {
			$('#timer').html("time's up!");	
			wrongAnswer(true);
		}
	}
}


$.getJSON('https://opentdb.com/api.php?amount=50&category=31&type=multiple', 
	function(data){	
		var result = data.results, tempArray, randomIndex, tempVal;
		//parse data and make array of quiz objects
		$.each(result, function(index, item){
			tempArray = item.incorrect_answers; 
			tempArray.push(item.correct_answer);//push correct ans at end
			//randomize position of correct answer:
			randomIndex = Math.floor(Math.random()*tempArray.length);//get rand index
			tempVal = tempArray[randomIndex];//store val of rand index
			tempArray[randomIndex] = tempArray[tempArray.length-1];//move correct ans to rand index
			tempArray[tempArray.length-1] = tempVal;//move temp val into last spot
			//put quiz object into quiz array
			quizes.push(new quiz(item.question, tempArray, randomIndex));
		});
});

function populateData(data) {

	for (var i = Things.length - 1; i >= 0; i--) {
		Things[i]
	}
	console.log(data.results);
}

$(document).ready(function(){
	$('#overlay').hide();//hide the disable box
	$('#result-section').hide();//no results to display yet, so hide it

	//start trivia round
	$('#go').on('click', function(){
		$('#question-section').show();
		$('#result-section').hide();

		score.reset();
		$(this).slideUp("slow");
		nextQuestion();
	});

	//what to do when an answer is selected
	$('#answer-choices').on('click', function(e){
		if(e.target.value === curQuiz.correctIndex)
		{
			wrongAnswer(false);
		} else {
			wrongAnswer(true);
		}
		e.preventDefault();//need this to prevent document from reloading
	});	
});//end of document.ready

//get the next question
function nextQuestion() {
		$('#overlay').hide();//make window clickable	

		if ((score.correct + score.incorrect + score.unanswered) < score.numQuestions) {
			//get a random question from quizes array
			curQuiz = quizes[Math.floor(Math.random()*quizes.length)];
	console.log(curQuiz.correctIndex);
			//show the question and choices with a slide up animation
			$("#question").html(curQuiz.question).hide();
			$('#question').slideDown("slow");	
			$('#answer-choices').html(makeList(curQuiz.choices)).hide();
			$('#answer-choices').slideDown("slow");
			//reset timer
			timer.time = TIME_LIMIT;
			timer.start();
			//reset the result area
			$('#result').removeClass();
			$('#result').html("");
		} else {
			$('#question-section').hide();
			$('#result-section').show();
			$('#correct').html(score.correct);
			$('#incorrect').html(score.incorrect);
			$('#unanswered').html(score.unanswered);
			$('#go').html("Play Again!").slideDown("slow");
		}
}

//takes a quiz object and returns the choices in <li>
function makeList(answerList){
	var list = "";
	var listItem = document.createElement('li');		
	for (var i = 0; i< answerList.length; i++){
		listItem.innerHTML = answerList[i] ;
		listItem.value = i;
		list += listItem.outerHTML;
	}
	return list;
}

//show the correct answer	
function wrongAnswer(wrongFlag) {
		clearInterval(counterInterval);
		timer.running = false;
	$('#overlay').show();//disable page

	if (wrongFlag){
		if($('#timer')[0].innerHTML === "time's up!"){
			score.unanswered++;
		}else {
			score.incorrect++;
		}
		$('#result').addClass("alert alert-danger");
		$('#result').html("Wrong! The  correct answer was " + curQuiz.choices[curQuiz.correctIndex]);
	}
	else {
		score.correct++;
		$('#result').addClass("alert alert-success");
		$('#result').html("You got the correct answer: " + curQuiz.choices[curQuiz.correctIndex]);
	}	
	//wait 5 seconds, then show the next question
	window.setTimeout(nextQuestion, 5000);
}
