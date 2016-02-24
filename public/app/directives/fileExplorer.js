'use strict';
angular.module('NewIntranetApp')
/**directive takes 2 parameters
1-dir           (starting path default to root "/me/drive/root/children")
2-template      (render files tempalte)
**/
.directive('fileExplorer',['$templateCache','$compile','$http','$rootScope','$log',function($templateCache,$compile,$http,$rootScope,$log){
  var definition = {
      restrict: 'E',
      replace: true,
      scope: {
        dir:'@',
        template:'@',
      }    
    };
    definition.link = function postLink(scope, element) {
      scope.show = 'none';
      scope.$watch('dir',function() {
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
            url: 'https://graph.microsoft.com/v1.0'+scope.dir
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
      //handle click event
      scope.levelUp=function()
      {
        var arr=  scope.dir.split("/");
        var path=arr.splice(0,arr.length-2).join("/");
        if(path==""){
            path="/me/drive/root/children";
        }
        scope.dir=path;
      };
      scope.getClass=function(path){
          return 'file '+path.split('.').slice(-1).pop();
      };
      scope.linkClick=function (path){
          //recaluclate the dir vairable and set it.. 
          scope.dir=scope.dir+"/"+path+"/children";
      };
    };
    return definition;
}]);


