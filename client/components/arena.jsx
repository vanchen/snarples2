/////////////////////////
  /* GLOBAL VARIABLES */
/////////////////////////
var makeBid = {position: 'absolute',height:'30%',width:'45%',top:'32%',left:'27%'}
var playOrSit =  {position: 'absolute',height:'30%',width:'20%',top:'32%',left:'35%'}
var bidBoxArray = [{position: 'absolute',height:'48%',width:'15%',top:'30%',left:'5%',opacity:1},
{position: 'absolute',height:'48%',width:'15%',top:'30%',left:'20%',opacity:1},
{position: 'absolute',height:'48%',width:'15%',top:'30%',left:'35%',opacity:1},
{position: 'absolute',height:'48%',width:'15%',top:'30%',left:'50%',opacity:1},
{position: 'absolute',height:'48%',width:'15%',top:'30%',left:'65%',opacity:1},
{position: 'absolute',height:'48%',width:'15%',top:'30%',left:'80%',opacity:1}]

const trumpBox1 =  {position: 'absolute',height:'48%',width:'18%',top:'30%',left:'11%'}
const trumpBox2 =  {position: 'absolute',height:'48%',width:'18%',top:'30%',left:'32%'}
const trumpBox3 =  {position: 'absolute',height:'48%',width:'18%',top:'30%',left:'53%'}
const trumpBox4 =  {position: 'absolute',height:'48%',width:'18%',top:'30%',left:'74%'}

var playBox =  {position: 'absolute',height:'48%',width:'40%',top:'30%',left:'10%'}
var sitBox =  {position: 'absolute',height:'48%',width:'40%',top:'30%',left:'50%'}

var userStyle = {position: 'absolute', width: '100%', height: '30%',top: '70%',left: '0',opacity:1};
var cardsStyle = {position: 'absolute', left: '22%', width:'75%'}
const scoreStyle = {position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)'}
const profileStyle ={position: 'absolute', width: '15%', height: '92%',left: '4%', background: 'white'}
const trumpStyle = {position: 'absolute', width: '50%', top: '30%', left: '25%'}
const trumpCard = {position: 'absolute', left: '81%', height: '92%', width: '15%'}
var cStyle = {width: '12%'}
const {Spring} = ReactMotion // USE: Animation of cards

// Session Variables to ensure proper timing of animation.... note: is this pattern the most efficient?
Session.setDefault('makingBid', false)
Session.setDefault('pickingTrump',false)
Session.setDefault('playCard',false)
Session.setDefault('updatingMatch',false)
Session.setDefault('PlayOrSit',false)
Session.setDefault('updatingMatch',false)
// Animation Speeds.. Controlled By User




/////////////////////////
  /* ARENA COMPONENT */
/////////////////////////


Arena = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var match = Matches.findOne(this.props.matchId);
    return {
      match: match,
      user: Meteor.user(),
      width: window.innerWidth,
    }
  },

  /* CHOICE METHODS */

  pickBid(event) {
    var bid = Number(event.target.id[3])
    var match = this.data.match
    var highBid = getHighBidder(match).currentBid
    if (bid > highBid || bid == 0) {
      var index = getPlayerIndex(match,Meteor.user()._id);
      match.players[index].currentBid = bid
      match.players[index].bidMade = true;
      match = changeTurn(match)
      Matches.update(match._id,{
        $set: {players: match.players}
      });
    }
  },
  pickTrump(e) {
    console.log(e.currentTarget.id)
    var match = this.data.match
    var index = getPlayerIndex(match,Meteor.user()._id);
    match.players[index].pickTrump = false;
    Session.set('pickingTrump',false)
    match.players[index].isPlayingChoice = true
    match.players[index].isPlaying = true
    //match.players[index].turn = false;
    //match = changeTurnLeftOfDealer(match)
    match = changeTurn(match)
    Matches.update(match._id,{
      $set : {trump: e.currentTarget.id , players: match.players}
    });
  },

  playOrSit(e) {
    var match = this.data.match
    console.log(e.currentTarget.id)
    var index = getPlayerIndex(match,Meteor.user()._id);
    // If User decides to play
    if (e.currentTarget.id == 'play') {
      match.players[index].isPlaying = true
      match.players[index].isPlayingChoice = true
      if (match.players[index].highBidder) {
        match.players[index].turn = false
        match = changeTurnLeftOfDealer(match)
        }
      else {
        match = changeTurn(match)
        match.players[index].currentBid = 1;
        }
      }
    // If user decides to sit.
    else {
      match.players[index].isPlaying = false
      match.players[index].isPlayingChoice = true;
      match = changeTurn(match)
      match.players[index].cards = []
      Session.set('animationSpeed',{slow:500,medium:500,fast:500})
    }

    Matches.update(match._id,{
      $set : {players: match.players}
    })
  },

  /* RENDER METHODS */

  renderChoice() {

  var match = this.data.match;
  var index = getPlayerIndex(match,Meteor.user()._id)

  // Check if it is user's turn to pick their bid
  if (match.cardsDealt == true && match.players[index].bidMade == false && match.players[index].turn == true) {
    // Find High Bidder and return bid boxes accordingly...
    var highBid = getHighBidder(match).currentBid
    if (highBid != 0) {
      for (let i=1; i <= highBid; i++) {
        bidBoxArray[i].opacity = 0
      }
    }

    return  (<div className="panel panel-info" style={makeBid}>
              <div className="panel-heading"> Make Your Bid: </div>
              <div className="panel-body">
                <div className="thumbnail bidBox1" id="bid0" onClick={this.pickBid} style={bidBoxArray[0]}> <h3 className="text-center"> 0 </h3></div>
                <div className="thumbnail bidBox1" id="bid1" onClick={this.pickBid} style={bidBoxArray[1]}> <h3 className="text-center"> 1 </h3></div>
                <div className="thumbnail bidBox2" id="bid2" onClick={this.pickBid} style={bidBoxArray[2]}> <h3 className="text-center"> 2 </h3></div>
                <div className="thumbnail bidBox3" id="bid3" onClick = {this.pickBid} style={bidBoxArray[3]}> <h3 className="text-center"> 3 </h3></div>
                <div className="thumbnail bidBox4" id="bid4" onClick = {this.pickBid} style={bidBoxArray[4]}> <h3 className="text-center"> 4 </h3></div>
                <div className="thumbnail bidBox5" id="bid5"  onClick = {this.pickBid} style={bidBoxArray[5]}> <h3 className="text-center"> 5 </h3></div>
              </div>
              </div>
            )
          }

  // Check if it is user's turn to pick trump
  if (match.cardsDealt == true && match.players[index].bidMade == true && match.players[index].pickTrump == true) {
    return  (<div className="panel panel-info" style={makeBid}>
              <div className="panel-heading"> Pick Trump: </div>
              <div className="panel-body">
                <div className="thumbnail bidBox1" id="spades" onClick={this.pickTrump} style={trumpBox1}> <img src="spade.png"/> </div>
                <div className="thumbnail bidBox2" id="hearts" onClick={this.pickTrump} style={trumpBox2}> <img src="hearts.jpg"/> </div>
                <div className="thumbnail bidBox3" id="clubs" onClick={this.pickTrump} style={trumpBox3}> <img src="clubs.png"/> </div>
                <div className="thumbnail bidBox4" id="diamonds" onClick={this.pickTrump} style={trumpBox4}> <img src="diamonds.png"/> </div>
              </div>
            </div>
            )
          }

  if (checkIfRoundCheck(match) == false && match.cardsDealt == true && match.players[index].bidMade == true && match.players[index].turn == true && match.trump != 'none') {
    if (match.players[index].highBidder) {
      match.players[index].isPlaying = true;
      updateMatch(match)
    }
    else {
        return  (<div className="panel panel-info" style={playOrSit}>
              <div className="panel-heading"> Play or Sit? </div>
              <div className="panel-body">
                <div className="thumbnail bidBox1" id="play" onClick={this.playOrSit} style={playBox}>  <h3 className="text-center"> Play </h3></div>
                <div className="thumbnail bidBox3" id="sit" onClick={this.playOrSit} style={sitBox}>  <h3 className="text-center"> Sit </h3> </div>
                </div>
              </div>
              )
          }
        }
  },

  renderCards(){
    var match = this.data.match
    var index = getPlayerIndex(match,Meteor.user()._id);
    var userCards = match.players[index].cards
    var fieldCheck = false;  // To check whether cards can be played or not

    // Create the initial positions of the user cards
    // TO DO: Sort cards by suit
    var xPos= window.innerWidth*0.26
    var yPos = window.innerHeight*0.70
    for (let i=0; i < userCards.length ; i++) {
      if (userCards[i] != 'nill') {
        var pos = xPos + this.data.width*0.090
        userCards[i].initial = {x:xPos, y:yPos}
      if (userCards[i].cardPlayed == false) {
        userCards[i].final = {x : xPos, y: yPos}
      }
      xPos = pos;
      }
    }

    // Check how many of the user's cards match the suit of the LeadCard
    if (match.fieldCards.length > 0) {
      var mCards = 0;
      var leadCard = getLeadCard(match);
      for (let i=0; i < userCards.length; i++) {
        if (userCards[i].suit == leadCard.card.suit) {
          mCards += 1;
          fieldCheck = true;
          break
        }
      }
    }
    return userCards.map((card) => {
      if (card != "nill") {
        return <UserCard match={match} id={card._id} style={cStyle} played={card.cardPlayed} fieldCheck={fieldCheck} suit={card.suit} image={card.image} defaultPosition={card.initial} finalPosition={card.final} />
        }
      });
    },

  renderPlayers(){
    var match = this.data.match
    // Only allows for the maxium of 5 non-user Players. Ideally this should be extened to nine computer players.
    var playerStyleArray = [{position: 'absolute', top: '50%', left: '10%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white',opacity:0.5},
    {position: 'absolute', top: '18%', left: '20%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white',opacity:0.5},
    {position: 'absolute', top: '18%', left: '47%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white',opacity:0.5},
    {position: 'absolute', top: '18%', left: '80%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white',opacity:0.5},
    {position: 'absolute', top: '50%', left: '90%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white',opacity:0.5}]
    var playerArray = []
    var currentPlayerIndex = getPlayerIndex(match, Meteor.user()._id)
    // Push to PlayerArray.. Arrange such that players are arranged to the left of the user.
    for (var i = (currentPlayerIndex+1); i < match.players.length; i++) {
      playerArray.push(match.players[i])
    }
    if (playerArray.length < (match.players.length-1)){
      for (var i =0; i < currentPlayerIndex; i++) {
        playerArray.push(match.players[i])
      }
    }
    var count = 0;
    return playerArray.map((player) => {
      var playerStyle = playerStyleArray[count];
      count +=1;
      if (player.isPlaying) {
        playerStyle.opacity = 1
      }
      else {
        playerStyle.opacity = 0.5
      }
      var score = player.score
      return (
        <Player match={match} player={player} playerStyle={playerStyle} />
        )
      });
    },

  renderBidBoxes() {
    var match = this.data.match;
    var bids = 0;
    var tricks = 0;
    for (var i=0; i < match.players.length; i++) {
      if (match.players[i].userId == Meteor.user()._id) {
        bids = match.players[i].currentBid;
        tricks = match.players[i].currentTrick
      }
    }
    var bidArray = [{size:10, background: 'white'},{size: 26, background: 'white'},{size:42,background: 'white'},{size:58,background: 'white'},{size:74,background: 'white'}];
    for (var i=0; i < bids; i++) {
      bidArray[i].background = 'black';
    }
    for (var i=0; i < tricks; i++) {
      bidArray[i].background = 'blue';
    }
    return bidArray.map((key) => {
      var left = String(key.size) + '%';
      var bidBoxStyle = {position: 'absolute', width: '15%', height: '15%', top: '80%', left: left, background: key.background}
      return <div className= "thumbnail" style={bidBoxStyle}></div>
      });
    },

  renderIcons() {
    // Render Dealer Chip and Change panel styling depending on turn?
    var match = this.data.match
    var index = getPlayerIndex(match,Meteor.user()._id)
    var style = {position: 'absolute', left: '90%', width: '10%'}
    if (match.players[index].dealer) {
      return <img src='game_casino.png' style={style}/>
      }
    },

  renderTrump() {
    // Can be added to the render method if the extension is fixed.
    var match = this.data.match
    if (match.trump == 'hearts') {
      return match.trump + '.jpg'
    }
    if (match.trump == 'spades' || match.trump == 'clubs' || match.trump == 'diamonds') {
      return match.trump + '.png'
    }
  },

  renderStyle() {
    var match = this.data.match
    var index = getPlayerIndex(match,Meteor.user()._id)
    if (match.players[index].turn) {
      return {background: 'green'}
    }
    else {
      return {background: 'red'}
    }
  },

  render() {
    match = this.data.match
    var turnId = ""

    // 0: if game is over, run logic
    if (match.winner) {
      alert("This game is over! The Winner is ____")
    }


    // 1: Start match if all players are in the Arena
    if (!match.dealer && match.players.length == match.totalPlayers) {
      match = startMatch(match);

      console.log("Starting match...")
    }

    // 2: If match has dealer, allow game to start
    if (match.dealer && Session.get('updatingMatch') == false && match.winner == false) {

    // 3: End Round
    if (match.round == 5) {
      console.log("Ending round...")
      match = updateScore(match);
      match = checkIfPunted(match)
      match = checkIfWinner(match)
      match = changeDealer(match);
      match = changeTurnLeftOfDealer(match);
      // ARBITRARY FIX... better way is to only reset the cards that have already been played
      match.cards = deckReset(match);
      match.usedCards = []
      match = dealCards(match);
      match = sortBySuit(match)
      match = resetBids(match);
      for (let i=0; i < bidBoxArray.length; i++) {
        bidBoxArray[i].opacity = 1;
      }
      match.round = 0;
      match.roundCheck = false;
      match.trump = 'none'
      Session.set('playCard',false)
      Session.set('animationSpeed', {fast: 1000, medium: 2000, slow: 3000})
      Session.set('updatingMatch',false)
        }

      // 4: Deal cards
      if (match.cardsDealt == false) {
        console.log("Dealing cards...")
        match = dealCards(match)
        // Sort user cards by suit here...
        match = sortBySuit(match)
      }


      // 5: Make bids
      if (bidsComplete(match) == false) {
        turnId = getPlayerTurn(match)
        console.log(match)
        console.log(turnId)
        if (Session.get('makingBid') == false) {
          if (turnId[0] + turnId[1] + turnId[2] == 'com') {
            Session.set('makingBid',true)
            Meteor.setTimeout(function(){
              Session.set('makingBid',false)
              match = changeTurn(match)
              let bid = getComputerBid(turnId,match)
              let index = getPlayerIndex(match,turnId)
              match.players[index].currentBid = bid;
              match.players[index].bidMade = true;
              updateMatch(match)},Session.get('animationSpeed').medium);
            }
          }
        }

      // 6: Pick Trump
      if (bidsComplete(match) && match.trump == 'none') {
        if (Session.get('pickingTrump') == false) {
          console.log("Picking trump...")
          Session.set('pickingTrump', true)
          if (match.players[getPlayerIndex(match,Meteor.user()._id)].pickTrump) {
            console.log("User is picking trump...")
          }
          else {
          Meteor.setTimeout(function(){
            match = setTrump(match);
            Session.set('pickingTrump',false)
            Session.set('playCard',true)
            updateMatch(match)},Session.get('animationSpeed').medium);
          }
        }

      }

      // 7: Play or Sit
      if (checkIfRoundCheck(match) == false && bidsComplete(match) && match.trump != 'none'){
        // If trump is spades, everyone must play
        if (match.trump == 'spades') {
          for (let i = 0; i < match.players.length; i++) {
            match.players[i].isPlaying = true
            match.players[i].isPlayingChoice = true
            if (match.players[i].highBidder == false) {
              match.players[i].currentBid = 1;
            }
          }
        }
        else {
          turnId = getPlayerTurn(match)
          if (Session.get('PlayOrSit') == false) {
            if (turnId[0] + turnId[1] + turnId[2] == 'com') {
              Session.set('PlayOrSit',true)
              Meteor.setTimeout(function(){
              Session.set('PlayOrSit',false)
              let index = getPlayerIndex(match,turnId)
                if (match.players[index].highBidder == false) {
                  match = changeTurn(match)
                  // REQUIRED: Algorithm to determine if a computer is playing or not. If player bids high, must play.
                  match = checkIfPlaying(match,index)
                  //match.players[index].isPlaying = true;
                  //match.players[index].isPlayingChoice = true;
                  //match.players[index].currentBid = 1;
                }
                else {
                  match.players[index].isPlaying = true
                  match.players[index].isPlayingChoice = true;
                }
                updateMatch(match)},Session.get('animationSpeed').medium);
              }
            }
          }
        }

      if (checkIfRoundCheck(match) && match.roundCheck == false){
        Meteor.setTimeout(function() {
        for (let i=0; i < match.players.length; i++) {
          match.players[i].turn = false
        }
        match = changeTurnLeftOfDealer(match)
        match.roundCheck = true;
        console.log("ROUND CHECK COMPLETE")
        updateMatch(match)
      },1000);
      }

      turnId = getPlayerTurn(match)

      // 8: If computer's turn, play computer card
      if (checkIfRoundCheck(match) && match.type == 'computer' && match.cardsPlayed < match.players.length && (turnId[0] + turnId[1] + turnId[2] == 'com') && match.trump != 'none') {
        if (bidsComplete(match) && Session.get('playCard') && match.roundCheck == true && match.players[getPlayerIndex(match,turnId)].isPlaying) {
        Meteor.setTimeout(function() {
          match = playComputerCard(match,turnId)
          updateMatch(match)}, Session.get('animationSpeed').fast)
        }
      }

      // CHECK TO SEE WHO IS PLAYING
      if (checkIfRoundCheck(match) && match.roundCheck) {
        var playerCount = 0;
        for (let i =0; i < match.players.length; i++) {
          if (match.players[i].isPlaying) {
            playerCount += 1;
          }
        }
        if (match.players[getPlayerIndex(match,turnId)].isPlaying == false) {
          match = changeTurn(match)
        }
      }


      // 9: If all cards played, calculate trick
      if (match.cardsPlayed == playerCount) {
        for (let i=0; i< match.players.length; i++) {
          match.players[i].turn = false
        }
        console.log("Updating tricks....")
        Session.set('updatingMatch',true)
        Meteor.setTimeout(function() {
          match = updateTrick(match)
          Session.set('updatingMatch',false)
          updateMatch(match)}, Session.get('animationSpeed').medium)
        }
      }

    updateMatch(match)

    return (
      <div className="container-fluid">
            {this.renderPlayers()}
            {this.renderChoice()}

            <div style={userStyle}>
              <div className="user-profile panel panel-info" style={profileStyle}>
                <div style={this.renderStyle()} className="panel-heading"> </div>
                <h1 style={scoreStyle}> {match.players[getPlayerIndex(match,Meteor.user()._id)].score} </h1>
                {this.renderBidBoxes()}
                {this.renderIcons()}
              </div>
            <div className="panel panel-info"  style={trumpCard}>
              <div className="panel-heading"> </div>
              <img src={this.renderTrump()} className="responsive trump-style" style={trumpStyle}/>
            </div>
          </div>
          {this.renderCards()}


      </div>
      )
    }
  })
