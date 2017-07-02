var character = function(name, hp, baseAp, counter, imgurl){
	this.name = name;
	this.hp = hp;
	this.baseAp = baseAp;
	this.counter = counter
	this.ap = baseAp;
	this.img = imgurl;
	this.damage = function(changeVal){
		hp -= changeVal
	}
	this.powerUp = function(){
		this.ap += baseAp;
	}
}

var lea = new character("Princess Lea", 120, 12, 30, "../img/lea.png");

$("#attack").on("click", function(){
	$(".hero-selection").append("<h1>hola</h1>");
});