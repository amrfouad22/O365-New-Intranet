'use strict';
angular.module('NewIntranetApp')
/**directive takes 2 parameters
1-dir           (starting path default to root "/me/drive/root/children")
2-template      (render files tempalte)
**/
.directive('messageViewer',['$templateCache','$compile','$http','$rootScope','$log',function($templateCache,$compile,$http,$rootScope,$log){
  var definition = {
      restrict: 'E',
      replace: true,
      scope: {
        template:'@'
      }    
    };
    definition.link = function postLink(scope, element) {
      scope.show = 'none';
       scope.$watch('template',function() {
        compile();
        loadResource();
      });
     var compile = function() {
        $http.get(scope.template, { cache: $templateCache }).success(function(html) {
          element.html(html);
          $compile(element.contents())(scope);
        });
      };
      var loadResource=function()
      {
        scope.loading=true;
        var request = 
        {
            method: 'GET',
            url: 'https://graph.microsoft.com/v1.0/me/messages'
        };
        $http(request)
            .then(function (response) {                           
                response.status ===200 ? scope.requestSuccess = true : scope.requestSuccess = false; 
                scope.requestFinished = true;
                scope.items=response.data.value;
                scope.loading=false;
            }, function (error) {
                $log.error('Error loading user files');
                $log.error(error);
                scope.loading=false;            
            });
      };
    };
    return definition;
}]);


