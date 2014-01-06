Addresses = new Meteor.Collection('addresses');

if (Meteor.isClient) {

	Template.addressForm.events({
    'submit' : function(evt) {
      submitAddressForm($(evt.target).closest('form'));
      evt.preventDefault();	
    }
  });

  Template.header.events({
    'click #fbLogin' : function() {
      Meteor.loginWithFacebook({ requestPermissions: ['email']},
        function (error) {
          if (error) {
            return console.log(error);
        }
      });
    },
    'click #normalLogin' : function() {
      // TODO
      Meteor.loginWithPassword(null,null,
        function (error) {
          if (error) {
            return console.log(error);
        }
      });
    }
  });

  // Form helpers
  Template.dayOptions.days = _.range(1,31);
  Template.monthOptions.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
}


if (Meteor.isServer) {

 Meteor.users.allow({
    'update': function (userId,doc) {
      if (userId == Meteor.user()._id) {
        return true; 
      }
    }
  });

  Meteor.startup(function () {
    
    Accounts.loginServiceConfiguration.remove({
      service: "facebook"
    });
    Accounts.loginServiceConfiguration.insert({
      service: "facebook",
      appId: "563905963695301",
      secret: "665bd2dbb0b9b59212a5a544771a3c20"
    });
  });
}


var submitAddressForm = function(formEl) {
  var obj = {};
  $.each(formEl.serializeArray(), function() {
    obj[this.name] = this.value;
  });

  // Save address
  var address_id = Addresses.insert(obj);

  // Add to addressbook of logged-in user
  if (Meteor.user()) {
    Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{addresses: address_id}});
  }
};


Router.map(function() {
  this.route('userPage', {
    path: '/u/:userName',
    template: 'user'
  });

  this.route('addAddress', {
    path: '/add',
    template: 'addAddress'
  });

})

