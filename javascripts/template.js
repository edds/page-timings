(function(){
  "use strict"

  var template = function($node, template, context){
    // TODO: add some caching
    var mustache = $('#'+template).html();
    $node.html(Mustache.render(mustache, context));
  };

  window.template = template;
}());
