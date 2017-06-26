var guessedLetters = [];
var artists = [];
var artistsDisplayed, artistToGuess; 

//Largely copied from W3School's documents on XMLHttpRequest object and XML Parsing
// https://www.w3schools.com/xml/xml_parser.asp
var XMLRequest = new XMLHttpRequest();
XMLRequest.open("GET", "http://api.7digital.com/1.2/artist/bytag/top?tags=pop&pageSize=50&country=ww&oauth_consumer_key=7dh7vfe3ydzu&", true)
XMLRequest.send();

XMLRequest.onreadystatechange = function () {
	if (this.readyState == 4 && this.status == 200) {
		var artistXML = XMLRequest.responseXML.getElementsByTagName("sortName");
		for(var i = 0; i < artistXML.length; i++)	
			artists.push(artistXML[i].childNodes[0].nodeValue.toUpperCase());		
		newGame();
	}
};

//What to do when user presses a key on the page
document.onkeypress = function hangmanFunction(event) {
	//get the keypress and make it uppercase for easy comparison
	var keyChar = event.key.toUpperCase();
	//do stuff if user pressed a string
	if ((keyChar.match(/[A-Z]/))){
		//do stuff if this is a new guess
		if(guessedLetters.indexOf(keyChar) < 0) {
			guessedLetters.push(keyChar)
			//do stuff if the guess is in the artistToGuess
			if (artistToGuess.includes(keyChar)){
				var index = artistToGuess.indexOf(keyChar);
				var subString = artistToGuess;
				do {
					artistsDisplayed[index] = keyChar;
					subString = (subString.substr(subString.indexOf(keyChar)+1));
					index += subString.indexOf(keyChar) + 1;
				} while(subString.indexOf(keyChar) > -1);
				if(artistsDisplayed.join("")===artistToGuess)
					problemSolved(artistToGuess);
			}
		document.getElementById("wordToGuess").textContent = artistsDisplayed.join("");
		document.getElementById("guessedWords").textContent = guessedLetters.join(" ");
		}
	}
}

//function that takes in a word and returns it as an array of characters
function makeHangWord(mysteryWord) {
	var unsolved = [];
	//create a character array with blanks from the mysteryWord
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
}

//function to do stuff when correct arist is identified
function problemSolved(artist) {
	var videoXML = new XMLHttpRequest();
	videoXML.open("GET", 'https://www.googleapis.com/youtube/v3/search?part=' +
		'snippet&maxResults=1&videoEmbeddable=true&q=' + artist + '&type=video&key=AIzaSyDPYQ9lfI14PArEqd1GpWGbZ7IudqDt3sA', 
		true);
	videoXML.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200){
		// 	console.log("video end");
			var video = JSON.parse(videoXML.responseText);
			// console.log(video.items[0].id.videoId);
			document.getElementById("videoSpot").innerHTML = '<iframe ' +
			'width="560" height="315" src="http://www.youtube.com/embed/' + video.items[0].id.videoId + 
			'?autoplay=1"></iframe>';
		}
	}
	videoXML.send();

	alert("Problem Solved");
	newGame();
}

//function to get a new element from our array and write it to html
function newGame() {
	//Pick a random word from my array
	artistToGuess = artists[Math.floor(Math.random()*artists.length)];
	artistsDisplayed = makeHangWord(artistToGuess);
	guessedLetters.length = 0;

	//push the array to the document without commas
	document.getElementById("wordToGuess").textContent = artistsDisplayed.join("");
	document.getElementById("guessedWords").textContent = guessedLetters.join(" ");
	console.log(artistToGuess);
}
