(function () {
    angular.module('NewIntranetApp')
        .directive('searchResults',['$templateCache','$compile','$http','$log','searchResultsCommon',function($templateCache,$compile,$http,$log,searchResultsCommon){
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
                    propertyMap:'@'             //property map string to be parsed on the form [{from:"",to:""},{from:"",to:""}]
                }    
            };
            definition.link = function postLink(scope, element) {
                //start digest cycle if the search query changed
                scope.template=scope.template||'templates/searchResultsRollup.html';
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
                    //some initialization
                    scope.requestSuccess=false;
                    scope.requestFinished=false;
                    scope.items={};                
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
                        scope.items=searchResultsCommon.transformResults(response.data.PrimaryQueryResult.RelevantResults.Table.Rows,JSON.parse(scope.propertyMap));
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
                        url +='&selectProperties=\''+scope.selectProperties+'\'';
                    }
                    return url;
                }
            };
            return definition;
        }])
})();