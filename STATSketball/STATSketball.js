Teams = new Meteor.Collection("teams");
Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Meteor.startup(function(){
   if(Meteor.userId() !== null){
      $("#not-signed-in").css("display", "none");
      $("#signed-in").css("display", "auto");
    }
    else{
      $("#signed-in").css("display", "none");
      $("#not-signed-in").css("display", "auto");
    }
    $("#new-team-interface").css('display', 'none');
    var chosenTeams = [];

    var addTeamsToTable = function(){
      var teamChoices = Teams.find().fetch();
      $("#teams").find("tr:gt(0)").remove();
      
      teamChoices.forEach(function(element,index,array){


        $('#teams > tbody:last').append(("<tr class = 'team' id = '" + element["_id"] + "'><td><h3>" + element.name + '</h3></td></tr>'));

      });
    }
    addTeamsToTable();

    $('.team').click(function(){

      var teamID = $(this).attr('id');
      var filter = new Object();
      filter["_id"] = teamID;
      var team = Teams.find(filter).fetch()[0];

      console.log(team);

      if(teamID === 'new-team'){
        $("#new-team-interface").css('display', 'auto');
        $("#signed-in").css("display", "none");
        $('#new-player-details').css('display', 'none');
      }
      else{
        if(chosenTeams.length < 2 && jQuery.inArray(teamID,chosenTeams) === -1){
          $("#team-box").append("<h2>" + team.name+ "</h2>");
        
          chosenTeams.push(teamID);
        }
        if(chosenTeams.length == 2){
          $("#team-box").append("<button type='button' class='btn btn-primary btn-lg' id='start-statsheet-button'>Start Statsheet</button>");
        }
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

    $('#make-team-button').click(function(){
      if($("#team-name-input").val().length === 0 || $("#team-league-input").val().length === 0 || $("#team-location-input").val().length === 0){
        alert("Need to fill out all team info");
      }
      else{
        var newTeamId = Teams.insert({name: $("#team-name-input").val(), league: $("#team-league-input").val(), location: $("#team-location-input").val()});
        console.log(newTeamId);

        pendingPlayers.forEach(function(element,index,array){
          Players.insert({name: element[0], number: element[1], height: element[2], team: newTeamId});
        });


        $("#new-team-interface").css('display', 'none');
        $("#signed-in").css("display", "auto");
        $('#new-team-details').css('display', 'auto');
        $('#new-player-details').css('display', 'none');

        addTeamsToTable();



      }
    })

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

    Players.allow({
      'insert': function (userId,doc) {
        /* user and doc checks ,
        return true to allow insert */
        return true; 
      }
    });

};



