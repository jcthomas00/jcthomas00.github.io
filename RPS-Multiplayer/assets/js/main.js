var rPs = {

    config : {
        apiKey: "AIzaSyDUeIymic_2E-_TT8r36nY4BkREZD2S8VU",
        authDomain: "rockpapersci.firebaseapp.com",
        databaseURL: "https://rockpapersci.firebaseio.com",
        projectId: "rockpapersci",
        storageBucket: "",
        messagingSenderId: "245108560728"
    },
    database: "",
    numPlayers: 0,
    playerDesignation: "",

    init: function() {

        firebase.initializeApp(rPs.config);
        database = firebase.database();
        var tempDB = database.ref('players')
        rPs.clickHandlers();
    },
    clickHandlers: function() {

        $(".ready").on("click", function(e) {
            var curPlayer = $(e.target).attr("data-player");
            var enteredText = $('#' + curPlayer + ' .name').val().trim();
            if (enteredText == "") {
                alert("Please enter a valid name")
            } else {
                var connectionsRef = "";
                var connectedRef = database.ref(".info/connected");
                rPs.playerDesignation = curPlayer;
                rPs.players[rPs.playerDesignation] = new rPs.Player(enteredText);
                rPs.updatePlayers();
                connectionsRef = database.ref("/"+rPs.playerDesignation);
                connectionsRef.set(rPs.players[rPs.playerDesignation]);
                connectionsRef.onDisconnect().remove();
            }
        });


        $(".move").on("click", function(e) {
            var curPlayer = $(e.target.offsetParent).attr('id');
            rPs.players[curPlayer].lastMove = $(e.target).attr("data-move");
            $('#' + curPlayer + ' .move').not($(e.target)).hide();
            database.ref().set(rPs.players);
            console.log(curPlayer + ":" + rPs.players[curPlayer].lastMove);
        });

        database.ref().on('value', function(data){
            console.log("Plarers: " +rPs.numPlayers);

            if(data.val()!=null){
                rPs.players = data.val();
                rPs.numPlayers = data.val().length;
                if(rPs.numPlayers>1){
                    if (rPs.players['player1'].lastMove != "" && 
                        rPs.players['player2'].lastMove != "" ) {
                        result = rPs.getResult();
                    }
                }     
                rPs.updatePlayers();
            }
        }, function(error){alert("Error! Cannot compute!")})
    },//end of clickHandlers

    updatePlayers: function() {
        rPs.numPlayers = 0;
        $('.player-title').html("Player Name: ")
        $(' .form-group').slideDown();
        for (curPlayer in rPs.players){
            if (rPs.players[curPlayer] != null){
                rPs.numPlayers++;
                $('#' + curPlayer + ' .player-title').html("Player Name: " + rPs.players[curPlayer].name)
                $('#' + curPlayer + ' .form-group').slideUp();
                $('.move-text').html("Waiting for another player");
                $('.moves :button').attr('disabled', true);   
                rPs.checkPlayers();
            }
        }
    },

    checkPlayers: function() {
        for (key in rPs.players) {
            if (rPs.players[key] == null) {
                $("#" + key + " .moves :button").attr('disabled', true);
            } else if (rPs.numPlayers > 1) {
                $("#" + rPs.playerDesignation + " .moves :button").removeAttr('disabled');
                $('#' + key + ' .move-text').html("Make your move:");
                $('#' + key + ' .player-title').html("Player Name: " + rPs.players[key].name);
            }
        }
    }, //checkPlayers function
    refresh: function(){
        $('.moves :button').show();
    },

    getResult: function() {
        rPs.refresh();
        if(rPs.players['player1'].lastMove === rPs.players['player2'].lastMove){
            rPs.winner('tied');
        } else {
            switch(rPs.players['player1'].lastMove){
                case 'rock':
                    if(rPs.players['player2'].lastMove === 'paper'){
                        rPs.winner('player2');
                    } else{rPs.winner('player1')}
                    break;
                case 'paper':
                    if(rPs.players['player2'].lastMove === 'scissors'){
                        rPs.winner('player2');
                    } else{rPs.winner('player1')}
                    break;
                case 'scissors':
                    if(rPs.players['player2'].lastMove === 'rock'){
                        rPs.winner('player2');
                    } else{rPs.winner('player1')}
                    break;
            }
        }return 1;
    },

    winner: function(aPlayer){
        if (aPlayer === 'tied'){
            alert("Tied!");
            for(curPlayer in rPs.players){
                rPs.players[curPlayer].lastMove = "";
                rPs.players[curPlayer].ties++;
            }
        } else{
            alert(aPlayer+" won!");
            rPs.players[aPlayer].wins++;
            for(curPlayer in rPs.players){
                rPs.players[curPlayer].lastMove = "";
                if (curPlayer != aPlayer){
                    rPs.players[curPlayer].losses++;
                }
            }
        }
        database.ref().set(rPs.players);
    },
    Player: function(name) {

        this.name = name;
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.lastMove = "";
    },
    players: { player1: null, player2: null }
}//rPs Object

$(document).ready(function() {
    rPs.init();
}); //document.ready

