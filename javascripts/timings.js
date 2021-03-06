(function(){
  "use strict"

  var timings= {
    data: [],
    headers: [],
    rowTitles: [
      'date - time',
      'redirection',
      'domain lookup',
      'server connection',
      'server response',
      'page download',
      'dom content loaded',
      'dom interactive',
      'page complete'
    ],
    info: {
      'ga:avgRedirectionTime': {
        title: 'Avg. Redirection Time',
        body: 'The average amount of time (in seconds) spent in redirects before fetching this page. If there are no redirects, the value for this metric is expected to be 0.', 
      },
      'ga:avgDomainLookupTime': {
        title: 'Avg. Domian Lookup Time',
        body: 'The average amount of time (in seconds) spent in DNS lookup for this page.'
      },
      'ga:avgServerConnectionTime': {
        title: 'Avg. Server Connection Time',
        body: 'The average amount of time (in seconds) spent in establishing TCP connection for this page.'
      },
      'ga:avgServerResponseTime': {
        title: 'Avg. Server Response Time',
        body: 'The average amount of time (in seconds) your server takes to respond to a user request, including the network time from user\'s location to your server.'
      },
      'ga:avgPageDownloadTime': {
        title: 'Avg. Page Download Time',
        body: 'The average amount of time (in seconds) to download this page.'
      },
      'ga:avgDomContentLoadedTime': {
        title: 'Avg. Document Content Loaded Time',
        body: 'The average time (in seconds) it takes the browser to parse the document.',
      },
      'domContentLoadedTimeToInteractiveTime': {
        title: 'Avg. Document Interactive Time',
        body: 'The average time (in seconds) it takes the browser to parse the document and execute deferred and parser-inserted scripts including the network time from the user\'s location to your server.'
      }
    },

    rowToObj: function(row){
      var out= {}, column,columns, data;
      for(column=0,columns=window.timings.headers.length; column<columns; column++){
        if(window.timings.headers[column].dataType === 'FLOAT'){
          out[window.timings.headers[column].name] = parseFloat(row[column], 10);
        } else {
          out[window.timings.headers[column].name] = row[column];
        }
      }
      out['domContentLoadedTimeToInteractiveTime'] = out['ga:avgDomContentLoadedTime'] - out['ga:avgDomInteractiveTime']; 
      out.name = out["ga:day"] + " - " + out["ga:hour"] +":00";
      return out;
    },
    getDataByTimeRow: function(row){
      return [
        row.name,
        row['ga:avgRedirectionTime'],
        row['ga:avgDomainLookupTime'],
        row['ga:avgServerConnectionTime'],
        row['ga:avgServerResponseTime'],
        row['ga:avgPageDownloadTime'],
        row['ga:avgDomInteractiveTime'],
        row['domContentLoadedTimeToInteractiveTime'],
        row['ga:avgPageLoadTime'] 
      ];
    },
    getDataByTime: function(){
      return timings.data.map(timings.getDataByTimeRow);
    },
    getDataByTimingRow: function(type){
      return {
        name: type, 
        values: timings.data.map(function(row){ 
          return row[type];
        })
      };
    },

    getDataByTiming: function(){
      var types = [
        'ga:avgRedirectionTime',
        'ga:avgDomainLookupTime',
        'ga:avgServerConnectionTime',
        'ga:avgServerResponseTime',
        'ga:avgPageDownloadTime',
        'ga:avgDomContentLoadedTime',
        'domContentLoadedTimeToInteractiveTime'
      ];
      var i, out = [];
      for(i=0; i<types.length; i++){
        out.push( timings.getDataByTimingRow(types[i]) );
      }
      //out.push({
      //  name: 'ga:avgPageLoadTime', 
      //  values: timings.data.map(function(row){ return row['ga:avgPageLoadTime']; })
      //});
      return out;
    },

    getTimePoints: function(){
      return timings.data.map(function(row){ return row.name; })
    },

    endpoint: function(startDate, endDate){
      return "https://www.googleapis.com/analytics/v3/data/ga?"
      + "ids=ga:"+ manager.profileId +"&"
      + "dimensions=ga:hour,ga:day&"
      + "metrics=ga:avgPageLoadTime,ga:avgDomainLookupTime,ga:avgPageDownloadTime,ga:avgRedirectionTime,ga:avgServerConnectionTime,ga:avgServerResponseTime,ga:avgDomInteractiveTime,ga:avgDomContentLoadedTime&"
      + "start-date="+ startDate +"&"
      + "end-date="+ endDate +"&"
      + "max-results=1440&"
      + "sort=ga:day,ga:hour";
    },
    update: function(callback, date){
      var startDate, endDate;
      date.setDate(date.getDate() - 7);
      startDate = date.getFullYear() +'-'+ timings.zeroPad(date.getMonth()+1) +'-'+ timings.zeroPad(date.getDate());
      date.setDate(date.getDate() + 7 - 1);
      endDate = date.getFullYear() +'-'+ timings.zeroPad(date.getMonth()+1) +'-'+ timings.zeroPad(date.getDate());

      var endpoint = timings.endpoint(startDate, endDate);
      user.apiRequest(endpoint, function(data){
        timings.headers = data.columnHeaders;
        timings.data = data.rows.map(timings.rowToObj);
        callback();
      });
    },
    zeroPad: function(i){
      if(i<10) return "0" + i;
      return i;
    },
  };

  window.timings = timings;
}());
