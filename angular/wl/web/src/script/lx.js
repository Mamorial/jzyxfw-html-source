angular.module('lx', [])
	.directive('lxStar', [function () {				
		return {
			restrict: 'A',
			replace: true,
			scope: {
				currentLevel: '=',					// 当前级别数字
				clickFn: '&'						// 单击事件，可选参数   暂时没写扩展代码
			},
			template: '<span style="display:inline-block"></span>',
			link: function (scope, elem, attrs) {
				var cssArr = attrs.lxStar.split('-'),			// 存放级别的两个样式信息 'star-active'
					starCss = cssArr[0] || 'star',				// 未激活的级别样式
					activeCss = cssArr[1] || 'active',			// 激活的级别样式
					max = scope.$eval(attrs.maxLevel) || 5,		// 最大级别数字
					watch = null;
					
				createDom(elem, scope.currentLevel, max, starCss, activeCss);
				
				watch = scope.$watch('currentLevel', function(newVal, oldVal) {		// 监控当前级别值
					elem.find('span.' + activeCss).removeClass(activeCss);
					if (angular.isNumber(newVal)) {
						newVal -= 1;
						var spans = elem.find('span');
						for (var i = 0; i <= newVal; i++) {
							spans.eq(i).addClass(activeCss);
						}
					}
				});

				scope.$on('$destroy', function() {
					watch();
					watch = null;
					elem.remove();
				});


				function createDom(con, current, max, starCss, activeCss) {		// 生成所有级别DOM
					var domTemplate = angular.element('<span>').addClass(starCss),
						fragment = document.createDocumentFragment();
					for (var i = 0; i < max; i++) {				
						var dom = domTemplate.clone();
						if ((i + 1) <= current) {
							dom.addClass(activeCss);
						}
						fragment.appendChild(dom[0]);
					}
					con[0].appendChild(fragment);
				}
			}
		};
	}])
	.directive('lxDelegate', [function () {			//事件代理
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var opts = scope.$eval(attrs.lxDelegate),
					field = attrs.lxDelegateField;

				angular.forEach(opts, function(v, i) {
					elem.on(v.type + '.lx', v.target, function(e) {
						var target = $(this);
						scope.$apply(v.fn(e, target.scope()[field]));
					});
				});

				scope.$on('$destroy', function() {
					elem.off('.lx');
					opts = field = null;
				});
			}
		};
	}])
	.directive('lxCharts', [function () {		// 基于echarts的图标
		return {
			restrict: 'A',
			scope: {
				conf: '='			//	图标配置项
			},
			link: function (scope, elem, attrs) {
				var echartsObj = null;

				
				var ww = scope.$watch('conf', function(newVal, oldVal) {
					
					if (newVal) {
						if (!echartsObj) {
							echartsObj = echarts.init(elem[0]);
						}
						echartsObj.setOption(newVal);
					}
				});

				scope.$on('$destroy', function() {
					ww();
					echartsObj && echarts.dispose(elem[0]) && (echartsObj = null);
				});
			}
		};
	}])