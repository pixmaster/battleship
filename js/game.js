function Game (_model) {
  var shipsProps = [10, 5, 5, 2, 2, 2];
  var fieldWidth = 20;
  var playersProps = [{type: 'human', name: 'Adam'}, {type: 'pc', name: 'COMP'}];

  _model.players = [];
  _model.round = 0;
  _model.currentPlayer = 0;
  _model.fieldWidth = fieldWidth;

  function init () {
    var player;
    for (var i in playersProps) {
      player = new Player(playersProps[i], shipsProps, fieldWidth, _model);
      _model.players.push(player);
      player.restart();
    }
  }

  function getOpponent () {
    if (_model.currentPlayer + 1 > playersProps.length - 1) {
      return 0;
    }
    else {
      return _model.currentPlayer + 1;
    }
  }

  function nextPlayer () {
    _model.currentPlayer++;
    if (_model.currentPlayer >= playersProps.length) {
      _model.currentPlayer = 0;
    }
  }

  function getRandomFireProps (field) {
    var props = {x: getRandomInteger(0, fieldWidth - 1), y: getRandomInteger(0, fieldWidth - 1)};

    props.shipNumber = field[props.y][props.x];

    return props;
  }

  function randomFire () {
    var playerNumber = getOpponent();
    var fireProps = getRandomFireProps(_model.players[playerNumber].field);

    if (fireProps.shipNumber < 0) {
      randomFire();
    }
    else {
      fire(playerNumber, fireProps.shipNumber, fireProps.y, fireProps.x);
    }
  }

  function killShip (playerNumber, shipNumber) {
    var isAllDead = _model.players[playerNumber].killShip(shipNumber);

    _model.players[_model.currentPlayer].addScore();

    if (isAllDead) {
      _model.players[_model.currentPlayer].win();
      restart();
    }
  }

  function fire (playerNumber, shipNumber, y, x) {
    if (typeof shipNumber !== 'undefined' && shipNumber < 0) return;

    if (_model.currentPlayer !== playerNumber) {
      if (shipNumber) {
        killShip(playerNumber, shipNumber, y, x);
      }
      else {
        _model.players[playerNumber].emptyFire(shipNumber, y, x);
        nextPlayer();
      }

      if (_model.players[_model.currentPlayer].type === 'pc') {
        randomFire();
      }
    }
  }

  function restart () {
    _model.players.map(function (player) {
      player.restart();
    });
  }

  this.fire = fire;
  init();
}