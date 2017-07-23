//array with pre-loaded queeny emotions
var queen=["sad", "lost", "funny", "hot", "blessed", "flirty", "fat",
	"mad", "ugly", "sexy", "tired", "angry", "fabulous", "snatched"];

//convert array values to buttons
$.each(queen, function(key, value){
	addQueenyButton('#button-space', value);
});

//when go button is clicked create emotion button
$('#bring-back-my-girls').on('click', function(){
	if($('#emotion').val().length>0){//only do stuff if something is entered
		addQueenyButton('#button-space', $('#emotion').val());
		$('#emotion').val("");
	}
});

//switch still and animated images when it is clicked
$(document).on('click', 'img', function(){
	var source = $(this).attr("src");
	$(this).attr("src", $(this).attr("data-still"));
	$(this).attr("data-still", source);
	console.log(source);
});

//handle enter key in textbox
$(document).on('keyup', '#emotion', function(event){
	if(event.keyCode === 13)
		$('#bring-back-my-girls').click();
})

//mood button clicked - do ajax call based on val and prepend to gif area
$(document).on('click', '.queen-button', function(e){
	$("#gif-space").html("");//clear the gif-space for neatness
	$.ajax({
		url: "https://api.giphy.com/v1/gifs/search?api_key=241389a6668a4b08a31c90a1c62a556a&q="+
		$(this)[0].innerHTML+"-drag-race&limit=25&offset=0&rating=PG-13&lang=en",
		method: "GET"
	}).done(function(response){
		var tempDiv;
		//loop through reversed response(more relevent pics on bottom) 
		$(response.data.reverse()).each(function(key, value){
			tempDiv = $('<div class="thumbnail">').html( //create div w/still animated urls 
				$('<img class="gif-style" src="' + 
				response.data[key].images.fixed_width_still.url + 
				'" data-still="' + response.data[key].images.fixed_width.url + 
				'">')).append($('<div class="caption">').html('Rating: ' + 
				response.data[key].rating));		
			$("#gif-space").prepend(tempDiv);//add div to gif-space
		});
	});
})

//function to create and append a queeny button to given location 
function addQueenyButton(location, displayText){
	$(location).append($('<button>').text(displayText).addClass("btn queen-button rounded"));
}