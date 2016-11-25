angular.module('battleship', []).controller 'gameCtrl', ($scope)->
 $scope.deads = []
 $scope.emptyFires = []
 game = new Game $scope
 $scope.fire = game.fire;
 true 