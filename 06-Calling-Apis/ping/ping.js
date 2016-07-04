angular.module('app')
.controller('PingCtrl', ['$scope', 'auth', 'store', '$http', loginCtrlFunc]);

function loginCtrlFunc($scope, auth, store, $http){
  var url = 'http://localhost:5000/api/todos';
  $scope.todos = [];
  $http.get(url).then(function(response){
    $scope.todos = response.data;
  }, function(err){
    console.log(err);
  });

  $scope.addTodo = function(){
    $scope.todo.creator = store.get('profile').name;
    $http.post(url, $scope.todo).then(function(response){
      $scope.todos = response.data;
    }, function(err){
      console.log(err);
    });
  };
}
