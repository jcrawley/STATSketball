Teams = new Meteor.Collection("teams");

if (Meteor.isClient) {

  Template.addTeam.teams = function(){
    return Teams.find({});
  };

  
  var render = Meteor.render(function(){
    return Template['addTeam'];
  });

  if(Meteor.userId() !== null){
    $('#main').html(render);
  }

 
  
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



