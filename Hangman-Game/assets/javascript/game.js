var artists = []; //array of dynamically populated artists
var MAX_GUESSES = 9; //pre-defined guess-limit
var bingSound = new sound("assets/sounds/ding.wav"); //location of sound asset

function HHHangman()  {
	var guessedLetters = [];
	var artistsDisplayed, artistToGuess, incorrectGuesses;
	//method to get a new element from our array and write it to html
	this.newGame = function() {
		//pick a random word from artists array
		artistToGuess = artists[Math.floor(Math.random()*artists.length)];
		artistsDisplayed = this.makeHangWord(artistToGuess);
		guessedLetters.length = 0;
		incorrectGuesses = MAX_GUESSES;

		//push the array to the document without commas
		pushToPage("wordToGuess", artistsDisplayed.join(""));
		pushToPage("guessedWords", guessedLetters.join(" "));
		pushToPage("remainingGuesses", incorrectGuesses);
	},

	//method that takes in a word and returns it as an array of characters
	this.makeHangWord = function(mysteryWord) {
		var unsolved = [];
		//create a character array with * from the mysteryWord
		//user only guesses letters, any other characters are already shown
		for (var i = 0; i < mysteryWord.length; i++) {
			if(mysteryWord[i].match(/[A-Z]/)){
				unsolved.push("*");
			}
			else{
				unsolved.push(mysteryWord[i]);
			}
		}
		return unsolved;
	},

	//method to do stuff when correct arist is identified
	this.problemSolved = function(artist, gaveUp) {
		var videoXML = new XMLHttpRequest();
		videoXML.open("GET", 'https://www.googleapis.com/youtube/v3/search?part=' +
			'snippet&maxResults=1&videoEmbeddable=true&q=' + artist + '&type=video&key=AIzaSyDPYQ9lfI14PArEqd1GpWGbZ7IudqDt3sA', 
			true);
		videoXML.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200){
				var video = JSON.parse(videoXML.responseText);
				if (gaveUp === false)
					pushToHTML("result", '<span class="alert alert-success">You got it!' +
					' The answer was ' + artist + '</span>');
				else 
					pushToHTML("result", '<span class="alert alert-danger"> The answer ' +
					'was ' + artist + '. Try again!</span>');
				pushToHTML("videoSpot", '<br><iframe width="100%" height="300px" ' +
					'src="https://www.youtube.com/embed/' + 
					video.items[0].id.videoId + '?autoplay=1"></iframe>');
			}
		}
		videoXML.send();
		this.newGame();
	}
	this.giveUp = function () {
		this.problemSolved(artistToGuess, true);
	},

	//Function to process user input
	this.analyzeInput = function (keyChar) {
		//do stuff if this is a new guess
		if(guessedLetters.indexOf(keyChar) < 0) {
			guessedLetters.push(keyChar);
			pushToPage("guessedWords", guessedLetters.join(" "));
			//do stuff if the guess is in the artistToGuess
			if (artistToGuess.includes(keyChar)){
				bingSound.play();
				var index = artistToGuess.indexOf(keyChar);
				var subString = artistToGuess;
				do {
					artistsDisplayed[index] = keyChar;
					subString = (subString.substr(subString.indexOf(keyChar)+1));
					index += subString.indexOf(keyChar) + 1;
				} while(subString.indexOf(keyChar) > -1);
				pushToPage("wordToGuess", artistsDisplayed.join(""))

				//All letters correctly guessed
				if(artistsDisplayed.join("")===artistToGuess) {
					this.problemSolved(artistToGuess, false);
				}
			}
			else {
				incorrectGuesses--;

			}
			pushToPage("remainingGuesses", incorrectGuesses)
			if (incorrectGuesses <= 0)
				this.giveUp();
		}
	
	}
}//end of HHHangman object

var myHangman = new HHHangman();
//Get a list of top 50 hip-hop artists using 7Digital API
var XMLRequest = new XMLHttpRequest();
XMLRequest.open("GET", "https://api.7digital.com/1.2/artist/bytag/top?tags=hip-hop/rap,pop&pageSize=50&country=ww&oauth_consumer_key=7dh7vfe3ydzu&", true)
XMLRequest.send();
XMLRequest.onreadystatechange = function () {
	if (this.readyState == 4 && this.status == 200) {
		var artistXML = XMLRequest.responseXML.getElementsByTagName("sortName");
		for(var i = 0; i < artistXML.length; i++)	
			artists.push(artistXML[i].childNodes[0].nodeValue.toUpperCase());	
		//Start the game, now that our array is populated	
		myHangman.newGame();
	}
};

//What to do when user presses a key on the page
document.onkeypress = function hangmanFunction(event) {
	//get the keypress and make it uppercase for easy comparison
	var keyChar = event.key.toUpperCase();
	//do stuff if user pressed a string
	if ((keyChar.match(/[A-Z]/))){
		myHangman.analyzeInput(keyChar);
	}
}

//Function to send text to the HTML doc
var pushToPage = function(elemendId, textInput) {
	document.getElementById(elemendId).textContent = textInput;
}

//Function to send HTML code to the HTML doc
var pushToHTML = function(elemendId, htmlInput) {
	document.getElementById(elemendId).innerHTML = htmlInput;
}

//Function activated when user clicks 'Give Up' button
function giveUp() {
	myHangman.giveUp();
}

//copied from w3schools to create ding sound
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}