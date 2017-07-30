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
    playerDB : "",
    messagesDB: "",

    init: function() {

        firebase.initializeApp(rPs.config);
        database = firebase.database();
        playerDB = database.ref('players/');        //DB location for current players
        messagesDB = database.ref('messages/');     //DB location to store chat messages
        rPs.clickHandlers();                        //activate listeners
    },
    clickHandlers: function() {

        $(".ready").on("click", function(e) {
            console.log(rPs.numPlayers);
            var curPlayer = $(e.target).attr("data-player");
            var enteredText = $('#' + curPlayer + ' .name').val().trim();
            if (enteredText == "") {                //player name can't be blank
                alert("Please enter a valid name")
            } else {                            
                //player name is valid. Insert player into DB and make UI changes
                rPs.playerDesignation = curPlayer;
                rPs.players[rPs.playerDesignation] = new rPs.Player(enteredText);
                rPs.updatePlayers();
                var connectionsRef = database.ref("/players/"+rPs.playerDesignation);
                connectionsRef.set(rPs.players[rPs.playerDesignation]);
                //remove player from DB if they disconnect
                connectionsRef.onDisconnect(
                    function () {
                        messagesDB.push(new rPs.Message(enteredText +
                            " has left the building.", 'admin'));
                    }).remove();
                $('.name').attr('disabled', true);  //don't let them enter another name
            }
        });

        //When player picks R, P or S
        $(".move").on("click", function(e) {
            var curPlayer = $(e.target.offsetParent).attr('id');
            rPs.players[curPlayer].lastMove = $(e.target).attr("data-move");
            $('#' + rPs.playerDesignation + ' .move').not($(e.target)).hide();
            playerDB.set(rPs.players);
        });

        playerDB.on('value', function(data){
            if(data.val()==null){
                players = { player1: null, player2: null };
            }else{
                rPs.players = data.val();
                rPs.numPlayers = Object.keys(data.val()).length;
                if(rPs.numPlayers>1){
                    let moveFlag = true;
                    for(key in rPs.players){
                        if (rPs.players[key].lastMove === ""){
                            moveFlag=false;
                            break;
                        }
                    }
                    if (moveFlag) {
                            rPs.getResult();
                    }
                }     
                rPs.updatePlayers();
            }
        }, function(error){alert("Error! Cannot compute!")});

        /* Chatroom Functionality */
        messagesDB.on('child_added', function(data){
            rPs.showMessage(data.val());
        }, function(e){
            alert("You have been disconnected");
        });

        $('#send').on('click', function(e){
            e.preventDefault();
            let message = $('#message-input').val().trim();
            if(message===""){
                alert("Cannot send blank message")
            } else{
                messagesDB.push(new rPs.Message(message));
            }
            $('#message-input').val("");
        });
        /* End Chatroom Functionality */
    },//end of clickHandlers

    updatePlayers: function() {
        $('.player-title').html("Player Name: ")
        $(' .form-group').slideDown();
        for (curPlayer in rPs.players){
            if (rPs.players[curPlayer] != null){
                $('#' + curPlayer + ' .player-title').html("Player Name: " + 
                    rPs.players[curPlayer].name);
                $('#' + curPlayer + ' .win').html(rPs.players[curPlayer].wins);
                $('#' + curPlayer + ' .loss').html(rPs.players[curPlayer].losses);
                $('#' + curPlayer + ' .tie').html(rPs.players[curPlayer].ties);
                $('#' + curPlayer + ' .form-group').slideUp();
                $('.move-text').html("Waiting for another player");
                $('.moves :button').attr('disabled', true);   
                rPs.checkPlayers();
            }
        }
    },

    //disable all buttons except the move button for current player
    checkPlayers: function() {
        for (key in rPs.players) {
            if (rPs.players[key] == null) {
                $("#" + key + " .moves :button").attr('disabled', true);
            } else if (rPs.numPlayers > 1) {        //we  have our 2 players
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
        }
    },

    winner: function(aPlayer){
        if (aPlayer === 'tied'){
            $('.result').html("You both tied with " + 
                rPs.players[rPs.playerDesignation].lastMove);
            for(curPlayer in rPs.players){
                rPs.players[curPlayer].lastMove = "";
                rPs.players[curPlayer].ties++;
            }
        } else{
            $('.result').html(rPs.players[aPlayer].name + " won with " + 
                rPs.players[aPlayer].lastMove);
            rPs.players[aPlayer].wins++;
            for(curPlayer in rPs.players){
                rPs.players[curPlayer].lastMove = "";
                if (curPlayer != aPlayer){
                    rPs.players[curPlayer].losses++;
                }
            }
        }
        rPs.refresh();
        playerDB.set(rPs.players);
    },
    showMessage: function(message){
        let style="";
        switch (message.sender){
            case 'anonymous':
                style = 'anonymous';
                break;
            case 'admin':
                style = 'anonymous';
                break;
            case rPs.playerDesignation:
                style = 'left';
                break;
            default:
                style = 'right';
        }
        $('.messages ul').append($('<li class="li-' + style +'">').html(
            '<span class="li-message">' + message.message + '</span>' +
            '<span class="li-username">- ' + message.sender + " | " + 
            message.time + '</span>'));
        $(".messages").animate({scrollTop: $(".messages").prop("scrollHeight")}, 1000);
    },

    Player: function(name) {

        this.name = name;
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.lastMove = "";
    },
    Message: function(chat, sender = 'anonymous') {
        if(sender!='admin'){
            if (rPs.playerDesignation != ""){
                sender = rPs.playerDesignation;
            }
        }
        this.sender = sender
        this.message = chat;
        this.time = new Date().toLocaleTimeString();
        console.log(this.sender +":"+ chat);
    },
    players: { player1: null, player2: null }
}//rPs Object

$(document).ready(function() {
    rPs.init();
}); //document.ready

