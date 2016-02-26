angular.module('consignnote.common', [

])
    .factory('utils', ['$http',"$q", function ($http,$q) {
        return {
        	//在datas中查找key为value的data并返回
            findById: function findById(datas, key,value) {
                for (var i = 0; i < datas.length; i++) {
                    if (datas[i][key] == value) return datas[i];
                }
                return null;
            },
            //通过ajax从后台查询数据
            //url  		--->url地址
            //paramData --->参数，参数必须为js对象
            //method    --->POST,GET,默认为POST方法
            query: function(url, paramData, method) {
            	var deferred=$q.defer;
            	var result;
            	method!=null?method:"POST";
            	$http({
        			method : method,
        			url :url,
        			data : $.param(paramData),
        			headers : {
        				'Content-Type' : 'application/x-www-form-urlencoded'
        			}
        		}).success(function(data) {
        			deferred.resolve(result);
        		}).error(function(data){
        			deferred.resolve(result);
        		});
            	return deferred.promise;
            },
            query1:function(url, paramData, method){
            	this.query(url, paramData, method).then(function(data){
            		
            		console.info(data);
            	});
            }
        };
    }]);