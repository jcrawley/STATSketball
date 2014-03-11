Teams = new Meteor.Collection("teams");
Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Meteor.startup(function(){
   /* if(Meteor.userId() !== null){
      $("#not-signed-in").css("display", "none");
      $("#signed-in").css("display", "auto");
    }
    else{
      $("#signed-in").css("display", "none");
      $("#not-signed-in").css("display", "auto");
    }*/
    var chosenTeams = [];
    Template.addPlayer.players = function(){
      return Teams.find();
    };

    var teamChoices = Teams.find().fetch();

    teamChoices.forEach(function(element,index,array){

        $('#teams > tbody:last').append(("<tr class = 'team' id = '" + element["_id"] + "'><td><h3>" + element.name + '</h3></td></tr>'));

    });

    $('.team').click(function(){

      var teamID = $(this).attr('id');
      var filter = new Object();
      filter["_id"] = teamID;
      var team = Teams.find(filter).fetch()[0];

      console.log(team);

      if(teamID === 'new-team'){
        console.log(true);
      }
      else{
        $("#team-box").append("<h2>" + team.name+ "</h2>");
      }

    });

    $('#team-info').click(function(){
        $('#new-player-details').css('display', 'none');
        $('#new-team-details').css('display', 'auto');
        $('#remove-team-details').css('display', 'none');
    });
    $('#add-player').click(function(){
        $('#new-player-details').css('display', 'auto');
        $('#new-team-details').css('display', 'none');
        $('#remove-team-details').css('display', 'none');
    });

    var pendingPlayers = [];
    $('#add-player-button').click(function(){
        var tempPlayer = [];
        if($("#player-name-input").val().length <= 0 || $("#player-number-input").val().length <= 0 || $("#player-height-input").val().length <= 0){
          $("#alert-error").html("You need to fill out all of the fields");
          alert("Fill out all of the fields to add a player!");
        }
        else{
          $("#alert-error").alert("close");
          tempPlayer.push($("#player-name-input").val());
          tempPlayer.push($("#player-number-input").val());
          tempPlayer.push($("#player-height-input").val());

          pendingPlayers.push(tempPlayer);

          $("#player-name-input").val("");
          $("#player-number-input").val("");
          $("#player-height-input").val("");

          console.log(pendingPlayers);

        }

    });

  });



 
  
};

if (Meteor.isServer) {
 
    Teams.allow({
      'insert': function (userId,doc) {
        /* user and doc checks ,
        return true to allow insert */
        return true; 
      },
      'remove': function (userId,doc) {
        /* user and doc checks ,
        return true to allow insert */
        return true; 
      },
      'update': function (userId,doc) {
        /* user and doc checks ,
        return true to allow insert */
        return true; 
      },
    });

};



