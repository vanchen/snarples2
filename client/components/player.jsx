const scoreStyle = {position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)','font-family':'titleFont', 'font-size':'150%' }

const {Spring} = ReactMotion


Player = React.createClass({

  renderPlayerBidBoxes(player) {
    var bids = player.currentBid;
    var tricks = player.currentTrick;
    var bidArray = [{size:10,topSize:0, background: 'white'},{size: 19,topSize:-8, background: 'white'},{size:28,topSize:-17,background: 'white'},{size:37,topSize:-26,background: 'white'},{size:46,topSize:-35  ,background: 'white'}];
    for (var i=0; i < bids; i++) {
      bidArray[i].background = 'black';
    }
    for (var i=0; i < tricks; i++) {
      bidArray[i].background = 'blue';
    }
    return bidArray.map((key) => {
      var left = String(key.size - 8) + '%';
      var top = String(key.topSize -23) + '%'
      var bidBoxStyle = {position: 'absolute', width: '5%', height: '10%', top: top, left: left, background: key.background}
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
        var yOffSet = false;
        var xOffSet = 0
        var zIndex = 0;

        if (card.position == 5) {
          xOffSet = 0
          yOffSet = true
          zIndex = 1000
        }
        if (card.position == 6) {
          xOffSet = 1
          yOffSet = true
          zIndex = 1000
        }
        if (card.position == 7) {
          xOffSet = 2
          yOffSet = true
          zIndex = 1000
        }
        if (yOffSet == false) {
          var final = {x: window.innerWidth*(0.21 + card.position*0.09), y:(window.innerHeight*0.70 - window.innerHeight*0.33)};
        }
        else {
          var final = {x: window.innerWidth*(0.21 + xOffSet*0.09), y:(window.innerHeight*0.77 - window.innerHeight*0.33)};
        }

        return (
        <Spring defaultValue={{val: initial }} endValue={{val: final }}>
          {
            interpolated =>
              <div className="someclass" style = {{
                  transform: `translate3d(${interpolated.val.x}px, ${interpolated.val.y}px, 0)`,
                  position: 'absolute',
                  width: this.props.playerStyle.width,
                  zIndex: zIndex,
                  width: '10%'
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
    var style = {position: 'absolute', left: '90%',top:'-55%', 'font-family':'titleFont', 'font-size':'110%','color':'white'}
    if (player.turn) {
      return <h1 style={style}> T </h1>
    }
  },
  renderIcons() {
  // Render Dealer Chip and Change panel styling depending on turn?
    var style = {position: 'absolute',top:'-65%', left: '80%', 'font-family':'titleFont', 'font-size':'110%','color':'white'}
      if (this.props.player.dealer) {
        return <h1 style={style}> D </h1>
      }
  },

  render() {
    return(
      <div>
      <div className="hexagon1" style={this.props.playerStyle}>
        <h1 style={scoreStyle}> {this.props.player.score} </h1>
        {this.renderPlayerBidBoxes(this.props.player)}
        {this.renderIcons()}
        {this.playerTurnStyle(this.props.player)}
      </div>
      {this.renderPlayerCards(this.props.player)}
      </div>
    )
  }
});
