define(function() {

	// 加载资源
	angular.loadJS = function($q, moduleNames) {
		var module = Array.prototype.slice.call(arguments, 1),
			defer = $q.defer();
		require(module, function() {
			defer.resolve();
		});
		return defer.promise;
	};

	var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'pasvaz.bindonce', 'lx']);

	app.config(['$stateProvider', '$httpProvider', '$controllerProvider', '$provide', function ($stateProvider, $httpProvider, $controllerProvider, $provide) {
		
		$stateProvider.state('home', {		// 主页
			url: '',
			templateUrl: require.pageUrl + 'home/template/home.html'
		})
		.state('main', {				// 模板页面
			abstract: true,
			url: '/main',
			templateUrl: 'main.html'
		})
		.state('userInfo', {			// 用户洞察页面
			parent: 'main',
			url: '/userInfo',
			templateUrl: require.pageUrl + 'userInfo/template/userInfo.html',
			controller: 'userInfoCtrl',
			resolve: ['$q', function($q) {
				return angular.loadJS($q, 'userInfoCtrl');
			}]
		});


		app.register = {
			controller: $controllerProvider.register,
			factory: $provide.factory
		};

	}]);

	angular.bootstrap(document, ['app']);

	return app;

});
