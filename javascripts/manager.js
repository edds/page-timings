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
      var $select = manager.selects.$accounts;
      template($select, 'select-options', { object: 'account', options: data });
      $select
        .attr('disabled', false)
        .on('change', function(e){
          manager.reset();
          manager.accountId = $select.val();
          cache('last-account', manager.accountId);
          if(manager.accountId !== ''){
            manager.selects.$properties.attr('disabled', 'disabled');
            manager.propertyId = false;
            manager.selects.$profiles.attr('disabled', 'disabled');
            manager.profileId = false;
            user.getProperties(manager.accountId, manager.renderProperties);;
          }
        });
      if(cache('last-account') && $select.find('[value='+cache('last-account')+']').length > 0){
        $select.val(cache('last-account')).trigger('change');
      }
    },
    renderProperties: function(data){
      var $select = manager.selects.$properties
      template($select, 'select-options', { object: 'property',  options: data });
      $select
        .attr('disabled', false)
        .on('change', function(e){
          manager.reset();
          manager.propertyId = $select.val();
          cache('last-property', manager.propertyId);
          if(manager.propertyId !== ''){
            manager.selects.$profiles.attr('disabled', 'disabled');
            manager.profileId = false;
            user.getProfiles(manager.accountId, manager.propertyId, manager.renderProfiles);
          }
        });
      if(cache('last-property') && $select.find('[value='+cache('last-property')+']').length > 0){
        $select.val(cache('last-property')).trigger('change');
      }
    },
    renderProfiles: function(data){
      var $select = manager.selects.$profiles
      template($select, 'select-options', { object: 'profile', options: data });
      $select
        .attr('disabled', false)
        .on('change', function(e){
          manager.reset();
          manager.profileId = $select.val();
          cache('last-profile', manager.profileId);
          if(manager.profileId !== ''){
            manager.loadStats();
          }
        });
      if(cache('last-profile') && $select.find('[value='+cache('last-profile')+']').length > 0){
        $select.val(cache('last-profile')).trigger('change');
      }
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
      graph.show(timings.getDataByTiming(), timings.getTimePoints());
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
