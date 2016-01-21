(function () {
    angular.module('NewIntranetApp')
        .directive('spImage',['$templateCache','$compile','$http','$log','$rootScope','searchResultsCommon',function($templateCache,$compile,$http,$log,$rootScope,searchResultsCommon){
            var definition = {
                restrict: 'E',
                replace: true,
                scope: {
                    url:'='                    
                }    
            };
            definition.template='<img src="data:image/png;base64,{{data}}"/>';
            definition.link = function postLink(scope, element) {
           /** 
            var weburl='https://insightme.sharepoint.com/sites/pub/news';
            //get the image url and get the list folder
            var url=scope.url.replace(weburl,'');
            var index=url.lastIndexOf('/');
            var folder=url.substring(1,index);
            var file=url.substring(index+1);
            var fileUrl=weburl+"/_api/web/GetFolderByServerRelativeUrl('"+folder+"')/Files('"+file+"')/$value";
            */
            var request = 
            {
                method: 'POST',
                url: scope.url,
                token:'mytoken'
            };
            $http(request).then(function(response){
                scope.data=response.data;

            },function(error){
                scope.template='<span>error loading image from SharePoint Online!</span>'
            })
        
            };
            return definition;
        }])
})();