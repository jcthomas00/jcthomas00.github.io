var character = function(name, baseHp, baseAp, counter, imgurl){
	this.isHero = false;
	this.name = name;
	this.hp = baseHp;
	this.baseAp = baseAp;
	this.counter = counter;
	this.baseHp = baseHp;
	this.ap = baseAp;
	this.img = imgurl;
	this.damage = function(damageVal){
		this.hp -= damageVal;
	}
	this.powerUp = function(){
		this.ap += baseAp;
	}
}

lordeSound = new Audio("assets/sounds/lorde.mp3");
noSound = new Audio("assets/sounds/no.mp3");
whatSound = new Audio("assets/sounds/what.mp3");
var curHero, curEnemy;

//create hero objects and put them in an array
var heroes = {
	lea : new character("Princess Lea", 120, 12, 14, "assets/img/lea.png"),
	spiderman : new character("Spiderman", 85, 20, 22, "assets/img/spiderman.png"),
	lorde : new character("Lorde", 100, 18, 17, "assets/img/lorde.png"),
	pocahontas : new character("Pocahontas", 180, 5, 12, "assets/img/pocahontas.png"),
};

$(document).ready(function(){
	//load images of heroes for user to select
	showThumbnails($(".hero-selection"), true);
	

	//do stuff when hero is selected
	$(".hero-selection .hero-selected").on("click", function(){
		curHero = heroes[$(this).data("hero-name")];
		curHero.isHero = true;
		showLargeImage($("#hero-space"), curHero, true);
		$(".hero-selection").slideToggle();
		$(".battle-section").removeClass("invisible");
		showThumbnails($("#enemy-select-space"), false);
	});

	//do stuff when enemy is selected
	$("#enemy-select-space").on("click", ".hero-selected", function(){
		curEnemy = heroes[$(this).data("hero-name")];
		$("#enemy-select-space").addClass("disabled");
		$(this).addClass('invisibleFighter');
		showLargeImage($('#enemy-space'), curEnemy, false);
		$("#attack").removeClass("disabled");
	});

	//create attack button object and define its click event
	var attackBtn = $('<button>', {
		text: 'Attack',
		class: 'btn btn-danger disabled btn-lg center-block',
		id: 'attack',
		click: function(){
			//damage enemy and hero and display on page
			curEnemy.damage(curHero.ap);
			curHero.damage(curEnemy.counter);
			$(".status-section").html(curHero.name + " attacks " + curEnemy.name + " for " + 
				curHero.ap + " Attack Points<br>" + curEnemy.name + " counters with " + 
				curEnemy.counter + " damage");
			refreshHealth();
			if (curHero.hp < 1){
				gameOver(false);
			} else if (curEnemy.hp <1){ //if current enemy has been defeated
					$(".status-section").html(curEnemy.name + " was defrated!");
					$("#enemy-select-space").removeClass("disabled");//choose next enemy
				//are there any more enemies?
				if ($("#enemy-select-space").find(".invisibleFighter").length <= Object.keys(heroes).length-2){
					curEnemy = null;
					$("#enemy-space").find(".hero-img").addClass("hero-dead");//kill enemy
					$("#attack").addClass("disabled");
				}
				else //no more enemies
					gameOver(true);
			}
			whatSound.play();
			curHero.powerUp();
		} 
	});

	function reGrow(){
		$('#reset-button').animate({height: '+=5px', width: '+=5px'}, "slow")
			.animate({height: '-=5px', width: '-=5px'}, "slow", reGrow);
	}

	function gameOver(win){
		//create a button to reset with loosing message
		var resetBtn = $('<div>', {
			text : "Game Over! Click here to try again.",
			class : "btn btn-lg btn-warning",
			id : "reset-button",
			click : function(){
				location.reload();
			}
		});
		//replace button text with winning message if won
		if (win){
			lordeSound.play();
			resetBtn.text("You Won!! Click here to play again.");
			resetBtn.removeClass("btn-warning");
			resetBtn.addClass("btn-success");			
		}else { noSound.play(); }
		//disable everything except reset button
		$(".container").addClass('disabled');
		$("h1").append('<br />').append(resetBtn);
		reGrow();
	}

	//function to show current health of hero and enemy
	function refreshHealth(){
			$("#hero-space").find(".progress").html('<div class="progress-bar progress-bar-info progress-bar-striped"'+ 
			'style="width: '+(curHero.hp/curHero.baseHp*100)+'%">HP: ' + curHero.hp + '</div>');	
			$("#enemy-space").find(".progress").html('<div class="progress-bar progress-bar-success"'+ 
			'style="width: '+(curEnemy.hp/curEnemy.baseHp*100)+'%">HP: ' + curEnemy.hp + '</div>');	
	}

	//function to show the large version of a given hero's image
	function showLargeImage(location, theHero, attack){
		var toReturn = '<div class=progress><div class="progress-bar progress-bar-info progress-bar-striped"'+ 
			'style="width: 100%">HP: ' + theHero.hp + '</div></div>' +
			'<p class="text-center"><img class="hero-img" src="' + theHero.img + 
			'" /><p>';
		if (attack === true) {
			location.html(toReturn).append(attackBtn).hide().slideToggle("slow");
		} else {
			location.html(toReturn).hide().slideToggle("slow");
		}

	}


	//function that returns thumbnails of heroes in a dom object
	function showThumbnails(location, horizontal){
		var images = $("<div>");
		$.each(heroes, function(index, value){
			if (value.isHero === false) {
				var thumbs = $("<div>");
				thumbs.data("hero-name", index);
				if (horizontal === true){
					thumbs.addClass("hero-selected col-sm-3");
				}
				else
					thumbs.addClass("hero-selected col-sm-12");					
				thumbs.html(    			
					'<div class="thumbnail">' +
							'<a href="#">' +
			  				'<img class="small-img" src="' + value.img + '" />' +
			    			'<div class="caption"><strong>' +
			      				value.name + ' HP: ' + value.hp +
			    			'</strong></div>' +
							'</a>' +
					'</div>');
				images.append(thumbs);
			}
		});
		location.append(images);
	}

});