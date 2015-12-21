(function () {
    angular.module('NewIntranetApp')
        .directive('navItem',['$templateCache','$compile','$http','$log','$rootScope',function($templateCache,$compile,$http,$log,$rootScope){
            var definition = {
                restrict: 'E',
                replace: true,
                scope: {
                    node:'=',
                    template:'@'
                }    
            };
            definition.link = function postLink(scope, element) {
                scope.show = false;
                scope.template=scope.template||'templates/navitem.html';
                scope.$watch('node',function() {
                    compile();
                });
                var compile = function() {
                    $http.get(scope.template, { cache: $templateCache }).success(function(html) {
                    element.html(html);
                    $compile(element.contents())(scope);
                    });
                };
                scope.nodeClick=function(){
                    if(scope.node.childNodes)
                    {
                        //toggle show value collapse expand
                        scope.show=!scope.show;
                    }
                    else
                    {
                        $rootScope.$emit('node:clicked',{node:scope.node});
                    }
                };
            };
            return definition;
        }])
})();