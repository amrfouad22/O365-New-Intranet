(function () {
  angular.module('NewIntranetApp')
  .factory('searchResultsCommon',searchResultsCommon);
  //transform search result data
	function searchResultsCommon($http)
	{
		var service={};
		var items=[];
		service.transformResults=transformResults;
		function transformResults(collection, mapping){
			collection.forEach(function(collectionItem){
				var item={};
				collectionItem.Cells.forEach(function(cell){
					var filtered=filter(mapping,{"from":cell.Key});
					if(filtered.length==1){
						item[filtered[0].to]=decode(cell.Value);
					}
				});
				items.push(item);
			});
			return items;
		}
		return service;
	};
	//filter array based on multiple criteria
	function filter(arr, criteria) {
		return arr.filter(function(obj) {
			return Object.keys(criteria).every(function(c) {
			return obj[c] == criteria[c];
			});
  		});
	};
	//decode value (term . image url)
	function decode(value){
		if(value==null)
			return "";
		//image fieldss
		if(value.indexOf("<img")>-1){
			return url= getImageUrl(value);
		}
		//if it doesn't need decoding...
		return value;
	}
	//convert image to full path instead of relative img tag
	function getImageUrl(img){
		var startIndex = img.indexOf("src=\"");
        if (startIndex > 0) {
            var value = img.substring(startIndex + 5);
            return searchBaseUrl+value.substring(0, value.indexOf("\"")) 
        }
        return ""; //replace this with the default image url later
	}
}());