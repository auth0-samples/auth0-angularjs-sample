angular.module('app')
.controller('SettingsCtrl', ['$scope', 'auth', 'store', '$window', settingsCtrlFunc]);

function settingsCtrlFunc($scope, auth, store, $window){
  $scope.providers = [
    {title: 'Facebook', value: 'facebook'},
    {title: 'Github', value: 'github'},
    {title: 'Google', value: 'google-oauth2'},
    {title: 'Twitter', value: 'twitter'}
  ]

  var token = store.get('token');
  var profile = store.get('profile');

  var successCallback = function(response){
    $window.alert('Linked');
    //we need to update stored profile
    auth.getProfile(token).then(function(profile) {
      store.set('profile', profile);
    });
  }

  var errCallback = function(err){
    $window.alert(err.data);
  }

  $scope.linkAccount = function(){

    var options = {connection: $scope.provider};
    auth.linkAccount(token, profile, options, successCallback, errCallback);
  }

  $scope.unLinkAccount = function(){
    //main provider connection
    var connection = profile.identities[0].connection;
    var provider = $scope.unLinkProvider;
    var options = {connection: provider};

    if(connection == provider) {
      $window.alert('You cannot unlink current connection');
      return;
    }

    auth.getProfile(token).then(function(profile){
      var secUser = $scope.searchProvider(provider, profile.identities);
      //if user don't have linked account with this provider
      if(!secUser){
        $window.alert('You have no linked account with ' + provider + ' provider');
        return;
      }
      var secUserId = secUser.user_id;
      auth.unLinkAccount(token, profile.user_id, provider, secUserId).then(function(res){
        $window.alert('Unlinked');
        //we need to update stored profile
        auth.getProfile(token).then(function(profile) {
          store.set('profile', profile);
        });
      }, function(err){
        $window.alert('Unlink failed');
      });
    })
  }

  $scope.searchProvider = function(provider, identities){
      for (var i=0; i < identities.length; i++) {
          if (identities[i].provider === provider) {
              return identities[i];
          }
      }
  }
}
