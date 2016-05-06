var sidebarStyle = {position: 'absolute',top: 0,left: 0,width: '100%',height: '100%','z-index' :1000}
var formStyle ={position: 'absolute',top: "20%",left: '20%',width: '55%',height: '100%'}
var titleStyle = {position: 'absolute', top:'3%', left: '6%','font-family':'titleFont', 'font-size':'250%','color':'white'}
var singleStyle = {position: 'absolute', top:'45%', left: '13%','font-family':'titleFont', 'font-size':'150%','color':'#191919',cursor:'pointer'}
var multiStyle = {position: 'absolute', top:'45%', left: '40%','font-family':'titleFont', 'font-size':'150%','color':'#191919',cursor:'pointer'}
var menuButtonStyle = {position: 'absolute', top:'3%', left:'1%', cursor:'pointer'}
var sideBarClose = {position: 'relative', top:'2%', left:'82%', cursor:'pointer'}
var chooseStyle = {position: 'absolute', top:'20%', left: '19%','font-family':'titleFont', 'font-size':'150%','color':'white',cursor:'pointer'}
var removeStyle = {position: 'absolute', top:'20%', left: '75%',cursor:'pointer'}
var menuIcons =  {'font-family':'titleFont', 'font-size':'150%','color':'#191919'}


var numberStyle = [{position: 'absolute', top:'35%', left: '19%','font-family':'titleFont', 'font-size':'150%','color':'#191919',cursor:'pointer'},
{position: 'absolute', top:'35%', left: '31%','font-family':'titleFont', 'font-size':'150%','color':'#191919',cursor:'pointer'},
{position: 'absolute', top:'35%', left: '43%','font-family':'titleFont', 'font-size':'150%','color':'#191919',cursor:'pointer'},
{position: 'absolute', top:'35%', left: '55%','font-family':'titleFont', 'font-size':'150%','color':'#191919',cursor:'pointer'},
{position: 'absolute', top:'35%', left: '67%','font-family':'titleFont', 'font-size':'150%','color':'#191919',cursor:'pointer'},
{position: 'absolute', top:'35%', left: '79%','font-family':'titleFont', 'font-size':'150%','color':'#191919',cursor:'pointer'},
{position: 'absolute', top:'35%', left: '91%','font-family':'titleFont', 'font-size':'150%','color':'#191919',cursor:'pointer'}
]

const {Spring} = ReactMotion
var hexagon1 = {top:'40%',left:'12%'}
var hexagon2 = {top:'40%',left:'38%'}

var hexagons = [{top:'30%',left:'15%'},{top:'30%',left:'27%'},{top:'30%',left:'39%'},{top:'30%',left:'51%'},{top:'30%',left:'63%'},{top:'30%',left:'75%'},{top:'30%',left:'87%'}]


Session.setDefault('singlePlayer',false)
Session.setDefault('sideBarWidth',{x:-100,y:0})
Session.setDefault('menuSelect','game')
Session.setDefault('bodyPosition',{x:0,y:0})
// Interface Components

Home = React.createClass({

    mixins: [ReactMeteorData],
    getMeteorData() {
        return {
          user: Meteor.user(),
          matches: Matches.find().fetch(),
          singlePlayer: Session.get('singlePlayer'),
          sidebarPosition: Session.get('sideBarWidth'),
          menuSelect: Session.get('menuSelect'),
          bodyPosition: Session.get('bodyPosition')
      }
    },

    handleSelect() {
          Meteor.logout()
    },

    singlePlayer() {
      if (Session.get('singlePlayer')) {
        Session.set('singlePlayer',false)
      }
      else {
        Session.set('singlePlayer',true)
      }
    },

    removeSingle() {
      Session.set('singlePlayer',false)
    },

    createMatchComputer(event) {
      console.log(event.target.id)
      event.preventDefault();
      var cards = Cards.find().fetch();
      var playerArray = [{userId: Meteor.user()._id ,cards: [],punted:false,isPlaying: false,sits:0,isPlayingChoice:false, score: 16, turn: false, currentBid: 0,bidMade: false, pickTrump: false, currentTrick: 0, dealer: false,highBidder: false,isComputer: false }]
      for (var i=1; i < event.target.id; i++) {
        playerArray.push({userId: 'computer' + i, cards: [],punted:false, sits:0, isPlaying: false,isPlayingChoice:false, score: 16, turn: false, currentBid: 0,bidMade: false, pickTrump: false, currentTrick: 0, dealer: false,highBidder: false,isComputer: true })
      }
      var matchId = Matches.insert({
        type: 'computer',
        totalPlayers: event.target.id,
        players: playerArray,
        cards: cards,
        host: Meteor.user()._id,
        usedCards: [],
        fieldCards: [],
        round:  0,
        trump: 'none',
        roundCheck: false,
        cardsPlayed: 0,
        cardsDealt: false,
        dealer: false,
        winner: false
      });
      var url = '/match/' + matchId;
      FlowRouter.go(url);
    },

    createMatchPlayer(event) {
      console.log(event.target.id)
      event.preventDefault();
      var cards = Cards.find().fetch();
      var playerArray = [{userId: Meteor.user()._id , cards: [], sits: 0,punted:false, isPlaying: false, isPlayingChoice:false, score: 16, turn: false, currentBid: 0,bidMade: false, pickTrump: false, currentTrick: 0, dealer: false,highBidder: false,isComputer: false }]
      for (var i=0; i < event.target.id; i++) {
        playerArray.push({userId: 'computer' + i, cards: [],sits: 0,punted:false, isPlaying: false,isPlayingChoice:false, score: 16, turn: false, currentBid: 0,bidMade: false, pickTrump: false, currentTrick: 0, dealer: false,highBidder: false,isComputer: true })
      }
      var numComp = Number(event.target.id)
      var numPlay = numComp + 2;
      Matches.insert({
        type: 'computer and player',
        totalPlayers: numPlay,
        players: playerArray,
        cards: cards,
        host: Meteor.user()._id,
        usedCards: [],
        fieldCards: [],
        round:  0,
        trump: 'none',
        roundCheck: false,
        cardsPlayed: 0,
        cardsDealt: false,
        dealer: false,
        winner: false
      });
    },

    joinMatch(e) {
      var matchId = e.currentTarget.id;
      Matches.update(matchId, {
        $push: {players: {userId: Meteor.user()._id, cards: [],isPlaying:false, score: 16, turn: false,currentBid:0, bidMade: false, pickTrump: false, currentTrick: 0, dealer: false, highBidder:false,isComputer:false }}
      });
      var url = '/match/' + matchId;
      FlowRouter.go(url);
    },

    renderItems() {
      if (this.data.user == null) {
        return(
          <div style= {formStyle}>
            <form role="form">
              <div className="form-group">
                <label for="email">Email address:</label>
                <input type="email" className="form-control" ref="email1"/>
              </div>
              <div className="form-group">
                <label for="pwd">Password:</label>
                <input type="password" className="form-control" ref="pwd1"/>
              </div>
              <div className="checkbox">
                <label><input type="checkbox"/ > Remember me</label>
              </div>
              <button type="submit" onClick={this.handleRegister} className="btn btn-default">Register</button>
          </form>
        </div>
        )
      }

      if (this.data.menuSelect == 'game') {
        if (this.data.singlePlayer) {
          return(
            <div>
              <div style={chooseStyle}> Choose number of opponents:</div>
              <Button onClick={this.removeSingle} style={removeStyle}><Glyphicon glyph="remove" /></Button>
              <div id="2" onClick={this.createMatchComputer} style={hexagons[0]} className="hexagon2"> </div>
              <div id="4" onClick={this.createMatchComputer} style={hexagons[2]} className="hexagon2"> </div>
              <div id="3" onClick={this.createMatchComputer} style={hexagons[1]} className="hexagon2"> </div>
              <div id="5" onClick={this.createMatchComputer} style={hexagons[3]} className="hexagon2"> </div>
              <div id="6" onClick={this.createMatchComputer} style={hexagons[4]} className="hexagon2"> </div>
              <div id="7" onClick={this.createMatchComputer} style={hexagons[5]} className="hexagon2"> </div>
              <div id="8" onClick={this.createMatchComputer} style={hexagons[6]} className="hexagon2"> </div>

              <div id="2" onClick={this.createMatchComputer} style={numberStyle[0]} > 2 </div>
              <div id="3" onClick={this.createMatchComputer} style={numberStyle[1]} > 3 </div>
              <div id="4" onClick={this.createMatchComputer} style={numberStyle[2]} > 4 </div>
              <div id="5" onClick={this.createMatchComputer} style={numberStyle[3]} > 5 </div>
              <div id="6" onClick={this.createMatchComputer} style={numberStyle[4]} > 6 </div>
              <div id="7" onClick={this.createMatchComputer} style={numberStyle[5]} > 7 </div>
              <div id="8" onClick={this.createMatchComputer} style={numberStyle[6]} > 8 </div>
            </div>
          )
        }
        else {
          return(
            <div>
              <div onClick = {this.singlePlayer} style={hexagon1} className="hexagon"> </div>
              <div style={hexagon2} className="hexagon"> </div>
              <div onClick={this.singlePlayer} style={singleStyle}> Single Player </div>
              <div style={multiStyle}> Multiplayer </div>
          </div>
          )
        }
      }

      if (this.data.menuSelect == 'stats') {
        return(
          <div>
            <div style={chooseStyle}> Match Stats: </div>
          </div>
        )
      }
      if (this.data.menuSelect == 'options') {
        return(
          <div></div>
        )
      }
      if (this.data.menuSelect == 'rules') {
        return(
          <div></div>
        )
      }
    },

    continueMatch(e) {
      FlowRouter.go('/match/' + e.currentTarget.id)

    },

    handleClick(e) {
      Session.set('menuSelect',e.currentTarget.id)
    },

    handleLogin(e) {
          e.preventDefault();
          var emailVar = ReactDOM.findDOMNode(this.refs.email).value;
          var passwordVar = ReactDOM.findDOMNode(this.refs.pwd).value;
          Meteor.loginWithPassword(emailVar, passwordVar);
    },

    handleRegister(e) {
        e.preventDefault();
        console.log(e.target.form["1"].value)
        //var emailVar = ReactDOM.findDOMNode(this.refs.email1).value;
        //var passwordVar = ReactDOM.findDOMNode(this.refs.pwd1).value;
        Accounts.createUser({
            email: e.target.form["0"].value,
            password: e.target.form["1"].value
        });
    },

    handleSidebar(e) {
      if (Session.get('sideBarWidth').x == -100) {
        Session.set('sideBarWidth',{x:0,y:0})
        Session.set('bodyPosition',{x:30,y:0})
      }
      else {
        Session.set('sideBarWidth',{x:-100,y:0})
        Session.set('bodyPosition',{x:0,y:0})
      }

    },

    findMatches() {
      var matches = this.data.matches;
      return this.data.matches.map((matches) => {
        var newMatch = true;
        for (var i =0; i < matches.players.length; i++) {
          if (matches.players[i].userId == Meteor.user()._id) {
            newMatch = false;
          }
        }
        if (newMatch) {
            return <a href="#" className="list-group-item active" id={matches._id} onClick={this.joinMatch}>
              <h4 className="list-group-item-heading text-capitalize"> {matches.type} </h4>
              <p className="list-group-item-text"> Player 1 vs Player 2</p>
            </a>
          }
      });
  },

  currentMatches() {
    var matches = this.data.matches;
    return this.data.matches.map((matches) => {
      for (var i =0; i < matches.players.length; i++) {
        if (matches.players[i].userId == Meteor.user()._id) {
          return <a href="#" className="list-group-item active" id={matches._id} onClick={this.continueMatch}>
            <h4 className="list-group-item-heading text-capitalize"> {matches.type} </h4>
            <p className="list-group-item-text"> Player 1 vs Player 2</p>
          </a>
        }
      }
    });
  },

  render() {
    // Home Screen Logic Goes Here
    return (
      <div>
        <Spring defaultValue={{val: {x:0,y:0} }} endValue={{val: this.data.bodyPosition }}>
          {
            interpolated =>
            <div className="someclass" style = {{
                top:'0%',
                left:'0%',
                transform:`translate3d(${interpolated.val.x}%, ${interpolated.val.y}%, 0)`,
                height:'100%',
                position: 'absolute',
                width: '100%',
            }}>
              <Button style={menuButtonStyle} id="openSidebar" onClick={this.handleSidebar}> <Glyphicon glyph="align-justify"  /> </Button>
              <div style={titleStyle}> Snarples </div>
              {this.renderItems()}
            </div>
              }
          </Spring>

        <Spring defaultValue={{val: {x:-100,y:0} }} endValue={{val: this.data.sidebarPosition }}>
          {
            interpolated =>
            <div className="someclass" style = {{
                top:'0%',
                left:'0%',
                transform:`translate3d(${interpolated.val.x}%, ${interpolated.val.y}%, 0)`,
                height:'100%',
                background: 'white',
                position: 'absolute',
                width: '30%',
            }}>
              <Button id='game' bsSize="large" block onClick={this.handleClick}> <h3 style={menuIcons}> Game </h3> </Button>
              <Button id='stats' bsSize="large" block onClick={this.handleClick}> <h3 style={menuIcons}> Stats </h3> </Button>
              <Button id='options' bsSize="large" block onClick={this.handleClick}> <h3 style={menuIcons}> Options </h3> </Button>
              <Button id='rules' bsSize="large" block onClick={this.handleClick}> <h3 style={menuIcons}> Rules </h3> </Button>
              </div>
              }
          </Spring>
      </div>
    )
  }
});
