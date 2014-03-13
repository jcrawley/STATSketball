Teams = new Meteor.Collection("teams");
Players = new Meteor.Collection("players");
Statline = new Meteor.Collection("statline");

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
    $("#start-statsheet-button").css('display', 'none');
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
          $("#team-box").prepend("<h2>" + team.name+ "</h2>");
        
          chosenTeams.push(teamID);
        }
        var buttonThere = false;
        if(chosenTeams.length == 2){
          if(!buttonThere){
            $("#start-statsheet-button").css('display', 'auto');
            
            buttonThere = true;
          }
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
    });

    $(".sortable").sortable();

    $("#start-statsheet-button").click(function(){
        var team1 = Teams.find({_id:chosenTeams[0]}).fetch()[0];
        var team2 = Teams.find({_id:chosenTeams[1]}).fetch()[0];

        console.log(team1);

        var team1Players = Players.find({team:chosenTeams[0]});
        var team2Players = Players.find({team:chosenTeams[1]});

        var formatStatsheet = function(playerArray, side){
          playerArray.forEach(function(element,index,array){
                    
            var playerLine = [];
            //beginning of list
            playerLine.push("<li id = 'player-stat'> <ul class = 'list-inline'>");
            //player Number
            playerLine.push("<li>" + element.number + "</li>");
            //player Name
            playerLine.push("<li>" + element.name + "</li>");
            //2PTM Decrease - Value - Increase
            playerLine.push(" <li> 2PTM </li> <li> <button type='button' class='counter minus-points btn btn-primary btn-xs' id = '" + element._id + "-minus-2PTM'>-</button>");
            playerLine.push("</li>" + "<li><span id = '2PTM-value-" + element._id + "' class = 'stat-count'>0</span> </li>");
            playerLine.push("<li> <button type='button' class='counter plus-points btn btn-primary btn-xs' id = '" + element._id + "-plus-2PTM'>+</button>");
            
            //2PTA Decrease - Value - Increase
            playerLine.push("<div><li> 2PTA </li> <li> <button type='button' class='counter minus-points btn btn-primary btn-xs' id = '" + element._id + "-minus-2PTA'>-</button>");
            playerLine.push("</li>" + "<li><span id = '2PTA-value-" + element._id + "' class = 'stat-count'>0</span> </li>");
            playerLine.push("<li> <button type='button' class='counter plus-points btn btn-primary btn-xs' id = '" + element._id + "-plus-2PTA'>+</button>");
            
            
            $("#" + side).append( playerLine.join(" ") );


          });
        };

        formatStatsheet(team1Players, "team-1-players");

        $(".counter").click(function(event){
            var ids = $(event.target).attr('id').split("-");

            $("#" + ids[2] + "-value-" + ids[0]).html(parseInt($("#" + ids[2] + "-value-" + ids[0]).html()) + (ids[1] === "plus" ? 1 : -1));

            if(parseInt($("#" + ids[2] + "-value-" + ids[0]).html()) < 0){
              $("#" + ids[2] + "-value-" + ids[0]).html(0);
            }
        });

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

    Players.allow({
      'insert': function (userId,doc) {
        /* user and doc checks ,
        return true to allow insert */
        return true; 
      }
    });

};



