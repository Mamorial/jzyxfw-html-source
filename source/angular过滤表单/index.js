var app = angular.module("myApp", []);

app.service("products",
function() {
	return [{
		id: 1,
		name: "iphone",
		price: 5000
	},
	{
		id: 2,
		name: "iphone 4",
		price: 1993
	},
	{
		id: 3,
		name: "iphone 5",
		price: 2893
	},
	{
		id: 4,
		name: "iphone 6",
		price: 4500
	}];
});

app.controller("productController",
function($scope, products) {
	$scope.products = products; //Angular自动注入
	//排序条件
	$scope.order = "-"; //默认是升序,-表示降序
	$scope.orderType = "id"; //以id来排序,不能直接在页面以id这个字段排序
	$scope.changeOrder = function(type) {
		$scope.orderType = type;
		//如果本来是降序，就变为升序，如果是升序，就变为降序
		if ($scope.order === '') {
			$scope.order = '-';
		} else {
			$scope.order = '';
		}
	}
});