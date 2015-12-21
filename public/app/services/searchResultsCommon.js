(function () {
  angular.module('NewIntranetApp')
  .factory('searchResultsCommon',searchResultsCommon);
  //transform search result data
	function searchResultsCommon()
	{
		var service={};
		var items=[];
		service.transformResults=transformResults;
		function transformResults(collection, mapping){
			collection.forEach(function(collectionItem){
				var item={};
				collectionItem.Cells.forEach(function(cell){
					if(mapping.find(cell.Key)){
						item[cell.Key]=cell.Value;
					}
				});
				items.push(item);
			});
			return items;
		}
		return service;
	};
}());