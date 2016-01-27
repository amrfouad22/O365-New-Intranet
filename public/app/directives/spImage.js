(function () {
    angular.module('NewIntranetApp')
        .directive('spImage',['$templateCache','$compile','$http','$log','$rootScope','searchResultsCommon',function($templateCache,$compile,$http,$log,$rootScope,searchResultsCommon){
            var definition = {
                restrict: 'E',
                replace: true,
                scope: {
                    url:'=',
                    webUrl:'=',
                    resourceUrl:'='                    
                }    
            };
            definition.template='<img src="{{data}}"/>';
            definition.link = function postLink(scope, element) {
                var cache=true;
                if(!cache){
                    var weburl='https://insightme.sharepoint.com/sites/pub/news';
                    //get the image url and get the list folder
                    var url=scope.url.replace(weburl,'');
                    var index=url.lastIndexOf('/');
                    var folder=url.substring(1,index);
                    var file=url.substring(index+1);
                    var fileUrl=weburl+"/_api/web/GetFolderByServerRelativeUrl('"+folder+"')/Files('"+file+"')/$value";
                    var request={
                        url:fileUrl,
                        method:'GET'
                    }
                    $http(request).then(function(response){
                        scope.data=response.data;
                        console.log(JSON.stringify(request.headers));
                    },function(error){
                        scope.template='<span>error loading image from SharePoint Online!</span>'
                    });
                    
                }
                else
                {
                    //get cached access token and send it to the nodejs image handler endpoint
                    var authContext=new AuthenticationContext();
                    var token=authContext.getCachedToken("https://insightme.sharepoint.com");
                    var request = 
                    {
                        method: 'POST',
                        url:'/images/',
                        data:
                        {
                            image:scope.url,
                            token:'Bearer '+token
                        } 
                    };
                    $http(request).then(function(response){
                        scope.data=response.data;

                    },function(error){
                        scope.template='<span>error loading image from SharePoint Online!</span>'
                    })
                }
                
            };
            return definition;
        }])
})();