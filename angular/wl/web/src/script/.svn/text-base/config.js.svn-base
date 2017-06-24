(function() {

	var libUrl = '../../lib/';

	require.config({
		paths: {
			jquery: libUrl + 'jquery/jquery.min',
			angular: libUrl + 'angular/angular.min',
			router: libUrl + 'angular/angular-ui-router.min',
			bindonce: libUrl + 'bindonce/bindonce.min',
			echarts: libUrl + 'echarts/echarts.min',
			uiBootstrap: libUrl + 'ui-bootstrap/ui-bootstrap-tpls-0.12.0.min',
			userInfoCtrl: 'userInfo/controller/userInfoCtrl',
			test1Ctrl: 'userInfo/controller/test1Ctrl'
		},
		shim: {
			angular: ['jquery'],
			router: ['angular'],
			uiBootstrap: ['angular'],
			bindonce: ['angular'],
			lx: ['angular'],
			app: ['router', 'uiBootstrap', 'bindonce', 'lx']
		},
		deps: ['app']
	});

	require.pageUrl = 'src/script/';

})();

