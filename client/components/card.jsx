const {Spring} = ReactMotion

UserCard = React.createClass({

  getInitialState() {
    return {
      finalPosition: this.props.defaultPosition
    }
  },

  handleClick(event) {
    var id = event.target.id
    var match = this.props.match
    var index = getPlayerIndex(match,Meteor.user()._id)
    var userTurn = match.players[index].turn
    if (userTurn && match.players[index].isPlaying) {
      for (let i=0; i < match.players[index].cards.length; i++) {
        if (match.players[index].cards[i]._id == id) {
          if (match.fieldCards.length == 0 || this.props.fieldCheck == false) {
            match.fieldCards.push({card: match.players[index].cards[i], owner: Meteor.user()._id, leadCard: true})
            var fieldPosition = match.fieldCards.length - 1
            match.players[index].cards[i].cardPlayed = true;
            match.players[index].cards[i].position = fieldPosition
            match.players[index].cards[i].final = {x: window.innerWidth*(0.21 + fieldPosition*0.09), y:(window.innerHeight*0.70 - window.innerHeight*0.33)}
            //this.setState({
              //finalPosition: {x:200, y: -300}
            //});
            match = changeTurn(match);
            match.cardsPlayed += 1;
            updateMatch(match)
            break
          }
          else {
            var leadCard = getLeadCard(match)
            if (leadCard.card.suit == this.props.suit) {
              match.fieldCards.push({card: match.players[index].cards[i], owner: Meteor.user()._id, leadCard: false})
              var fieldPosition = match.fieldCards.length - 1
              match.players[index].cards[i].cardPlayed = true;
              match.players[index].cards[i].position = fieldPosition
              match.players[index].cards[i].final = {x: window.innerWidth*(0.21 + fieldPosition*0.09), y:(window.innerHeight*0.70 - window.innerHeight*0.33)}
              //this.setState({
                //finalPosition: {x:200, y: -300}
              //});
              match = changeTurn(match);
              match.cardsPlayed += 1;
              updateMatch(match)
              break
              }
            }
          }
        }
      }
    },

  render() {
    var userTurn = this.props.match.players[getPlayerIndex(this.props.match,Meteor.user()._id)].turn
    // Do various card logic here based on data passed via props.
    if (this.props.played == false) {
      if (userTurn == false) {
        var style = {width: '90%', opacity:'0.5'}
      }
      if (userTurn) {
        if (match.fieldCards.length > 0) {
          if (this.props.fieldCheck) {
            var leadCard = getLeadCard(this.props.match);
            if (leadCard.card.suit == this.props.suit) {
              var style = {width: '90%', opacity:'1'}
            }
            else {
              var style = {width: '90%', opacity: '0.5'}
            }
          }
          else {
            var style = {width: '90%',opacity:'1'}
          }
        }
        else{
          var style = {width: '90%',opacity:'1'}
        }
      }
    }
    else {
      var style = {width: '90%',opacity:'1'}
    }

    return(
    <div>
      <Spring defaultValue={{val: this.props.defaultPosition}} endValue={{val: this.props.finalPosition}}>
        {
          interpolated =>
            <div className="someclass" style = {{
                transform: `translate3d(${interpolated.val.x}px, ${interpolated.val.y}px, 0)`,
                position: 'absolute',
                width: '10%'
            }} >
            <img style={style} id={this.props.id} onClick={this.handleClick} className="responsive"  src={this.props.image}/>
            </div>
        }
      </Spring>
    </div>
    )
  }
})
