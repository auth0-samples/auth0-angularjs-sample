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
  }

  var errCallback = function(err){
    $window.alert(err.data.message);
  }

  $scope.linkAccount = function(){

    var options = {connection: $scope.provider};
    auth.linkAccount(token, profile, options, successCallback, errCallback);
  }

  $scope.unLinkAccount = function(){
    var provider = $scope.unLinkProvider;
    var options = {connection: provider}

    auth.getProfile(token).then(function(profile){

      var secUserId = $scope.searchProvider(provider, profile.identities).user_id;
      auth.unLinkAccount(token, profile.user_id, provider, secUserId).then(function(res){
        $window.alert('Unlinked')
      }, function(err){
        $window.alert('Unlink failed')
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
