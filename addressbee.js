Addresses = new Meteor.Collection('addresses');

if (Meteor.isClient) {

	Template.addressForm.events({
    'submit' : function(evt) {
      submitAddressForm($(evt.target).closest('form'));
      evt.preventDefault();	
    }
  });

  Template.addressBook.addresses = function() {
    return Meteor.users.findOne(Meteor.userId()).addresses;
  };

  // Login tools
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
    },
    'click #logout' : function() {
      Meteor.logout();
    }
  });

  // Form helpers
  Template.dayOptions.days = _.range(1,31);
  Template.monthOptions.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  Meteor.startup(function() {
    //Meteor.subscribe('addresses'); // TESTING
    Meteor.subscribe('userData');
  })
}


if (Meteor.isServer) {

  // Permissions
  Meteor.publish("userData", function () {
    return Meteor.users.find(
      {_id: this.userId},
      {fields: {'addresses': 1}});
  });

  Meteor.users.allow({
    'update': function(userId, doc) {
      if (userId == Meteor.user()._id) {
        return true; 
      }
    }
  });

  Addresses.allow({
    'insert' : function(userId, doc) {
      return true;
    }
  });

  //Meteor.publish('addresses', function() { return Addresses.find() }); // TESTING

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
  console.log('new address:', obj);
  var address_id = Addresses.insert(obj);

  // Add to addressbook of logged-in user
  if (Meteor.user()) {
    Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{addresses: obj}});
  }
};


Router.map(function() {
  this.route('addressBook', {
    path: '/book',
    template: 'addressBook'
  });

  this.route('addAddress', {
    path: '/add',
    template: 'addAddress'
  });

})

