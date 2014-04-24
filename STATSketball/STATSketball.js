Teams = new Meteor.Collection("teams");
Players = new Meteor.Collection("players");
Statlines = new Meteor.Collection("statlines");
Games = new Meteor.Collection("games");
var pendingPlayers = [];
if (Meteor.isClient) {
  Meteor.startup(function(){
    
   if(Meteor.userId() !== null){
      $("#not-signed-in").css("display", "none");
      $("#signed-in").css("display", "none");
      $("#main-menu").css("display", "auto");
    }
    else{
      $("#signed-in").css("display", "none");
      $("#not-signed-in").css("display", "auto");
      $("#main-menu").css("display", "none");
    }
    $("#new-team-interface").css('display', 'none');
    $("#start-statsheet-button").css('display', 'none');
    $("#gamecast").css("display", "none");

    // var btn = $.fn.button.noConflict(); // reverts $.fn.button to jqueryui btn
    // $.fn.btn = btn;

      
    var chosenTeams = [];
    var alreadyOnTable = [];

    $("#start-statsheet-navbar").click(function(){

      $(".container").css("display","none");
      $("#upper-nav").css("display", "auto");
      $("#signed-in").css("display", "auto");

      addTeamsToTable();

    });

    $("#watch-gamecast-navbar").click(function(){
      $(".container").css("display","none");
      $("#upper-nav").css("display", "auto");
      $("#gamecast").css("display", "block");
    });

    $("#create-team-navbar").click(function(){
      $(".container").css("display","none");
      $("#upper-nav").css("display", "auto");
      $("#new-team-interface").css('display', 'block');
    });


    var addTeamsToTable = function(){
      console.log(Teams.find().fetch());


      var teamChoices = Teams.find({}, function(err, cursor){}).fetch();
      
      teamChoices.forEach(function(element,index,array){
        console.log("ran");
        if(alreadyOnTable.indexOf(element._id) === -1 && element.user === Meteor.userId()){
          $('#teams > tbody:last').append(("<tr class = 'team' id = '" + element["_id"] + "'><td><h3>" + element.name + '</h3></td></tr>'));
          alreadyOnTable.push(element._id);
        }


      });

        $('.team').click(function(){

          console.log("ran");

          var teamID = $(this).attr('id');
          var filter = new Object();
          filter["_id"] = teamID;
          var team = Teams.find(filter).fetch()[0];

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

        });
    };

      

      $("#new-team").click(function(){

        $("#new-team-interface").css('display', 'auto');
        $("#signed-in").css("display", "none");
        $('#new-player-details').css('display', 'none');

        while(pendingPlayers.length > 0){
          pendingPlayers.pop();
        }

      });
        
      
      

    $('#team-info').click(function(){
        $('#new-player-details').css('display', 'none');
        $('#new-team-details').css('display', 'auto');
        $('#remove-team-details').css('display', 'none');
        $('#remove-player-option').css('display', 'none');
    });
    $('#add-player').click(function(){
        $('#new-player-details').css('display', 'auto');
        $('#new-team-details').css('display', 'none');
        $('#remove-team-details').css('display', 'none');
        $('#remove-player-option').css('display', 'none');
    });

     $("#remove-player").click(function(){
        $('#remove-player-option').css('display', 'auto');
        $('#new-player-details').css('display', 'none');
        $('#new-team-details').css('display', 'none');
        $('#remove-team-details').css('display', 'none');
    });


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

          //Template.removePlayer.player();

        }

    });


    $('#make-team-button').click(function(){
      if($("#team-name-input").val().length === 0 || $("#team-league-input").val().length === 0 || $("#team-location-input").val().length === 0){
        alert("Need to fill out all team info");
      }
      else{
        var newTeamId = Teams.insert({name: $("#team-name-input").val(), league: $("#team-league-input").val(), location: $("#team-location-input").val(), user: Meteor.userId()});
        console.log(newTeamId);

        pendingPlayers.forEach(function(element,index,array){
          Players.insert({name: element[0], number: element[1], height: element[2], team: newTeamId});
        });

        var justAddedTeam = Teams.find({_id: newTeamId}).fetch()[0];

        $('#teams > tbody:last').append(("<tr class = 'team' id = '" + justAddedTeam["_id"] + "'><td><h3>" + justAddedTeam.name + '</h3></td></tr>'));


        $("#new-team-interface").css('display', 'none');
        $("#signed-in").css("display", "auto");
        $('#new-team-details').css('display', 'auto');
        $('#new-player-details').css('display', 'none');

        addTeamsToTable();

        $('.team').click(addClickFunctionality());

        while(pendingPlayers.length > 0){
          pendingPlayers.pop();
        }

      }
    });

    $(".sortable").sortable();

    $("#start-statsheet-button").click(function(){
        $("#signed-in").css("display", "none");
        $("#new-statsheet").css("display", "block");
        var team1 = Teams.find({_id:chosenTeams[0]}).fetch()[0];
        var team2 = Teams.find({_id:chosenTeams[1]}).fetch()[0];

        var gameId = Games.insert({team1: chosenTeams[0], team2: chosenTeams[1]});

        var team1Players = Players.find({team:chosenTeams[0]}).fetch();
        var team2Players = Players.find({team:chosenTeams[1]}).fetch();

        $("#new-statsheet").append("<div id = 'gameIdDisplay'><h3>Tweet your friends to watch the game (gameId: " + gameId + ")</h3>  <a href='https://twitter.com/share' target = '_blank' class='twitter-share-button' data-text='Watch my Gamecast between " + team1.name + " and " + team2.name + "! Use gameID " + gameId + " on ' data-hashtags='statsketball'>Tweet</a> <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>");
        var formatStatsheet = function(playerArray, side, score){

          var teamName = Teams.find({_id: playerArray[0].team}).fetch()[0].name;

          $("#" + score).attr("id", playerArray[0].team + "-points");

          $("#" + side + "-name").append( "<h3>" + teamName + "</h3>" );
          var primary = side.indexOf("team-2-players") ? "success" : "primary";
          playerArray.forEach(function(element,index,array){
                    
            var playerLine = [];
            //beginning of list
            playerLine.push("<li class = 'player-stat'> <div class='row'>");
            //player Name + Number
            playerLine.push("<div class='col-md-2'><h4>" + element.number + "</h4>" + element.name + "</div>");
            //category Tab
            playerLine.push("<div class='col-md-1'>");
            playerLine.push("<div class = 'stat-category'>2PTM</div>");
            playerLine.push("<div class = 'stat-category'>2PTA</div>");
            playerLine.push("<div class = 'stat-category'>OREB</div>");
            playerLine.push("<div class = 'stat-category'>DREB</div>");
            playerLine.push("<div class = 'stat-category'>AST</div>");
            playerLine.push("<div class = 'stat-category'>STL</div>");
            playerLine.push("<div class = 'stat-category'>REB</div>");
            playerLine.push("</div>");


            playerLine.push("<div class='col-md-3'><div>" + " <button type='button' class='counter plus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-plus-2PTM'>+</button>");
            playerLine.push("<span id = '2PTM-value-" + element._id + "' class = 'stat-count'>0</span>");
            playerLine.push("<button type='button' class='counter minus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-minus-2PTM'>-</button></div>");
            // playerLine.push("</div>");
            
            playerLine.push("<div> <button type='button' class='counter plus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-plus-2PTA'>+</button>");
            playerLine.push("<span id = '2PTA-value-" + element._id + "' class = 'stat-count'>0</span>");
            playerLine.push("<button type='button' class='counter minus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-minus-2PTA'>-</button></div>");
            

            playerLine.push("<div>"  + " <button type='button' class='counter plus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-plus-OREB'>+</button>");
            playerLine.push("<span id = 'OREB-value-" + element._id + "' class = 'stat-count'>0</span>");
            playerLine.push("<button type='button' class='counter minus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-minus-OREB'>-</button></div>");
            
            playerLine.push("<div> <button type='button' class='counter plus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-plus-DREB'>+</button>");
            playerLine.push("<span id = 'DREB-value-" + element._id + "' class = 'stat-count'>0</span>");
            playerLine.push("<button type='button' class='counter minus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-minus-DREB'>-</button></div>");

            playerLine.push("<div> <button type='button' class='counter plus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-plus-AST'>+</button>");
            playerLine.push("<span id = 'AST-value-" + element._id + "' class = 'stat-count'>0</span>");
            playerLine.push("<button type='button' class='counter minus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-minus-AST'>-</button></div>");

            playerLine.push("<div> <button type='button' class='counter plus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-plus-STL'>+</button>");
            playerLine.push("<span id = 'STL-value-" + element._id + "' class = 'stat-count'>0</span>");
            playerLine.push("<button type='button' class='counter minus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-minus-STL'>-</button></div>");

            playerLine.push("<div> <span id = 'REB-value-" + element._id + "' class = 'stat-count'>0</span> </div>");
            

            playerLine.push("</div>");

            //category Tab
            playerLine.push("<div class='col-md-1'>");
            playerLine.push("<div class = 'stat-category'>3PTM</div>");
            playerLine.push("<div class = 'stat-category'>3PTA</div>");
            playerLine.push("<div class = 'stat-category'>FTM</div>");
            playerLine.push("<div class = 'stat-category'>FTA</div>");
            playerLine.push("<div class = 'stat-category'>TO</div>");
            playerLine.push("<div class = 'stat-category'>BLK</div>");
            playerLine.push("<div class = 'stat-category'>PTS</div>");
            playerLine.push("</div>");

            playerLine.push("<div class='col-md-3'><div>"  + " <button type='button' class='counter plus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-plus-3PTM'>+</button>");
            playerLine.push("<span id = '3PTM-value-" + element._id + "' class = 'stat-count'>0</span>");
            playerLine.push("<button type='button' class='counter minus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-minus-3PTM'>-</button></div>");
            
            //2PTA Decrease - Value - Increase
            playerLine.push("<div> <button type='button' class='counter plus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-plus-3PTA'>+</button>");
            playerLine.push("<span id = '3PTA-value-" + element._id + "' class = 'stat-count'>0</span>");
            playerLine.push("<button type='button' class='counter minus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-minus-3PTA'>-</button></div>");

            playerLine.push("<div>"  + " <button type='button' class='counter plus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-plus-FTM'>+</button>");
            playerLine.push("<span id = 'FTM-value-" + element._id + "' class = 'stat-count'>0</span>");
            playerLine.push("<button type='button' class='counter minus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-minus-FTM'>-</button></div>");
            
            //2PTA Decrease - Value - Increase
            playerLine.push("<div> <button type='button' class='counter plus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-plus-FTA'>+</button>");
            playerLine.push("<span id = 'FTA-value-" + element._id + "' class = 'stat-count'>0</span>");
            playerLine.push("<button type='button' class='counter minus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-minus-FTA'>-</button></div>");

            playerLine.push("<div> <button type='button' class='counter plus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-plus-TO'>+</button>");
            playerLine.push("<span id = 'TO-value-" + element._id + "' class = 'stat-count'>0</span>");
            playerLine.push("<button type='button' class='counter minus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-minus-TO'>-</button></div>");

            playerLine.push("<div> <button type='button' class='counter plus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-plus-BLK'>+</button>");
            playerLine.push("<span id = 'BLK-value-" + element._id + "' class = 'stat-count'>0</span>");
            playerLine.push("<button type='button' class='counter minus-points btn btn-" + primary + " btn-xs' id = '" + element._id + "-minus-BLK'>-</button></div>");


            playerLine.push("<div> <span id = 'PTS-value-" + element._id + "' class = 'stat-count'>0</span> </div>");
            playerLine.push("</div>");

            playerLine.push("</div>");

            //Total PTS, REBS, FG% calculated automatically


            playerLine.push("</li>");

            Statlines.insert({twoPTM: 0, twoPTA: 0, threePTM: 0, threePTA: 0, OREB: 0, FTM: 0, DREB: 0, FTA: 0, AST: 0, TO: 0, STL: 0, BLK: 0, REB: 0, PTS: 0, player: element._id, game: gameId, FGP: 0, EFGP: 0, TSP: 0, FTP: 0});

            
            $("#" + side).append( playerLine.join(" ") );
            $(".sortable").sortable();

            // Players.insert({name: element[0], number: element[1], height: element[2], team: newTeamId});




          });
          //$(".btn-" + primary).css('background-color', 'orange');

        };

        formatStatsheet(team1Players, "team-1-players", "team-1-points");
        formatStatsheet(team2Players, "team-2-players", "team-2-points");


        $(".counter").click(function(event){

            
            var ids = $(event.target).attr('id').split("-");
            var targetID = ids[0];
            var statlineId = Statlines.find({game: gameId, player: targetID}).fetch()[0]._id;
            var updatePoints = false;
            var updateRebounds = false;

            console.log(Statlines.find({game: gameId, player: targetID}).fetch());

            $("#" + ids[2] + "-value-" + ids[0]).html(parseInt($("#" + ids[2] + "-value-" + ids[0]).html()) + (ids[1] === "plus" ? 1 : -1));

            if(parseInt($("#" + ids[2] + "-value-" + ids[0]).html()) < 0){
              $("#" + ids[2] + "-value-" + ids[0]).html(0);
            }

            if(ids[2].indexOf("PT") !== -1 || ids[2].indexOf("FT") !== -1){
              var previousPoints = parseInt($("#" + "PTS" + "-value-" + ids[0]).html());
              $("#" + "PTS" + "-value-" + ids[0]).html(parseInt($("#" + "2PTM" + "-value-" + ids[0]).html()) * 2 + parseInt($("#" + "3PTM" + "-value-" + ids[0]).html()) * 3 + parseInt($("#" + "FTM" + "-value-" + ids[0]).html()));
              var newPoints = parseInt($("#" + "PTS" + "-value-" + ids[0]).html());
              updatePoints = true;
              var pointChangeTeamId = Players.find({_id: ids[0]}).fetch()[0].team
              console.log(parseInt($("#" + pointChangeTeamId + "-points").html()));
              $("#" + pointChangeTeamId + "-points").html(parseInt($("#" + pointChangeTeamId + "-points").html()) + parseInt(newPoints - previousPoints));
            }
            if(ids[2].indexOf("REB") !== -1){
              $("#" + "REB" + "-value-" + ids[0]).html(parseInt($("#" + "OREB" + "-value-" + ids[0]).html()) + parseInt($("#" + "DREB" + "-value-" + ids[0]).html()) );
              updateRebounds = true;
            }

            var newValue = parseInt($("#" + ids[2] + "-value-" + ids[0]).html());

            if(ids[2] === "2PTM"){
              ids[2] = "twoPTM";
            }
            if(ids[2] === "2PTA"){
              ids[2] = "twoPTA";
            }
            if(ids[2] === "3PTA"){
              ids[2] = "threePTA";
            }
            if(ids[2] === "3PTM"){
              ids[2] = "threePTA";
            }

            var setModifier = { $set: {} };
            setModifier.$set[ids[2]] = newValue;
            if(updatePoints){
              setModifier.$set["PTS"] = parseInt($("#" + "PTS" + "-value-" + ids[0]).html());
              console.log(Players.find({_id: ids[0]}).fetch()[0].team);
            }
            if(updateRebounds){
              setModifier.$set["REB"] = parseInt($("#" + "REB" + "-value-" + ids[0]).html());
            }

            Statlines.update({_id: statlineId}, setModifier);

            updateAdvancedStatistics(statlineId);

            //console.log(Statlines.find({game: gameId, player: targetID}).fetch());



        });




      });

    $("#menu-start-gamecast").click(function(){

      $("#main-menu").css("display", "none");
      $("#gamecast").css("display", "auto");

    });

    $("#menu-start-statsheet").click(function(){

      $("#main-menu").css("display", "none");
      $("#signed-in").css("display", "auto");
      addTeamsToTable();

    });

    var updateAdvancedStatistics = function(id){
      var attrAccess = Statlines.find({_id: id}).fetch()[0];
      var fieldGoalPercentage = Math.round(((attrAccess.twoPTM + attrAccess.threePTM)/(attrAccess.threePTA + attrAccess.twoPTA))*1000)/1000;
      var effectiveFieldGoalPercentage = Math.round((((attrAccess.twoPTM) + (1.5 * attrAccess.threePTM))/(attrAccess.threePTA + attrAccess.twoPTA))*1000)/1000;
      console.log((attrAccess.twoPTM + (1.5 * attrAccess.threePTM)) + " " + (attrAccess.twoPTM + attrAccess.threePTM));
      var trueShootingPercentage = Math.round(((attrAccess.PTS)/ (2 * ((attrAccess.threePTA + attrAccess.twoPTA) + .475 * attrAccess.FTA)))*1000)/1000;
      var freethrowPercentage = Math.round((attrAccess.FTM/attrAccess.FTA) * 1000)/ 1000;
      Statlines.update({_id: id}, {$set : { FGP : fieldGoalPercentage, EFGP: effectiveFieldGoalPercentage , TSP: trueShootingPercentage, FTP: freethrowPercentage} });

    };



    // $("#gameIdInput").keyup(function(){
      
      
    //   UI.render(Template.tester);
    //   console.log("ran");
    //   //$("#gamecastTemplate").html(fragment/*Template.gamecast.render()[0].value + Template.gamecast.render()[1].children[1].__content.render()*/);

    // });

    });


    Template.gamecast.player = function(){
      return Players.find().fetch();
    };

    Template.gamecast.statsheet = function(){
      var stats =  Statlines.find({game: $("#gameIdInput").val()}).fetch();
      var playerOrganized = [];
      stats.forEach(function(element, index, array){
        element.playerName = Players.findOne({_id: element.player}).name;
        element.playerNumber = Players.findOne({_id: element.player}).number;
        element.team = Teams.findOne({_id: Players.findOne({_id: element.player}).team}).name;
      });
      console.log(stats);

      return stats;

    };

    var text_box_value;

    Template.gamecast.events({
      'keyup #gameIdInput': function(){
        
        
        if(Statlines.find({game: $("#gameIdInput").val()}).fetch().length > 0){
          //Template.gamecast.statsheet();
          text_box_value = $("#gameIdInput").val();
          //$("#gamecast").html("");
          UI.insert(UI.render(Template.gamecast), $("#gamecast")[0]);
          UI.insert(UI.render(Template.pointChart), $("#gamecast")[0]);
        };
        
    }

    });

    Template.removePlayer.player = function(){
        //console.log(pendingPlayers + " titties");
        var removePlayerArray = [];
        pendingPlayers.forEach(function(element){
          removePlayerArray.push({name: element[0], number: element[1]});
        });
        //console.log(removePlayerArray);
        return removePlayerArray;

    };

    Template.loginButtons.events({
      'onclick .login-text-and-button': function(){
        location.reload();
      }
    });

    Template.gamecast.rendered = function(){
      // $("#gameIdInput").keyup(function(){
      //   if(Statlines.find({game: $("#gameIdInput").val()}).fetch().length > 1){
      //     this.firstNode.remove();
      //   }
      // });
      if(this.findAll(".holder").prevObject.length >= 2){
        console.log(this.findAll(".holder").prevObject.length);
        (this.findAll(".holder").prevObject[0]).remove();
          $("#gameIdInput").val(text_box_value);
      }

      function drawChart(){
        var data = [];

        if ($(".pts").length > 0){
          $(".pts").forEach(function(element, index, array){
            data.push({value: Math.parseInt(element.html()), color: '#' + Math.random().toString(16).substring(2, 8)});
             console.log(element.html());
          });
        }

        var data2 = [
          {
            value: 50,
            color: Math.random().toString(16).substring(2, 8)
          },
          {
            value: 30,
            color: Math.random().toString(16).substring(2, 8)
          }
        
        ];

        var options = [];
        var ctx = document.getElementsByClassName(".PieChart")[0].getContext("2d");
        new Chart(ctx).Pie(data2,options);

      };
      drawChart();


    };

    
    
 
};

if (Meteor.isServer) {
 
    Teams.allow({
      'insert': function (userId,doc) {
        /* user and doc checks ,
        return true to allow insert */
        doc.created = new Date();
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

    Games.allow({
      'insert': function (userId,doc) {
        /* user and doc checks ,
        return true to allow insert */
        return true; 
      }
    });
    Statlines.allow({
      'insert': function (userId,doc) {
        /* user and doc checks ,
        return true to allow insert */
        return true; 
      },
      'update': function (userId,doc) {
        /* user and doc checks ,
        return true to allow insert */
        return true; 
      }
    });

};





