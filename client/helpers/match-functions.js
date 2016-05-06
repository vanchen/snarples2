/////////////////////////
/*       GLOBALS       */
/////////////////////////

//var playerStyleArray = [{position: 'absolute', top: '50%', left: '10%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white'},
//{position: 'absolute', top: '18%', left: '20%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white'},
//{position: 'absolute', top: '18%', left: '47%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white'},
//{position: 'absolute', top: '18%', left: '80%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white'},
//{position: 'absolute', top: '50%', left: '90%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white'}]

var playerStyleArray = [{position: 'absolute', top: '50%', left: '10%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white',opacity:0.5},
{position: 'absolute', top: '18%', left: '10%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white',opacity:0.5},
{position: 'absolute', top: '18%', left: '30%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white',opacity:0.5},
{position: 'absolute', top: '18%', left: '50%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white',opacity:0.5},
{position: 'absolute', top: '18%', left: '70%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white',opacity:0.5},
{position: 'absolute', top: '18%', left: '90%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white',opacity:0.5},
{position: 'absolute', top: '50%', left: '90%', width: '10%', height: '20%', transform: 'translate(-50%, -50%)', background: 'white',opacity:0.5}
]


/////////////////////////
/*       LOGIC         */
/////////////////////////


startMatch = function(match) {
  /* Document -> Document
     Find dealer and return updated document
     TO DO:  Add animation
  */
  Session.set('animationSpeed', {fast: 1000, medium: 2000, slow: 2500})
  var index = getPlayerIndex(match,Meteor.user()._id);
  // CONTROL-FLOW #1: DEAL ONE CARD
  if (match.players[index].cards.length == 0 && match.fieldCards.length == 0) {
      var card = getCard(match)
      match.players[index].cards.push(card.card);
      match.cards.splice(card.index,1);
      match.usedCards.push(card.card)
    //if (match.type == 'computer' || match.type == 'computer and player') {
      for (var i=0; i < match.players.length; i++) {
        if (match.players[i].isComputer) {
          console.log("What's going on?")
          var card = getCard(match)
          match.players[i].cards.push(card.card);
          match.cards.splice(card.index,1);
          match.usedCards.push(card.card)
        }
      }
  }

  // CONTROL-FLOW #1: PLAY CARD
  if (match.usedCards.length == match.players.length) {
    match.fieldCards.push({card: match.players[index].cards[0], owner: Meteor.user()._id})
    match.players[index].cards.splice(0,1)
    //if (match.type == 'computer' || match.type == 'computer and player') {
      for (var i=0; i < match.players.length; i++) {
        if (match.players[i].isComputer) {
          match.fieldCards.push({card: match.players[i].cards[0], owner: match.players[i].userId })
          match.players[i].cards.splice(0,1)
      //  }
      }
    }
  }

  // CONTROL;FLOW #1: FIND HIGHEST CARD
  if (match.fieldCards.length == match.players.length) {
    match.fieldCards = cardSort(match.fieldCards)
    var dealer = match.fieldCards[0].owner
    var dealerIndex = getPlayerIndex(match,dealer)
    match.players[dealerIndex].dealer = true;
    match.fieldCards = [];
    match.cards = deckReset(match);
    match.usedCards = [];
    match.dealer = true;
    match = changeTurnLeftOfDealer(match);
  }

  return match
}


/////////////////////////
/*       UTILITY       */
/////////////////////////


/* CARD FUNCTIONS */

dealCards = function(match) {
  /* Document -> Document ; Signature
     Push 5 Cards objects onto the Document.players array.
  */
  var newCards = [];
  for (var j=0; j < 5; j++) {
    for (var i=0; i < match.players.length; i++) {
      var card = getCard(match)
      match.players[i].cards.push(card.card);
      //newCards.push(card.card)
      match.usedCards.push(card.card)
      match.cards.splice(card.index,1);
      if (match.cards.length == 0) {
        match.cards = deckReset(match);
        //match.usedCards = newCards;
        match.usedCards = []
      }
    }
  }
  //match.usedCards = match.usedCards.concat(newCards)
  match.cardsDealt = true;
  return match
}

sortBySuit = function(match) {
  /* Document -> Document
     Sort user cards by suit
     MESSY FUNCTION.. NEEDS A FIX... ARRANGE BY SUIT AND HIGHEST CARD1
  */
  var index = getPlayerIndex(match, Meteor.user()._id)
  var userCards = match.players[index].cards
  var suitArray = ['hearts','diamonds','clubs','spades']
  var cardArray = []
  for (var j=0; j < suitArray.length; j++) {
    var count =0;
    for (var i=0; i < userCards.length; i++){
      if (userCards[i].suit == suitArray[j]){
        cardArray.push(userCards[i])
        count += 1
      }
    }
    if (count > 1) {
      do {
        cardsSwitched = 0;
        for (var i = cardArray.length - count; i < cardArray.length -1; i++) {
          if (cardArray[i].number < cardArray[i+1].number) {
            var tmp = cardArray[i];
            cardArray[i] = cardArray[i+1]
            cardArray[i+1] = tmp;
            cardsSwitched += 1;
          }
        }
      } while (cardsSwitched > 0);
    }
  }
  match.players[index].cards = cardArray
  return match
}

/* GET FUNCTIONS */

getPlayerTurn = function(match) {
  for (let i =0 ; i < match.players.length; i++) {
    if (match.players[i].turn) {
      return match.players[i].userId
    }
  }
}

getPlayerIndex = function(match,userId) {
  /* Document -> Number
     Return the index to the players array for the current user
  */
  for (var i = 0; i < match.players.length; i++) {
    if (match.players[i].userId == userId) {
      return i;
    }
  }
}

getPlayerPosition = function(match,playerId) {
  var playerArray = []
  var currentPlayerIndex = getPlayerIndex(match, Meteor.user()._id)
  for (var i = (currentPlayerIndex+1); i < match.players.length; i++) {
    playerArray.push(match.players[i])
  }
  if (playerArray.length < (match.players.length-1)){
    for (var i =0; i < currentPlayerIndex; i++) {
      playerArray.push(match.players[i])
    }
  }
  for (let i = 0; i < playerArray.length; i++) {
    if (playerArray[i].userId == playerId) {
      // Require a more general way to obtain the position of the player component
      var top = playerStyleArray[i].top
      var left = playerStyleArray[i].left
      var yPerc = Number('0' + '.' + top[0] + top[1])
      var xPerc = Number('0' + '.' + left[0] + left[1])
      var xPos = window.innerWidth*xPerc
      var yPos = window.innerHeight*yPerc
      return {x: xPos, y: yPos}
    }
  }
}

getComputerBid = function(playerId,match) {
  /* Object -> Number
    Compute the number of bids the computer should make
  */
  var currentHighestBid = 0;
  var index = getPlayerIndex(match,playerId)
  console.log(index + " " + "is making bid...")
  for (let i=0; i < match.players.length; i++) {
    if (match.players[i].userId != playerId) {
      if (match.players[i].currentBid > currentHighestBid) {
        currentHighestBid = match.players[i].currentBid
      }
    }
  }
  if (currentHighestBid == 0) {
    return 1
  }
  // Are you conservative or risky?
  var cards = sortComputerCards(match.players[index].cards)
  var highSuit = cards[0].suit;
  var count = 1;
  for (let i = 1; i < cards.length; i++) {
    if (cards[i].suit == highSuit) {
      if (cards[i].number >= 9) {
        count += 1;
      }
    }
  }
  if (count > currentHighestBid) {
    return count
  }
  else {
    count = 1;
    for (let i = 1; i < cards.length; i++) {
      if (cards[i].suit == highSuit) {
          count += 1;
      }
    }
    if (count > 3) {
      return 2
    }
    else {
      count = 0;
      return count
    }
  }
}

getHighBidder = function(match) {
  var highBid = {};
  for (var i = 0; i < match.players.length; i++) {
    if (match.players[i].turn) {
      highBid = match.players[i]
      break
    }
  }

  for (var i = 0; i < match.players.length; i++) {
    if (match.players[i].currentBid > highBid.currentBid) {
      highBid = match.players[i]
    }
  }

  return highBid
}


/* CHECK FUNCTIONS */

bidsComplete = function(match) {
  var check = 0;
  for (var i=0; i < match.players.length; i++) {
    if (match.players[i].bidMade || match.players[i].punted) {
      check +=1;
    }
  }

  if (check == match.players.length){
    return true;
  }
  else {
    return false
  }
}


sortComputerCards = function(cards) {
  var cardsSwitched = 0;
  do {
    cardsSwitched = 0;
    for (var i =0; i < cards.length -1; i++) {
      if (cards[i].number < cards[i+1].number) {
        var tmp = cards[i];
        cards[i] = cards[i+1]
        cards[i+1] = tmp;
        cardsSwitched += 1;
      }
    }
  } while (cardsSwitched > 0);
  return cards
}


sortFieldCards = function(cards) {
  var cardsSwitched = 0;
  do {
    cardsSwitched = 0;
    for (var i =0; i < cards.length -1; i++) {
      if (cards[i].card.number < cards[i+1].card.number) {
        var tmp = cards[i];
        cards[i] = cards[i+1]
        cards[i+1] = tmp;
        cardsSwitched += 1;
      }
    }
  } while (cardsSwitched > 0);
  return cards
}


/////////////////////////
/* COMPUTER FUNCTIONS */
/////////////////////////


playHighestCard = function(match,index) {
  /* (Document,Number) --> Document
     Play highest card.
  */
  match.fieldCards.push({card: match.players[index].cards[0], owner: match.players[index].userId, leadCard: true})
  match.players[index].cards[0].cardPlayed = true;
  match.players[index].cards[0].position = match.fieldCards.length - 1
  match.cardsPlayed += 1;
  match = changeTurn(match)
  return match
}

playComputerCard = function(match,pIndex,cIndex) {
  /* (Document,Number,Number) --> Document
     Play chosen card.
  */
  match.fieldCards.push({card: match.players[pIndex].cards[cIndex], owner: match.players[pIndex].userId, leadCard: false})
  match.players[pIndex].cards[cIndex].cardPlayed = true;
  match.players[pIndex].cards[cIndex].position = match.fieldCards.length - 1
  match = changeTurn(match)
  match.cardsPlayed += 1;
  Session.set('playText',match.players[pIndex].userId + " " + "is playing the " + match.players[pIndex].cards[cIndex].number + " " + "of" + " " + match.players[pIndex].cards[cIndex].suit)
  return match
}

computerCardAlgorithm = function(match,turnId) {
  var i = getPlayerIndex(match,turnId)

  // 1: Sort player cards from highest to lowest
  var cardsSwitched = 0;
  do {
    cardsSwitched = 0;
    for (var j =0; j < match.players[i].cards.length -1; j++) {
      if (match.players[i].cards[j].number < match.players[i].cards[j+1].number) {
        var tmp = match.players[i].cards[j];
        match.players[i].cards[j] = match.players[i].cards[j+1]
        match.players[i].cards[j+1] = tmp;
        cardsSwitched += 1;
        }
      }
    } while (cardsSwitched > 0);

  // 2:  If no cards are played, computer card becomes Lead Card.  Highest card played.... Add possible algorithm which decides whether to play a trump or not
  if (match.fieldCards.length == 0) {
    return playHighestCard(match,i)
  }
  else {
    var leadCard = getLeadCard(match)
    var fieldCards = sortFieldCards(match.fieldCards)
    var isTrump = false;
    var highTrump = 0;
    for (let i =0; i < fieldCards.length; i++) {
      // Has a trump card been played?
      if (fieldCards[i].card.suit == match.trump) {
        isTrump = true;
        highTrump = fieldCards[i].card.number
        break
      }
    }
    if (isTrump) {
    // If a trump card has been played, user plays lowest matched suit (if any)
      for (var j =match.players[i].cards.length-1; j >= 0; j--) {
        if (match.players[i].cards[j].suit == leadCard.card.suit) {
          return playComputerCard(match,i,j)
        }
      }
    }
    else {
      for (var j =0; j < match.players[i].cards.length; j++) {
      // Either a) highest matched suit or b) lowest matched suit (if any)
        if (match.players[i].cards[j].suit == leadCard.card.suit) {
          if (match.players[i].cards[j].number > leadCard.card.number) {
            return playComputerCard(match,i,j)
          }
          else {
            for (var j =match.players[i].cards.length-1; j >= 0; j--) {
              if (match.players[i].cards[j].suit == leadCard.card.suit) {
                return playComputerCard(match,i,j)
              }
            }
          }
        }
      }
    }

    // 3:  If no matching suit is found then play highest card (if trump and can win, else play lowest card.)
    for (var j =0; j < match.players[i].cards.length; j++) {
      if (match.players[i].cards[j].suit == match.trump) {
        if (isTrump) {
          if (match.players[i].cards[j].number > highTrump) {
            return playComputerCard(match,i,j)
          }
        }
        else {
          return playComputerCard(match,i,j)
        }
      }
    }
    var l = match.players[i].cards.length
    return playComputerCard(match,i,l-1)
  }
}

/////////////////////////
/* UPDATE FUNCTIONS */
/////////////////////////

updateMatch = function(match) {
  /* Document -> NaN
     Update Match
  */
  Matches.update(match._id,{
    $set :{
          players: match.players,
          cards: match.cards,
          usedCards: match.usedCards,
          fieldCards: match.fieldCards,
          round:  match.round,
          trump: match.trump,
          cardsPlayed: match.cardsPlayed,
          cardsDealt: match.cardsDealt,
          dealer: match.dealer,
          roundCheck: match.roundCheck,
          winner: match.winner
          }
        });
}

updateBids = function(match,bid) {
  /* (Document, Number) -> NaN ; Signature
     Update current User's bid property of the Document.
  */
  var players = match.players;
  for (var i =0; i < players.length; i++) {
    if (players[i].userId == Meteor.user()._id) {
      players[i].currentBid = bid;

      // A turn change is made here.  Does this make sense to include within the function?

      players[i].turn = false;
      if (i == players.length -1) {
        players[0].turn = true
      }
      else {
        players[i+1].turn = true
      }
    }
  }
  Matches.update(match._id, {
    $set : {players: players}
  });
}

updateTrick = function(match) {
  /* Document -> Document; Signature
   Find owner of winning card and update Document.Player.currentTrick
  */

  //VARIABLES
  // Remove all played cards from player card arrays
  var winner = findWinner(match,cardSort(match.fieldCards),match.trump);
  var index = getPlayerIndex(match,winner);
  Session.set('winningIndex', index)
  Session.set('endOfTrick', true)
  match.players[index].currentTrick += 1;
  match.players[index].turn = true;
  Session.set('playText', match.players[index].userId + " wins the trick!")
  for (var i =0; i < match.players.length; i++) {
    if (i != index) {
      match.players[i].turn = false;
    }
  }
  for (let i = 0; i < match.players.length; i++) {
    for (let j = 0; j < match.players[i].cards.length; j++) {
      if (match.players[i].cards[j].cardPlayed) {
        if (match.players[i].userId == Meteor.user()._id) {
          match.players[i].cards[j] = "nill"
        }
        else {
          match.players[i].cards.splice(j,1)
        }
      }
    }
  }
  match.cardsPlayed = 0;
  match.fieldCards = [];
  match.round += 1;
  return match
  //
}

updateScore = function(match) {
  /* Document -> Document
     Subtract currentTrick from Score for each player
  */
  for (var i=0; i < match.players.length; i++) {
    // Check to see who is playing this round
    if (match.players[i].isPlaying) {
      // High Bidder must make their bid, or else punted.
      if (match.players[i].highBidder){
        if (match.players[i].currentBid > match.players[i].currentTrick) {
          match.players[i].score = match.players[i].score + 5;
          match.players[i].currentTrick = 0;
          match.players[i].highBidder = false;
        }
        else {
          match.players[i].score = match.players[i].score - match.players[i].currentTrick
          match.players[i].currentTrick = 0;
          match.players[i].highBidder = false;
        }
      }
      // If not high biddder, player must get at least one trick
      else {
        if (match.players[i].currentTrick == 0) {
          match.players[i].score = match.players[i].score + 5
          match.players[i].currentTrick = 0;
        }
        else {
          match.players[i].score = match.players[i].score - match.players[i].currentTrick
          match.players[i].currentTrick = 0;
        }
      }
    }
  }
  // Set all turns to false and remove 'nil' cards from all non-computer players
  for (var i=0; i < match.players.length; i++) {
    if (match.players[i].userId == Meteor.user()._id) {
      for (let j=0; j < match.players[i].cards.length; j++) {
        if (match.players[i].cards[j] == "nill") {
          match.players[i].cards.splice(j,1)
        }
      }
    }
    match.players[i].turn = false;
  }



  return match
}

resetBids = function(match) {
  /* Document -> Document
     Reset currentBids to 0 and madeBids to false.. also reset isPlaying and isPlayingChoice player properties
 */
 for (var i=0; i< match.players.length; i++) {
   match.players[i].currentBid = 0;
   match.players[i].bidMade = false;
   match.players[i].isPlaying = false;
   match.players[i].isPlayingChoice = false
   }
 return match
}

deckReset = function(match) {
  /* Document -> NaN
     Push usedCards back onto the Cards array
  */
  var usedCards = match.usedCards;
  var cards = match.cards;
  for (var i=0; i < usedCards.length; i++) {
    cards.push(usedCards[i])
  }
  return cards
}

changeTurnLeftOfDealer = function(match) {
  /* Document -> Document
     Change turn to player left of the dealer
  */
  for (var i =0; i < match.players.length; i++) {
    if (match.players[i].dealer){
      if (i == (match.players.length -1)) {
        match.players[0].turn = true
        break
      }
      else {
        match.players[i+1].turn = true
        break
      }
    }
  }
  return match
}

changeTurn = function(match) {
  /* Document -> Document
     Change turn to player to the left of current turn
  */
  for (var i =0; i < match.players.length; i++) {
    if (match.players[i].turn){
      if (i == (match.players.length -1)) {
        match.players[0].turn = true
        match.players[i].turn =false;
        break
      }
      else {
        match.players[i].turn = false
        match.players[i+1].turn = true
        break
      }
    }
  }
  return match

}

changeDealer = function(match) {
  /* Document -> Document
    Change dealer to the player on the left
  */
  for (var i=0; i < match.players.length; i++) {
    if (match.players[i].dealer) {
      if (i == (match.players.length - 1)){
        match.players[0].dealer = true;
        match.players[i].dealer = false;
        break
      }
      else {
        match.players[i+1].dealer = true;
        match.players[i].dealer = false
        break
      }
    }
  }
  return match
}


/////////////////////////
/* MATCH FUNCTIONS */
/////////////////////////

checkIfPunted = function(match) {
  /* Document -> Document
    Check if any players have been punted. If so, remove from game.
  */
  for (let i=0; i <match.players.length; i++) {
    if (match.players[i].score > 32) {
      console.log(match.players[i].userId + " " + "has been punted!")
      if (match.players[i].dealer) {
        if (i == 0) {
          match.players[match.players.length -1].dealer = true
        }
        else {
          match.players[i-1].dealer = true
        }
      }
      match.players[i].isPlaying = false
      match.players[i].punted = true
    }
  }
  return match
}

checkIfWinner = function(match) {
  /* Document -> Document
    Check if anyone has won the game (score <= 0)
  */
  for (let i=0; i <match.players.length; i++) {
    if (match.players[i].score <= 0) {
      alert(match.players[i].userId + " " + "has won!!")
      match.winner = true;
    }
  }
  return match


}

checkIfPlaying = function(match,index) {
  if (match.players[index].sits == 2) {
    match.players[index].isPlaying = true;
    match.players[index].isPlayingChoice = true;
    match.players[index].currentBid = 1;
    match.players[index].sits = 0
    Session.set('playText',match.players[index].userId + " " + "is playing...")
    return match
  }
  if (match.players[index].currentBid >= 1) {
    match.players[index].isPlaying = true
    match.players[index].isPlayingChoice = true
    match.players[index].currentBid = 1
    Session.set('playText',match.players[index].userId + " " + "is playing...")
    return match
  }
  if (match.players[index].currentBid == 0) {
    var nOfTrumpCards = 0;
    for (let i =0; i < match.players[index].cards.length; i++) {
      if (match.players[index].cards[i].suit == match.trump) {
        nOfTrumpCards += 1;
      }
    }
    if (nOfTrumpCards >= 2) {
      match.players[index].isPlaying = true
      match.players[index].isPlayingChoice = true
      match.players[index].currentBid = 1
      match.players[index].sits = 0
      Session.set('playText',match.players[index].userId + " " + "is playing...")
      return match
    }
    if (match.players[index].cards[0].number > 10 && match.players[index].cards[1].number > 10) {
      match.players[index].isPlaying = true
      match.players[index].isPlayingChoice = true
      match.players[index].currentBid = 1
      match.players[index].sits = 0
      Session.set('playText',match.players[index].userId + " " + "is playing...")
      return match
    }
    else {
      match.players[index].isPlaying = false
      match.players[index].cards = []
      match.players[index].isPlayingChoice = true
      match.players[index].currentBid = 0
      match.players[index].sits += 1;
      // +1 to score if player sits a round with 5 or less points
      if (match.players[index].score <= 5) {
        match.players[index].score += 1;
      }
      Session.set('playText',match.players[index].userId + " " + "is sitting...")
      return match
    }
  }
}


findWinner = function(match,cards,trumpCard) {
  /* (Array,String) -> String
     Return playerID of winning card.
  */
  console.log(cards[0])
  console.log(cards[1])
  for (var i=0; i < cards.length; i++) {
    if (cards[i].card.suit == trumpCard) {
      return cards[i].owner;
    }
  }
  var leadCard = getLeadCard(match);
  for (var i=0; i < cards.length; i++) {
    if (cards[i].card.suit == leadCard.card.suit) {
      return cards[i].owner
    }
  }
}


cardSort = function(fieldCards) {
  /* Array -> Array
     Return sorted array from highest card to lowest (POSSIBLE USE OF MONGO SORT?)
  */
  console.log('sorting cards...')
  console.log(fieldCards[0])
  console.log(fieldCards[1])
  var cardsSwitched = 0;
  do {
    cardsSwitched = 0;
    for (var i =0; i < fieldCards.length -1; i++) {
      if (fieldCards[i].card.number < fieldCards[i+1].card.number) {
        console.log(fieldCards[i].card.number + " " + fieldCards[i+1].card.number)
        var tmp = fieldCards[i];
        fieldCards[i] = fieldCards[i+1]
        fieldCards[i+1] = tmp;
        cardsSwitched += 1;
        console.log('cards switched')
      }
    }
  } while (cardsSwitched > 0);
  return fieldCards;
}


checkIfTurn = function(match) {
  /* Document -> Boolean
    Return the current user's turn property of the Match object
  */
  for (var i =0; i < match.players.length; i++) {
    if (match.players[i].userId == Meteor.user()._id) {
      return match.players[i].turn
    }
  }
}

checkIfRoundCheck = function(match) {
  for (var i=0; i < match.players.length; i++) {
    if (match.players[i].isPlayingChoice == false && match.players[i].punted == false) {
      return false
    }
  }
  return true
}


getCard = function(match) {
  /* String -> Document; Signature
     Return a random card from Document.cards
  */
  var randomIndex = Math.floor( Math.random() * (52 - match.usedCards.length) );
  return {card: match.cards[randomIndex], index:randomIndex};
}

getLeadCard = function(match) {
  /* Document -> Card
    Return lead card from fieldCards
  */
  for (var i =0; i < match.fieldCards.length; i++) {
    if (match.fieldCards[i].leadCard){
      return match.fieldCards[i]
    }
  }
}


setTrump = function(match) {
  /* Document -> Document
    Find the highest bidder, and give them the trump
  */

  var highBid = getHighBidder(match)

  var index = match.players.indexOf(highBid)
  match.players[index].pickTrump = true
  match.players[index].highBidder = true

  // If highest bid is 0/1, everyone plays
  if (match.players[index].currentBid == 0 || match.players[index].currentBid == 1) {
    for (var i=0; i < match.players.length; i++) {
      match.players[i].isPlaying = true;
      match.players[i].isPlayingChoice = true;
      match.players[i].currentBid = 1;
    }
  }

  var trumpId = match.players[index].userId
  // Computer Picks Trump
  if (trumpId[0] + trumpId[1] + trumpId[2] == 'com') {
    for (var i=0; i < match.players.length; i++) {
      match.players[i].turn = false
      }
    match.players[index].turn = true
    match.players[index].pickTrump = false;
    match = changeTurn(match)
    // Trump is highest card
    var cards = sortComputerCards(match.players[index].cards)
    match.trump = cards[0].suit;
    Session.set('playText',match.players[index].userId + " " + "is picking trump of" + " " + match.trump + "...")
    return match
  }
  // Player Picks Trump
  else {
    for (var i=0; i < match.players.length; i++) {
      if (match.players[i].highBidder) {
        match.players[i].turn = true
      }
      else {
        match.players[i].turn = false
        //match.players[i].currentBid = 1;
      }
    }
    return match
  }
}
