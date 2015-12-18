(function () {
    angular.module('MSGraphConsoleApp')
        .directive('searchResults',['$templateCache','$compile','$http','$log',function($templateCache,$compile,$http,$log){
            var definition = {
                restrict: 'E',
                replace: true,
                scope: {
                    searchQuery:'@',            //sharepoint search query
                    rowLimit:'@',               //row limit for the search query
                    selectProperties:'@',       //selected Properties
                    searchBaseUrl:'@',          //searh base url _api/search/query/querytext is added to it
                    title:'@',             //title of the block
                    template:'@',               //display template 
                    propertyMap:'@'             //property map
                }    
            };
            definition.link = function postLink(scope, element) {
                //start digest cycle if the search query changed
                scope.$watch('searchQuery',function() {
                    compile();
					loadData();
                });
                var compile = function() {
                    scope.template=scope.template||'templates/searchResultsRollup.html';
                    var request={
                        method:'GET',
                        url:scope.template,
                        cache:$templateCache
                    }
                    $http(request).then(
                        function(html){
                                element.html(html);
                                $compile(element.contents())(scope);
                        },function(error){
                            $log.error("error loading the templare")
                        });
                };
				//the below function load search data
				var loadData=function(){
                    //some initialization
                    scope.requestSuccess=false;
                    scope.requestFinished=false;
                    scope.responseData={};                
                    scope.searchBaseUrl=scope.searchBaseUrl||'https://insightme.sharepoint.com';
                    var request = 
                    {
                        method: 'GET',
                        url: scope.searchBaseUrl+constructSearchUrl()
                    };
                    
                    $http(request)
                        .then(function (response) {                           
                        response.status ===200 ? scope.requestSuccess = true : scope.requestSuccess = false; 
                        scope.requestFinished = true;
                        scope.responseData=response.data.PrimaryQueryResult.RelevantResults.Table.Rows;
                         $log.debug('Search query executed successfully.', scope.responseData); 
                        }, function (error) {
                        $log.error('Error executing search query:');
                        $log.error(error);
                        scope.requestSuccess= false;
                        scope.requestFinished = true;
                        });
				};
                var constructSearchUrl=function(){
                    var url='';
                    url+='/_api/search/query?querytext=\''+scope.searchQuery+'\'';
                    if(scope.rowLimit){
                        url += '&rowlimit='+scope.rowLimit;
                    }
                    if(scope.selectProperties){
                        url +='$selectProperties=\''+scope.selectProperties+'\'';
                    }
                    return url;
                }
            };
            return definition;
        }])
})();