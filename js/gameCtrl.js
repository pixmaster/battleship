angular.module('battleship', []).controller('gameCtrl', function ($scope) {
  $scope.deads = [];
  $scope.emptyFires = [];

  var game = new Game($scope);

  $scope.fire = game.fire;
});