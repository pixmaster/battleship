function Ship (_coord, _size) {
  var that = this;
  this.x = _coord.x; // (0..20)
  this.y = _coord.y; // (0..20)
  this.size = _size; // 10(1), 5(2), 2(3)
  this.direction = _coord.direction || 'h'; // h | v
  this.health = 100; // 0 | 100

  this.kill = function () {
    that.health = 0;
  };

  this.isDead = function () {
    return (that.health === 0);
  };
}

function getRandomInteger (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

function Player (_playerProps, _shipsProps, _fieldWidth, _model) {
  var that = this;

  this.field = [];
  this.ships = [];
  this.wins = 0;
  this.score = 0;
  this.type = _playerProps.type;
  this.name = _playerProps.name;

  function initShips () {
    for (var i in _shipsProps) {
      that.ships.push(new Ship(generateCoord(parseInt(i)), _shipsProps[i]));
    }
  }

  function getRandomCoord () {
    return {x: getRandomInteger(0, _fieldWidth - 1), y: getRandomInteger(0, _fieldWidth - 1)};
  }

  function fillField (coord, shipNumber, direction) {
    var size = _shipsProps[shipNumber];

    if (direction === 'h') {
      for (var i = 0; i < size; i++) {
        that.field[coord.y][coord.x + i] = shipNumber + 1;
      }
    }
    else {
      for (var i = 0; i < size; i++) {
        that.field[coord.y + i][coord.x] = shipNumber + 1;
      }
    }
  }

  function generateCoord (shipNumber) {
    var size = _shipsProps[shipNumber];
    var coord = getRandomCoord();
    var direction = 'h';

    if (that.field[coord.y] && that.field[coord.y][coord.x]) {
      coord = generateCoord(size);
    }

    if (coord.x + size <= _fieldWidth) {
      direction = 'h';
    }
    else if (coord.x - size >= 0) {
      direction = 'h';
      coord.x -= size;
    }
    else if (coord.y + size <= _fieldWidth) {
      direction = 'v';
    }
    else if (coord.y - size >= 0) {
      direction = 'v';
      coord.y -= size;
    }
    else {
      coord = generateCoord();
    }

    fillField(coord, shipNumber, direction);
    coord.direction = direction;

    return coord;
  }

  function restart () {
    that.field = [];
    that.ships = [];

    for (var i = 0; i < _fieldWidth; i++) {
      that.field[i] = new Array(_fieldWidth);
      that.field[i].map(function (_item) {
        return _item = false;
      });
    }

    initShips();
  }

  function isAllShipDead () {
    var liveShips = that.ships.filter((_item) => {
      return !_item.isDead();
    });

    return (liveShips.length === 0);
  }

  this.win = function () {
    that.wins++;
  };

  this.killShip = function (shipNumber) {
    var ship = that.ships[shipNumber - 1];

    ship.kill();

    if (ship.direction === 'h') {
      for (var i = 0; i < ship.size; i++) {
        that.field[ship.y][ship.x + i] = -2;
      }
    }
    else {
      for (var i = 0; i < ship.size; i++) {
        that.field[ship.y + i][ship.x] = -2;
      }
    }

    return isAllShipDead();
  };

  this.emptyFire = function (shipNumber, y, x) {
    that.field[y][x] = -1;
  };

  this.addScore = function (_score) {
    that.score += _score || 1;
  };

  this.restart = restart;
}