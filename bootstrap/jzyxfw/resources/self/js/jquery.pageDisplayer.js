(function ($) {
    var template_01 = '<div class="row"><div class="col-xs-12" name="search_area_base"></div><div class="col-xs-12"><div class="bg-ex mg-t-10 bg-ex-white"><div class="row"><div class="col-xs-12" name="display_area_base"></div></div></div></div></div>';
    var _DisplayArray = {};
    _DisplayArray.template_01 = ["01", "02", "03", "04", "05"];
    function _autoAdjust($this) {
        var $icon = $this.find("[name='search_icon']");
        var $parent = ($icon.parent()).parent();
        var $search_btn = $parent.find("[name='search_btn']");
        $icon.css("margin-top", ($parent.height() - $icon.parent().height()) / 2);
        // 查询按钮在最下面，然后因为有个mg-b-5 所以一样保持
        $search_btn.css("margin-top", ($parent.height() - $search_btn.parent().height()) - 5);
    }

    //@wangyi 2015-5-13 modal 展示中需要
    $.fn.vAdjust = function () {
        _autoAdjust($(this));
    };
    $.fn.vPageDisplayer = function (templateID, components, baseDiv) {
        var _Array = _DisplayArray[templateID];
        if (!(_Array instanceof  Array)) {
            return;
        }
        var $this = $(this);
        // @wangyi 2015-5-4 将内容插入到页面中
        $this.find("form").append(eval(templateID));
        for (var i = 0; i < _Array.length; i++) {
            var elements = _getOrderdConf(_Array[i], components);
            display($this, _Array[i], elements, baseDiv);
        }
        //初始选中
        $this.find("ul[role='tablist']").each(function () {
            $(this).find('a').eq(0).tab('show');
        });
        //FIXED  做到了这里，要自动调整让两个元素垂直居中   A: By   _autoAdjust()
    };
    function display($this, comp_type, elements, baseDiv) {
        switch (comp_type) {
            case '01':
                displaySearchArea($this.find("[name='search_area_base']"), elements, baseDiv);
                break;
            case '02':
                displaySearchCondition($this.find("[name='search_area_base']"), elements, baseDiv);
                _autoAdjust($this);
                break;
            case '03':
                displayBtn($this.find("[name='display_area_base']"), elements, baseDiv);
                break;
            case '04':
                displayPanel($this.find("[name='display_area_base']"), elements, baseDiv);
                break;
            case '05':
                displayPlayer($this.find("[name='display_area_base']"), elements, baseDiv);
                break;
            default :
                break;
        }
    }

    function _getOrderdConf(comp_type, components) {
        var conf = $.vvPlugin.filterArray(components, "COMP_TYPE", comp_type);
        conf.sort(function (a, b) {
            return a["COMP_ID"] - b["COMP_ID"];
        });
        //_log(displayObj(conf));
        return conf;
    }

    var displayHtml = '<div class="bg-ex bg-ex-white mg-t-10"><div class="row"><div class="col-xs-1 text-center"><i class="fa fa-4x text-info" name="search_icon"></i></div><div class="col-xs-10"><div class="row"><div class="col-xs-12"><div class="bg-ex-title font-14"></div></div></div><div class="row mg-t-10" name="condition_area"></div></div><div class="col-xs-1"><input class="btn btn-success btn-block btn-sm" name="search_btn" value="查询" type="button"></div></div></div>';

    function displaySearchArea($this, elements) {
        $this.html(displayHtml);
        if (elements.length == 0) {
            return;
        }
        var opts = elements[0].COMP_CONTENTS;
        $this.find(".bg-ex-title").text(opts.search_title);
        $this.find("[name='search_icon']").addClass("fa-" + opts.search_img);

    }

    function displaySearchCondition($this, elements, baseDiv) {
        if (elements.length == 0) {
            return;
        }
        var html = "";
        var js = "";
        for (var i = 0; i < elements.length; i++) {
            //'<div class="col-xs-5 "><label class="control-label" for="' + elements[i].input_id + '">#input_name#</label><input type="text" class="form-control input-sm min-w-250" name="#input_id#" placeholder="请录入查询区域标题" validation="required|maxlen=40"></div>'
            var _array = _displayInput(elements[i].COMP_CONTENTS);
            html += _array[0];
            if (_array[1]) {
                js += _array[1];
            }
        }
        // 修改了方式
        //if (elements.length % 2 === 1) {
        //    html += '<div class="col-xs-5 "></div>';
        //}
        //html += ' <div class=" col-xs-2 "><button class="btn btn-success btn-block btn-sm" name="search_btn">查询</button></div>';
        $this.find("[name='condition_area']").append(html);
        $this.find(".form-date").each(function () {
            dPicker($(this));
        });
        $this.find("[codetype]").each(function () {
            $(this).load_Selection({
                codetype: $(this).attr("codetype")
                , cache: false
                //,defaultVal: '01'
            });
        });
        $this.find("[name='search_btn']").click(function () {
            //清空选项
            $("#" + baseDiv).find('a[data-toggle="tab"]').each(function () {
                $(this).removeClass();
                if ($(this).parent().hasClass("active"))
                    $(this).trigger("vv.dp_load");

            })

        });
        // 执行特殊代码
        eval(js);
    }

    function displayBtn($this, elements) {
        if (elements.length == 0) {
            return;
        }
        var html = '<div class="btn-group mg-t-10 mg-b-20" aria-label="操作按钮组">';
        var btnObj;
        for (var i = 0; i < elements.length; i++) {
            btnObj = elements[i].COMP_CONTENTS;
            html += '<button class="btn btn-default btn-sm" name="' + btnObj.btn_name + '">' + btnObj.btn_name;
            if (btnObj.btn_icon) {
                html += '<i class="fa fa-' + btnObj.btn_icon + ' mg-l-5"></i>';
            }
            html += '</button>';
        }
        html += '</div>';
        $this.append(html);

    }

    function displayPanel($this, elements) {
        if (elements.length == 0) {
            return;
        }
        var html = '<ul class="nav nav-tabs" role="tablist">';
        var content_html = "";
        var content_base = "<div class='row' name='base_row'></div>";


        for (var i = 0; i < elements.length; i++) {
            html += ' <li role="presentation" class="display-panel-title" ><a href="#pg_04_' + elements[i].PG_ID + '_' + elements[i].COMP_ID
            + '" aria-controls="pg_04_' + elements[i].PG_ID + '_' + elements[i].COMP_ID + '" role="tab" data-toggle="tab" name="' + elements[i].COMP_ID + '">';
            if (elements[i].COMP_CONTENTS.panel_icon) {
                html += '<i class="fa fa-' + elements[i].COMP_CONTENTS.panel_icon + ' mg-r-5"></i>';
            }
            html += elements[i].COMP_CONTENTS.panel_name + '</a> </li>';
            content_html += '<div role="tabpanel" class="tab-pane display-panel-content" id="pg_04_' + elements[i].PG_ID + '_' + elements[i].COMP_ID + '" name="' + elements[i].COMP_ID + '">' + content_base + '</div>';
        }

        html += '</ul><div class="tab-content pd-20 min-h-100" style="border:1px solid #ddd;border-top:0;border-radius:0 0 4px 4px;">';
        html += content_html;
        html += '</div>';
        $this.append(html);
        ////选中第一个
        //$this.find(".display-panel-title").eq(0).addClass("active");
        //$this.find(".tab-pane").eq(0).addClass("active");
    }

    function displayPlayer($this, elements, baseDiv) {
        if (elements.length == 0) {
            return;
        }
        for (var i = 0; i < elements.length; i++) {
            var $parent = $this.find('.tab-pane').filter("[name='" + elements[i].PARENT_ID + "']").find("[name='base_row']");
            if ($parent.length !== 1) {
                continue;
            }
            var ele = elements[i];
            // 2015-4-29 wangyi 这里的js是使用的闭包，记住这个就行，每太看懂描述
            var $a = $this.find('a[data-toggle="tab"][name="' + elements[i].PARENT_ID + '"]');
            $a.on('shown.bs.tab', function () {
                $(this).trigger("vv.dp_load");
            });

            // @wangyi 2015-5-19 修改缺陷，因为这里动态加载导致最终显示顺寻不一致，所以修改为先初始化dom后执行js
            _displayDP(ele, $parent, $a, baseDiv, true);
            $a.on('vv.dp_load', function (ele, $parent, $a) {
                return function () {
                    //_log($(e.target).html()); // newly activated tab
                    //_log($(e.relatedTarget).html());// previous active tab
                    // 每个显示组建到这里都会初始化一遍
                    if ($(this).hasClass("initFlag" + ele.COMP_ID)) {
                        return;
                    }
                    $(this).addClass("initFlag" + ele.COMP_ID);
                    //alert(displayObj(ele));
                    _displayDP(ele, $parent, $a, baseDiv);
                }
            }(ele, $parent, $a));
        }
    }

    function _displayDP(_component, $parent, $a, baseDiv, initOnly) {
        var html = "";
        var jsCode = "";
        // @wangyi 2015-5-14 解决一个bug，如果预览后页面中的就不会在加载了
        var dp_id = baseDiv + "_" + _component.PG_ID + '_dp_' + _component.COMP_ID;
        var _displayer = "";
        var _msg = "";
        // 第一次初始化就把信息留下，下次节省一次查询
        if (initOnly) {
            commonAjax_none("/engine/pageMaker/loadDPInfo.do", {DP_ID: _component.COMP_CONTENTS.DP_ID}, function (msg) {
                _displayer = eval("(" + msg + ")");
                _msg = msg;
            }, {async: false});

        } else {
            _displayer = $("#" + dp_id).data("displayer");
        }
        switch (_displayer.DP_TYPE) {
            //表格
            case "01":
                var colDef = ",columnDefs:[";
                if ($("#" + dp_id).length == 1 && $("#" + dp_id).data("table")) {
                    $("#" + dp_id).data("table").ajax.reload();
                    return;
                }
                jsCode += "var table = $(\"#" + dp_id + "\").DataTable({";
                jsCode += "ajax:{url:'" + _displayer.DP_SRC + "',dataSrc:'',type:'post'" +
                ",data:$.extend(function(){return _getAllParam(baseDiv," + displayObj(_component.COMP_CONTENTS.DISPLAY_PARAMS ? _component.COMP_CONTENTS.DISPLAY_PARAMS : {}) + ")},{})},";
                jsCode += "columns:[";
                html += "<table id='" + dp_id + "' class='table table-fixed hover display";
                var _style = _component.COMP_CONTENTS.DISPLAY_TABLE_STYLE;
                if (_style) {
                    if (_style.indexOf("01") != -1) {
                        html += " compact";
                    }
                }
                html += "'><thead><tr>";
                for (var i = 0; i < _displayer.DP_DATAS.length; i++) {
                    if (_displayer.DP_DATAS[i].DP_COL_VISIBLE !== "0")
                        continue;
                    html += "<th>" + _displayer.DP_DATAS[i].DP_COL_NAME + "</th>"
                    if (i !== 0) {
                        jsCode += ",";
                    }
                    jsCode += "{data:'" + _displayer.DP_DATAS[i].DP_COL_ID + "'}";
                    if (_displayer.DP_DATAS[i].DP_RENDER) {
                        colDef += "{render:function ( data, type, row ) {" + _displayer.DP_DATAS[i].DP_RENDER + "},targets:" + i + "},";
                    }
                }
                html += "</tr></thead></table>";
                jsCode += "]";
                if (colDef[colDef.length - 1] == ",")
                    colDef = colDef.substr(0, colDef.length - 1);
                jsCode += colDef + "]";
                var _func = _component.COMP_CONTENTS.DISPLAY_TABLE_BASEFUNC;
                if (_func) {
                    jsCode += ",dom: \"T<'clear'><'row'<'col-sm-6'" + (_func.indexOf("01") !== -1 ? 'f' : '') + ">" +
                    "<'col-sm-6'" + (_func.indexOf("02") !== -1 ? 'l' : '') + ">><'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-5'" + (_func.indexOf("03") !== -1 ? 'i' : '') + ">" +
                    "<'col-sm-7'" + (_func.indexOf("04") !== -1 ? 'p' : '') + ">>\"";
                }
                jsCode += "});";
                //  通过jquery存储在dom中,在datatables中实现
                //jsCode += "$(\"#" + dp_id + "\").data(\"table\",table);";
                // @wangyi 2015-5-20 这是错误的方式 删除掉了
                //绑定刷新方法
                // 这里同样要使用闭包
                //if (!initOnly) {
                //    $a.on("vv.dp_refresh", function (dp_id) {
                //        return function () {
                //            $("#" + dp_id).data("table").ajax.reload();
                //        }
                //    }(dp_id));
                //}
                break;
            case "02":
                // 初始化只加载dom
                if (initOnly) {
                    html += "<div id='" + dp_id + "' class='vChart col-xs-" + _component.COMP_CONTENTS.DISPLAY_WIDTH + "' style='height:" + _component.COMP_CONTENTS.DISPLAY_HEIGHT + "px;'></div>";
                    break;
                }
                var _datas = [];
                var _exJs = "";
                var _tooltip = "";
                var _title_position = "center";
                var _feature = {};
                commonAjax_none(_displayer.DP_SRC, _getAllParam(baseDiv, _component.COMP_CONTENTS.DISPLAY_PARAMS ? _component.COMP_CONTENTS.DISPLAY_PARAMS : {}), function (msg) {
                    var d = eval("(" + msg + ")");
                    switch (_displayer.DP_CONTENTS.DP_CHART_TYPE) {
                        case 'bar':
                            var pre = [];
                            var cols = _displayer.DP_CONTENTS.DP_CHART_COLS.split(",");
                            var cols_name = _displayer.DP_CONTENTS.DP_CHART_COLS_NAME.split(",");
                            // 先建立数组，然后遍历结果，行成数据
                            for (var i = 0; i < cols.length; i++) {
                                pre.push([]);
                            }
                            for (var i = 0; i < d.length; i++) {
                                for (var j = 0; j < cols.length; j++) {
                                    pre[j].push(d[i][cols[j]]);
                                }
                            }
                            //跳过第一列，第一列是X轴
                            for (var i = 1; i < cols.length; i++) {
                                _datas.push({
                                    name: cols_name[i], type: 'bar', data: pre[i], markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                });
                            }
                            /* 分隔线，下面处理样式*/
                            //这里后面不用了，用为图列需要去掉第一个
                            _title_position = "left";
                            cols_name.shift(0);
                            _exJs = ", xAxis: [{" +
                            "                    type: 'category', data: " + displayObj(pre[0]) +
                            "                }], yAxis: [{" +
                            "                    type: 'value'" +
                            "                }],legend: {" +
                            "                       data:" + displayObj(cols_name) +
                            "                }";
                            _tooltip = "trigger: 'axis'";
                            _feature = {
                                mark: {show: true},
                                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                                restore: {show: true},
                                saveAsImage: {show: true}
                            };
                            break;
                        case 'pie':
                            for (var i = 0; i < d.length; i++) {
                                _datas.push({name: d[i]["NAME"], value: d[i]["VALUE"]});
                            }
                            _datas = [{
                                name: _displayer.DP_CONTENTS.DP_CHART_NAME,
                                type: 'pie', radius: '60%', center: ['50%', '60%'],
                                data: _datas
                            }];
                            /* 分隔线，下面处理样式*/
                            _tooltip = "trigger: 'item', formatter: \"{a} <br/>{b} : {c} ({d}%)\"";
                            _feature = {
                                mark: {show: true},
                                restore: {show: true},
                                saveAsImage: {show: true}
                            };
                            break;
                        default :
                            break;
                    }
                }, {async: false});
                if (!_datas)
                    _datas = "[]";
                else
                    _datas = displayObj(_datas);
                jsCode += /*"require.config({" +
                "            paths: {" +
                "                echarts: '/resources/echarts/js'" +
                "            }" +
                "        });" +*/
                    //改为全部引入，应当不会影响
                "        require(['echarts', 'echarts/theme/" + _component.COMP_CONTENTS.DISPLAY_CHART_STYLE + "', 'echarts/chart/pie','echarts/chart/bar','echarts/chart/line'], function (ec, theme) {" +
                "            var myChart = ec.init(document.getElementById('" + dp_id + "'), theme);" +
                "            var option = {" +
                "                title: {" +
                "                    text: '" + _displayer.DP_NAME + "', " +
                "                    subtext: '" + _component.COMP_CONTENTS.DISPLAY_NAME + "', " +
                "                    x: '" + _title_position + "'" +
                "                }, tooltip: {" + _tooltip +
                "                }, toolbox: {" +
                "                    show: true, feature: " + displayObj(_feature) +
                "                }, calculable: true, series: " + _datas + _exJs + "};" +
                "            myChart.setOption(option);" +
                "            $(\"#" + dp_id + "\").data(\"chart\",myChart);   });";
                break;
            default :
                break;
        }
        if (initOnly) {
            $parent.append(html);
            // 初始化时，把数据存储
            $("#" + dp_id).data("displayer", _displayer);
        } else {
            eval(jsCode);
        }
    }


    function _displayInput(inputObj) {
        var _html = '<div class="col-xs-4 mg-b-5"><label class="control-label min-w-150" for="' + inputObj.INPUT_ID + '">' + inputObj.INPUT_NAME + '：&nbsp;</label>'
        var _js;
        switch (inputObj.INPUT_TYPE) {
            case '01':
                _html += '<input type="text" class="form-control input-sm" name="' + inputObj.INPUT_ID + '" placeholder="请录入' + inputObj.INPUT_NAME + '" validation="' + inputObj.INPUT_VALI + '"></div>';
                break;
            case '02':
                _html += '<select class="form-control input-sm" codetype="' + inputObj.CODETYPE + '" name="' + inputObj.INPUT_ID + '"  validation="' + inputObj.INPUT_VALI + '"></select></div>';
                break;
            case '03':
                _html += '<div class="input-group input-group-sm date form-date" data-date-format="yyyy-mm-dd" name="stu_birthday_div"><input class=" form-control" name="'
                + inputObj.INPUT_ID + '" type="text" placeholder="请录入' + inputObj.INPUT_NAME + '" validation="'
                + inputObj.INPUT_VALI + '"> <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span> </div></div>';
                break;
            case '04':
                var _array = _displaySelects(inputObj);
                _html = _array[0];
                _js = _array[1];
                break;
            case '05':
                // 参数的加载放在加载时
                _html += "<input type='hidden' name='" + inputObj.INPUT_ID + "' jsCode='" + inputObj.EXECUTE_FUNC + "'>";
            default :
                break;
        }
        return [_html, _js];
    }

    function _displaySelects(inputObj) {
        // 调用同步方法
        var html = "";
        var js = "";
        commonAjax_none("/engine/pageMaker/loadDPInfo.do", {DP_ID: (inputObj.SELECTS_ID.split("|"))[0]}, function (msg) {
            var displayer = eval("(" + msg + ")");
            if (displayer.DP_DATAS) {
                for (var i = 0; i < displayer.DP_DATAS.length; i++) {
                    html += '<div class="col-xs-4 mg-b-5"><label class="control-label min-w-150" for="' + displayer.DP_DATAS[i]["ID_" + (i + 1)] + '">' + displayer.DP_DATAS[i]["NAME_" + (i + 1)] + '：&nbsp;</label>';
                    html += '<select class="form-control input-sm wd-100"  name="' + displayer.DP_DATAS[i]["ID_" + (i + 1)] + '"  ><option value="">请选择</option></select></div>';
                    if (i != 0) {
                        // 了解eval的作用机制,再eval时，有baseDiv这个变量哦
                        js += 'fObject("' + displayer.DP_DATAS[i]["ID_" + (i + 1)] + '", baseDiv).prop("disabled", true);';
                    }
                    if (i == 0) {
                        html += "<input type='hidden' name='" + inputObj.INPUT_ID + "' >";
                        js += _loadSelect(displayer.DP_DATAS, i);
                    }

                    js += 'fObject("' + displayer.DP_DATAS[i]["ID_" + (i + 1)] + '", baseDiv).change(function(){';
                    // 变更时提供一个最后的值，对于只需要一个参数的非常有用
                    js += 'fObject("' + inputObj.INPUT_ID + '", baseDiv).val($(this).val());';
                    if (displayer.DP_DATAS.length > i + 1) {
                        for (var j = i + 1; j < displayer.DP_DATAS.length; j++) {
                            js += 'fObject("' + displayer.DP_DATAS[j]["ID_" + (j + 1)] + '", baseDiv).val("");';
                            js += 'fObject("' + displayer.DP_DATAS[j]["ID_" + (j + 1)] + '", baseDiv).prop("disabled", true);';
                        }
                        js += _loadSelect(displayer.DP_DATAS, i + 1);
                    }
                    js += '});'
                }
            }
        }, {async: false})
        return [html, js];
        function _loadSelect(obj, index) {
            return 'fObject("' + obj[index]["ID_" + (index + 1)] + '", baseDiv).load_Selection({' +
                ' param: $.extend({SQL:"' + (obj[index]["SQL_" + (index + 1)]).replace(/[\r\n]/g, "") + '"}, $.vvPlugin.parseParamObj($("#" + baseDiv).find("[name=\'search_area_base\'] [name]"))),cache: false});'
        }
    }


    function _getAllParam(baseDiv, defaultParam) {
        //替换动态入参
        for (var _param in defaultParam) {
            var _value = defaultParam[_param];
            if (_value[0] === "#" && _value[_value.length - 1] === "#") {
                //_log(displayObj($("#" + baseDiv).data("vars")));
                //_log(_value.replaceAll("#"));
                var _d = $("#" + baseDiv).data("vars")[_value.replaceAll("#", "")];
                if (!_d) {
                    _log(_value + "没有找到对应的入参");
                    defaultParam[_param] = "";
                } else {
                    defaultParam[_param] = _d;
                }
            }
        }
        var param = new Object();
        var $search_area = $("#" + baseDiv).find("[name='search_area_base']");
        // @wangyi 2015-5-14 增加了虚拟参数，改变获取的方法
        $.vvPlugin.filterFormEle($search_area).each(function () {
            var _jsCode = $(this).attr("jsCode");
            if (_jsCode) {
                //有的参数需要执行一段js 如有了时间需要截取分表表名
                //alert(_jsCode);
                var reg = new RegExp("\\$(\\w+)\\.", "gmi");
                //alert(_jsCode.replace(reg, '$search_area.find(\"[name=\'$1\']\")'));
                _jsCode = _jsCode.replace(reg, '$search_area.find(\"[name=\'$1\']\").');
                //alert(_jsCode.replaceAll("&VSp;", "\""));
                _jsCode = _jsCode.replaceAll("&VSp;", "\"");
                $(this).val(eval(_jsCode));
            }
            param[$(this).attr("name")] = $(this).val();

        });
        return $.extend(defaultParam,param);
    }

    function inputObj(opts) {
        this.INPUT_NAME = opts.INPUT_NAME;
        this.INPUT_ID = opts.INPUT_ID;
        this.INPUT_VALI = opts.INPUT_VALI;
        this.INPUT_TYPE = opts.INPUT_TYPE;
    }

    function btnObj(opts) {
        this.btn_name = opts.btn_name;
        this.btn_id = opts.btn_id;
        this.btn_icon = opts.btn_icon;
        this.btn_func = opts.btn_func;
    }

})
(jQuery);