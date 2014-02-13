Teams = new Meteor.Collection("teams");

if (Meteor.isClient) {
  Meteor.startup(function(){
    var chosenTeams = [];
    Template.addTeam.teams = function(){
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



