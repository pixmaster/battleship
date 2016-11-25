getRandomInteger = (min, max) ->
  rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  rand;

class Ship
  constructor: (_coord, _size) ->
    @x = _coord.x; # (0..20)
    @y = _coord.y; # (0..20)
    @size = _size; # 10(1), 5(2), 2(3)
    @direction = _coord.direction || 'h'; # h | v
    @health = 100; # 0 | 100

  kill: () ->
    @health = 0

  isDead: () ->
    @health is 0

class Player
  constructor: (_playerProps, _shipsProps, _fieldWidth, _model) ->
    @field = [];
    @ships = [];
    @wins = 0;
    @score = 0;
    @type = _playerProps.type;
    @name = _playerProps.name;

    that = @

    shipsProps = _shipsProps;
    fieldWidth = _fieldWidth;
    model = _model;

    initShips = () ->
      for shipProp, shipIndex in shipsProps
        that.ships.push(new Ship(generateCoord(shipIndex), shipProp));
      true

    getRandomCoord = () ->
      {x: getRandomInteger(0, fieldWidth - 1), y: getRandomInteger(0, fieldWidth - 1)};

    fillField = (coord, shipNumber, direction) ->
      size = shipsProps[shipNumber];

      if direction is 'h'
        for i in [0..size-1]
          that.field[coord.y][coord.x + i] = shipNumber + 1;
      else
        for i in [0..size-1]
          that.field[coord.y + i][coord.x] = shipNumber + 1;
      true

    generateCoord = (shipNumber) ->
      size = shipsProps[shipNumber];
      coord = getRandomCoord();
      direction = 'h';

      if that.field[coord.y] and that.field[coord.y][coord.x]
        coord = generateCoord(size);

      if coord.x + size <= fieldWidth
        direction = 'h';
      else if coord.x - size >= 0
        direction = 'h';
        coord.x -= size;
      else if coord.y + size <= fieldWidth
        direction = 'v';
      else if coord.y - size >= 0
        direction = 'v';
        coord.y -= size;
      else
        coord = generateCoord();

      fillField(coord, shipNumber, direction);
      coord.direction = direction;

      coord;

    restart = () ->
      that.field = [];
      that.ships = [];

      for i in [0..fieldWidth-1]
        that.field[i] = new Array(fieldWidth);
        that.field[i].map((_item) -> _item = false);

      initShips();

    isAllShipDead = () ->
      liveShips = that.ships.filter((_item) -> !_item.isDead());
      liveShips.length is 0

    @win = () ->
      that.wins++;

    @killShip = (shipNumber) ->
      ship = that.ships[shipNumber - 1];

      ship.kill();

      if ship.direction is 'h'
        for i in [0..ship.size-1]
          that.field[ship.y][ship.x + i] = -2;
      else
        for i in [0..ship.size-1]
          that.field[ship.y + i][ship.x] = -2;

      isAllShipDead();

    @emptyFire = (shipNumber, y, x) ->
      that.field[y][x] = -1;

    @addScore = (_score) ->
      that.score += _score || 1;

    @restart = restart;