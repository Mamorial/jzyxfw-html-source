//业务分类图表


	// 路径配置
     require.config({
         paths: {
              echarts: '../../resources/echarts/js'
          }
      });

     // 使用
      require(
          [
             'echarts',
              'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
              'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
         ],
          function (ec) {
              // 基于准备好的dom，初始化echarts图表
              var myChart = ec.init(document.getElementById('main'));
              
              var option = {
                		title : {
                	        text: '活动推送量及成功率',
                	        x:'center'
                	    },
                	    tooltip : {
                	        trigger: 'axis'
                	    },
                	    
                	    calculable : true,
                	    legend: {
                	    	orient : 'vertical',
                	        data:['推送量','成功率'],
                	        x:'left'
                	    },
                	    xAxis : [
                	        {
                	            type : 'category',
                	            data : ['低零一','低零二','懵懂一','懵懂三','任性一','任性二','任性三']
                	            
                	        }
                	    ],
                	    yAxis : [
                	        {
                	            type : 'value',
                	            name : '推送量',
                	            splitNumber:3,
                	            axisLabel : {
                	                formatter: '{value}'
                	            }
                	        },
                	        {
                	            type : 'value',
                	            name : '成功率',
                	            splitNumber:3,
                	            axisLabel : {
                	                formatter: '{value} %'
                	            }
                	        }
                	    ],
                	    series : [

                	        {
                	            name:'推送量',
                	            type:'bar',
                	            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6],
                	            barWidth:10
                	        },
                	       
                	        {
                	            name:'成功率',
                	            type:'line',
                	            yAxisIndex: 1,
                	            data:[2.0, 2.2, 3.3, 44.5, 6.3, 15, 20.3]
                	        }
                	    ]
                	};
              
//            var option = {
//            	title : {
//    text: '业务分类',
////      subtext: '纯属虚构',
//    x:'center'
//},
//tooltip : {
//    trigger: 'axis',
//    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
//        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
//    }
//},
//legend: {
//	x : 'left',
//    data:['推送数量']
//},
//toolbox: {
//    show : true,
//    orient: 'vertical',
//    x: 'right',
//    y: 'top',
//    feature : {
//        
//        
//        magicType : {show: true, type: ['line', 'bar']},
//       
//    }
//},
//calculable : true,
//xAxis : [
//    {
//        type : 'category',
//       data : ['业务一','业务二','业务三','业务四','业务五','业务六','业务七']
//    }
//],
//yAxis : [
//    {
//        type : 'value'
//    }
//],
//series : [
//    
//  
//   
//   {
//        name:'推送数量',
//       type:'bar',
//        data:[862, 1018, 964, 1026, 1679, 1600, 1570],
//       barWidth:10,
//        markLine : {
//           itemStyle:{
//               normal:{
//               	
//                   lineStyle:{
//                       type: 'dashed'
//                    },
//                   color:'#f00'
//                }
//               
//            },
//            data : [
//               [{type : 'min'}, {type : 'max'}]
//           ]
//       }
//    }
//   
// ]
//};
              // 为echarts对象加载数据
              myChart.setOption(option,true);
              $(window).resize(myChart.resize);
          }
      );


//触点分类图表
// 路径配置
        require.config({
            paths: {
                echarts: '../../resources/echarts/js'
            }
        });

        // 使用
        require(
            [
                'echarts',
                'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
                'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('main_right'));
                
                
                var option = {
                		title : {
                	        text: '触点推送量及成功率',
                	        x:'center'
                	    },
                	    tooltip : {
                	        trigger: 'axis'
                	    },
                	    
                	    calculable : true,
                	    legend: {
                	    	orient : 'vertical',
                	        data:['推送量','成功率'],
                	        x:'left'
                	    },
                	    xAxis : [
                	        {
                	            type : 'category',
                	            data : ['短信','微信','DNS']
                	        }
                	    ],
                	    yAxis : [
                	        {
                	            type : 'value',
                	            name : '推送量',
                	            splitNumber:3,
                	            axisLabel : {
                	                formatter: '{value}'
                	            }
                	        },
                	        {
                	            type : 'value',
                	            name : '成功率',
                	            splitNumber:3,
                	            axisLabel : {
                	                formatter: '{value} %'
                	            }
                	        }
                	    ],
                	    series : [

                	        {
                	            name:'推送量',
                	            type:'bar',
                	            data:[25.6, 76.7, 135.6],
                	            barWidth:10
                	        },
                	       
                	        {
                	            name:'成功率',
                	            type:'line',
                	            yAxisIndex: 1,
                	            data:[ 6.3, 15, 20.3]
                	        }
                	    ]
                	};
                
                
//              var option = {
//              	title : {
//      text: '触点分类',
////      subtext: '纯属虚构',
//      x:'center'
//  },
//  tooltip : {
//  	
//  	formatter: "{a} <br/>{b} : {c}%",
//   	
//  	
//      trigger: 'axis',
//      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
//          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
//      }
//  },
//  legend: {
//  	x : 'left',
//      data:['成功率']
//  },
//
//  toolbox: {
//      show : true,
//      orient: 'vertical',
//      x: 'right',
//      y: 'top',
//      feature : {
//          
//          
//          magicType : {show: true, type: ['line', 'bar']},
//         
//      }
//  },
//  calculable : true,
//  xAxis : [
//      {
//          type : 'category',
//          data : ['短信','微信','移动']
//      }
//  ],
//  yAxis : [
//      {
//          type : 'value',
//          axisLabel : {
//              formatter: '{value} %'
//          }
//      }
//  ],
//  series : [
//      
//     
//     
//      {
//          name:'成功率',
//          type:'bar',
//          data:[35, 88, 57],
//          barWidth:15,
//          markLine : {
//              itemStyle:{
//                  normal:{
//                      lineStyle:{
//                          type: 'dashed'
//                      },
//                      color:'#f00'
//                  }
//              },
//              data : [
//                  [{type : 'min'}, {type : 'max'}]
//                  
//              ]
//          }
//      },
//     
//  ]
//};
                // 为echarts对象加载数据
                myChart.setOption(option,true);
                $(window).resize(myChart.resize);
            }
        );
        

//用户数
// 路径配置
        require.config({
            paths: {
                echarts: '../../resources/echarts/js'
            }
        });

        // 使用
        require(
            [
                'echarts',
                'echarts/chart/pie', // 使用柱状图就加载bar模块，按需加载
                'echarts/chart/funnel' // 使用柱状图就加载bar模块，按需加载
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('main_center_left'));
                
                
                var option = {
    title : {
        text: '业务推送量及成功率',
//      subtext: '纯属虚构',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        x : 'left',
        data:['流量','宽带','ITV']
    },
    toolbox: {
        show : true,
        feature : {
           
          
            magicType : {
                show: true, 
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
        }
    },
    calculable : true,
    series : [
        {
            name:'用户数',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'流量'},
                {value:310, name:'宽带'},
                
                {value:1548, name:'ITV'}
            ]
        }
    ]
};
                    
                // 为echarts对象加载数据
                myChart.setOption(option,true);
                $(window).resize(myChart.resize);
            }
        );
        


//触点类型
// 路径配置
        require.config({
            paths: {
                echarts: '../../resources/echarts/js'
            }
        });

        // 使用
        require(
            [
                'echarts',
                'echarts/chart/pie', // 使用柱状图就加载bar模块，按需加载
                'echarts/chart/funnel' // 使用柱状图就加载bar模块，按需加载
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart2 = ec.init(document.getElementById('main_center_right'));
                
                
                var option = {
    title : {
        text: '渠道推送量及成功率	',
//      subtext: '纯属虚构',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        x : 'left',
        data:['线上','线下']
    },
    toolbox: {
        show : true,
        feature : {
           
          
            magicType : {
                show: true, 
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
        }
    },
    calculable : true,
    series : [
        {
            name:'用户数',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'线上'},
                {value:310, name:'线下'},
                
            ]
        }
    ]
};
                    
                // 为echarts对象加载数据
                myChart2.setOption(option,true);
          $(window).resize(myChart2.resize);
            }
        );
        


//到达率图表
// 路径配置
        require.config({
            paths: {
                echarts: '../../resources/echarts/js'
            }
        });

        // 使用
        require(
            [
                'echarts',
                'echarts/chart/gauge'// 使用柱状图就加载bar模块，按需加载
                //'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('main_head_left1'));
                
                
                var option = option = {
				    tooltip : {
				        formatter: "{a} <br/>{b} : {c}%"
				    },
				    toolbox: {
				        show : true,
				        feature : {
				          
				 
				        }
				    },
				    series : [
				        {
				            name:'业务指标',
				            center : ['50%', '50%'], 
				            type:'gauge',
				            radius : [0, '99%'],
				            detail : {formatter:'{value}%'},
				            data:[{value: 73, name: '到达率'}],
				            axisTick:	
							{
							    show: true,
							    splitNumber: 5,
							    length :5,
							    lineStyle: {
							        color: '#eee',
							        width: 1,
							        type: 'solid'
							    }
							} ,
							splitLine:{
								    show: true,
								    length :10,
								    lineStyle: {
								        color: '#eee',
								        width: 1,
								        type: 'solid'
								    }
								},
				            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
				                show: false,
				                
				                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                    color: '#333'
				                }
				            },
				            axisLine:{
									    show: true,
									    lineStyle: {
									        color: [
									            [0.2, '#228b22'],
									            [0.8, '#48b'],
									            [1, '#ff4500']
									        ],
									        width: 15
									    }
									} ,
				            pointer : {
				                length : '75%',
				                width :8,
				                color : 'auto'
				            },
				            title : {
				                show : true,
				                offsetCenter: ['0', -28],       // x, y，单位px
				                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                    color: '#000',
				                    fontSize : 12
				                }
				            },
				            
				        }
				    ]
				};
                    
                // 为echarts对象加载数据
                myChart.setOption(option,true);
                $(window).resize(myChart.resize);
            }
        );
        

//成功率图表
 // 路径配置
        require.config({
            paths: {
                echarts: '../../resources/echarts/js'
            }
        });

        // 使用
        require(
            [
                'echarts',
                'echarts/chart/gauge'// 使用柱状图就加载bar模块，按需加载
                //'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('main_head_left2'));
                
                
                var option = option = {
				    tooltip : {
				        formatter: "{a} <br/>{b} : {c}%"
				    },
				    toolbox: {
				        show : true,
				        feature : {
				          
				 
				        }
				    },
				    series : [
				        {
				            name:'业务指标',
				            center : ['50%', '50%'], 
				            type:'gauge',
				            radius : [0, '99%'],
				            detail : {formatter:'{value}%'},
				            data:[{value: 87, name: '成功率'}],
				            axisTick:	
							{
							    show: true,
							    splitNumber: 5,
							    length :5,
							    lineStyle: {
							        color: '#eee',
							        width: 1,
							        type: 'solid'
							    }
							} ,
							splitLine:{
								    show: true,
								    length :10,
								    lineStyle: {
								        color: '#eee',
								        width: 1,
								        type: 'solid'
								    }
								},
								axisLine:{
									    show: true,
									    lineStyle: {
									        color: [
									            [0.2, '#228b22'],
									            [0.8, '#48b'],
									            [1, '#ff4500']
									        ],
									        width: 15
									    }
									} ,
				            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
				                show: false,
				                
				                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                    color: '#333'
				                }
				            },
				            pointer : {
				                length : '75%',
				                width :8,
				                color : 'auto'
				            },
				            title : {
				                show : true,
				                offsetCenter: ['0', -28],       // x, y，单位px
				                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                    color: '#000',
				                    fontSize : 12
				                }
				            },
				            
				        }
				    ]
				};
                    
                // 为echarts对象加载数据
                myChart.setOption(option,true);
                $(window).resize(myChart.resize);
            }
        );
        

  