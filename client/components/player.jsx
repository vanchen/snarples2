const scoreStyle = {position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)'}

const {Spring} = ReactMotion


Player = React.createClass({

  renderPlayerBidBoxes(player) {
    var bids = player.currentBid;
    var tricks = player.currentTrick;
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
  renderPlayerCards(player) {
    var cards = player.cards
    var style = {width: '90%'}
    var leadCard = getLeadCard(this.props.match)
    var playerId = player.userId
    var initial = getPlayerPosition(this.props.match,playerId)
    // Have to calculate position of computer card.

    return cards.map((card) => {
      if (card.cardPlayed) {
        /// Have to calculate card position
        var final = {x: window.innerWidth*(0.21 + card.position*0.09), y:(window.innerHeight*0.70 - window.innerHeight*0.33)};
        return (
        <Spring defaultValue={{val: initial }} endValue={{val: final }}>
          {
            interpolated =>
              <div className="someclass" style = {{
                  transform: `translate3d(${interpolated.val.x}px, ${interpolated.val.y}px, 0)`,
                  position: 'absolute',
                  width: this.props.playerStyle.width
              }} >
              <img className="responsive" style={style}  src={card.image}/>
              </div>
          }
        </Spring>
      )
      }
    });
  },
  playerTurnStyle(player) {
    if (player.turn) {
      return {background: 'green'}
    }
    else {
      return {background: 'red'}
    }
  },
  renderIcons() {
  // Render Dealer Chip and Change panel styling depending on turn?
    var style = {position: 'absolute', left: '90%', width: '10%'}
      if (this.props.player.dealer) {
        return <img src='game_casino.png' style={style}/>
      }
  },

  render() {
    return(
      <div>
      <div className="panel panel-success" style={this.props.playerStyle}>
        <div style={this.playerTurnStyle(this.props.player)} className="panel-heading"> </div>
        <h1 style={scoreStyle}> {this.props.player.score} </h1>
        {this.renderPlayerBidBoxes(this.props.player)}
        {this.renderIcons()}
      </div>
      {this.renderPlayerCards(this.props.player)}
      </div>
    )
  }
});
