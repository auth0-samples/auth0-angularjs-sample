angular.module('app')
.controller('SettingsCtrl', ['$scope', 'auth', 'store', '$window', 'authHelper', settingsCtrlFunc]);

function settingsCtrlFunc($scope, auth, store, $window, authHelper){
  $scope.providers = [
    {title: 'Facebook', value: 'facebook'},
    {title: 'Github', value: 'github'},
    {title: 'Google', value: 'google-oauth2'},
    {title: 'Twitter', value: 'twitter'}
  ]

   $scope.searchProvider = function(provider, identities){
      for (var i=0; i < identities.length; i++) {
          if (identities[i].provider === provider) {
              return identities[i];
          }
      }
    }

  var token = store.get('token');
  var profile = store.get('profile');

  $scope.linkAccount = function(){
    auth.signin();
  }

  $scope.unLinkAccount = function(){
    console.log(profile);
    //main provider connection
    var connection = profile.identities[0].connection;
    //secondary provider
    var provider = $scope.unLinkProvider;

    if(connection == provider) {
      $window.alert('You cannot unlink current connection');
      return;
    }

    var secUser = $scope.searchProvider(provider, profile.identities);
      //if user don't have linked account with this provider
      if(!secUser){
        $window.alert('You have no linked account with ' + provider + ' provider');
        return;
      }
    var secUserId = secUser.user_id;

    authHelper.tryUnlinking(token, provider, secUserId, profile.user_id).success(function (unlinkResult) {
      console.log('Unlinked');
    }).error(function (err) {
      console.log('Unlink err', err);
    })
  }
}
