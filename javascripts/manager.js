(function(){
  "use strict"

  var manager = {
    renderedWeeks: 0,
    selects: {},
    profileId: false,
    propertyId: false,
    accountId: false,

    init: function(){
      user.getAccounts(manager.renderAccounts);
      manager.selects = {
        $accounts: $('#account'),
        $properties: $('#property'),
        $profiles: $('#profile')
      };
    },
    renderAccounts: function(data){
      template(manager.selects.$accounts, 'select-options', { object: 'account', options: data });
      manager.selects.$accounts
        .attr('disabled', false)
        .on('change', function(e){
          manager.reset();
          manager.accountId = manager.selects.$accounts.val();
          if(manager.accountId !== ''){
            manager.selects.$properties.attr('disabled', 'disabled');
            manager.propertyId = false;
            manager.selects.$profiles.attr('disabled', 'disabled');
            manager.profileId = false;
            user.getProperties(manager.accountId, manager.renderProperties);;
          }
        });
    },
    renderProperties: function(data){
      template(manager.selects.$properties, 'select-options', { object: 'property',  options: data });
      manager.selects.$properties
        .attr('disabled', false)
        .on('change', function(e){
          manager.reset();
          manager.propertyId = manager.selects.$properties.val();
          if(manager.propertyId !== ''){
            manager.selects.$profiles.attr('disabled', 'disabled');
            manager.profileId = false;
            user.getProfiles(manager.accountId, manager.propertyId, manager.renderProfiles);
          }
        });
    },
    renderProfiles: function(data){
      template(manager.selects.$profiles, 'select-options', { object: 'property', options: data });
      manager.selects.$profiles
        .attr('disabled', false)
        .on('change', function(e){
          manager.reset();
          manager.profileId = manager.selects.$profiles.val();
          if(manager.profileId !== ''){
            manager.loadStats();
          }
        });
    },
    loadStats: function(){
      timings.update(manager.renderTimings, new Date());
    },
    renderTimings: function(){
      template($('#wrapper'), 'timings-table', {
        times: timings.getDataByTime().map(function(row){
          return row.map(function(column){ 
            if(typeof column === 'number') return column.toFixed(4) 
            else return column;
          });
        }),
        headers: timings.rowTitles
      });

      graph.init();
      graph.show(timings.getDataByTiming());
    },
    period: function(){
      return parseInt(manager.selects.$period.val(), 10);
    },
    lines: function(){
      return parseInt(manager.selects.$lines.val(), 10);
    },
    browserIndex: function(){
      return manager.selects.$combine.val();
    },
    reset: function(){
      manager.renderedWeeks = 0;
      $('#wrapper').html('');
      $('#graph').html('');
      user.reset();
    },
  };
  window.manager = manager;
}());
