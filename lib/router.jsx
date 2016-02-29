FlowRouter.route("/", {
  action: function() {
    ReactLayout.render(Home)
  }
});


FlowRouter.route('/match/:matchid', {
  name: 'match',
  action: function(params) {
    ReactLayout.render(Arena, {
      matchId: params.matchid });
    }
  });
