angular.module('resource.services',[]).factory('resourceServices',['$resource',function ($resource) { //自定义一个服务，使用$resource
    return $resource(
        '/jsbweb/:path',{},{     //get方式请求/springmvctest/test/source/  ，这里没有参数， paramDefauults为空
            gets: {method:'GET'}                   //自定义请求方式的方法，名字叫gets
        });
}])