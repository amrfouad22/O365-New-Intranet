(function () {
    angular.module('MSGraphConsoleApp')
        .directive('searchResults',['$templateCache','$compile','$http','$log',function($templateCache,$compile,$http,$log){
            var definition = {
                restrict: 'E',
                replace: true,
                scope: {
                    searchQuery:'=',
                    searchBaseUrl:'=',
                    template:'@'
                }    
            };
            definition.link = function postLink(scope, element) {
                //some initialization
                scope.show = false;
                scope.requestSuccess=false;
                scope.requestFinished=false;
                scope.responseData={};                
                scope.template=scope.template||'templates/searchResults.html';
                //start digest cycle if the search query changed
                scope.$watch('searchQuery',function() {
                    compile();
					loadData();
                });
                var compile = function() {
                    $http.get(scope.template, { cache: $templateCache }).success(function(html) {
                    element.html(html);
                    $compile(element.contents())(scope);
                    });
                };
				//the below function load search data
				var loadData=function(){
                    var request = {
                        method: 'GET',
                        url: scope.searchBaseUrl+'/_api/search/query?querytext=\''+scope.searchQuery+'\''
                    };
                    $http(request)
                        .then(function (response) {
                        $log.debug('Search query executed successfully.', response);     
                        response.status ===200 ? scope.requestSuccess = true : scope.requestSuccess = false; 
                        scope.requestFinished = true;
                        scope.responseData=response.data;
                        }, function (error) {
                        $log.error('Error executing search query:');
                        $log.error(error);
                        scope.requestSuccess= false;
                        scope.requestFinished = true;
                        });
				};
            };
            return definition;
        }])
})();