class Game
  constructor: (_model) ->
    model = _model
    model.players = [];
    model.round = 0;
    model.currentPlayer = 0;
    model.fieldWidth = fieldWidth;

    model;
    shipsProps = [10, 5, 5, 2, 2, 2];
    fieldWidth = 20;
    playersProps = [{type: 'human', name: 'Adam'}, {type: 'pc', name: 'COMP'}];

    init = () ->
      for playerProp in playersProps
        player = new Player(playerProp, shipsProps, fieldWidth, model)
        model.players.push player
        player.restart()
      true

    getOpponent = () ->
      if model.currentPlayer + 1 > playersProps.length - 1
        0;
      else
        model.currentPlayer + 1;

    nextPlayer = () ->
      model.currentPlayer++;
      if model.currentPlayer >= playersProps.length
        model.currentPlayer = 0;
      true

    getRandomFireProps = (field) ->
      props = {x: getRandomInteger(0, fieldWidth - 1), y: getRandomInteger(0, fieldWidth - 1)};
      props.shipNumber = field[props.y][props.x];
      props

    randomFire = () ->
      playerNumber = getOpponent();
      fireProps = getRandomFireProps(model.players[playerNumber].field);
      if fireProps.shipNumber < 0
        randomFire();
      else
        fire(playerNumber, fireProps.shipNumber, fireProps.y, fireProps.x);
      true

    killShip = (playerNumber, shipNumber) ->
      isAllDead = model.players[playerNumber].killShip(shipNumber);

      model.players[model.currentPlayer].addScore();

      if isAllDead
        model.players[model.currentPlayer].win();
        restart();
      true

    restart = () ->
      model.players.map (player) -> player.restart();
      true

    fire = (playerNumber, shipNumber, y, x) ->
      if typeof shipNumber isnt 'undefined' and shipNumber < 0
        return;

      if model.currentPlayer isnt playerNumber
        if shipNumber
          killShip(playerNumber, shipNumber, y, x);
        else
          model.players[playerNumber].emptyFire(shipNumber, y, x);
          nextPlayer();

        if model.players[model.currentPlayer].type is 'pc'
          randomFire();

    init();
    @fire = fire;