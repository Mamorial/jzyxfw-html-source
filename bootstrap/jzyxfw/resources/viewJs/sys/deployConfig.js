(function () {
    bindJsInit("init.page.deployConfig", function (serverData) {
        var baseDiv = serverData.baseDiv, $baseDiv = $("#" + baseDiv);
        var frontData = evalV(serverData.frontData)/*object*/, configData = frontData.configInfo/*array*/
            , savedConfig = frontData.savedConfig/*object*/;
        fObject("sysConfigArea", baseDiv).append(template("template_page_component_addSysConf", {configData: configData}));

        $.each(configData, function (idx, ele) {
            var $container = fObject(ele.field, baseDiv), savedVal = savedConfig[ele.field];
            switch (ele.configType) {
                case "text":
                    if (savedVal) {
                        $container.find("input").val(savedVal);
                    }
                    break;
                case "select":

                case "multiSelect":
                    var dictionary = ele.dictionary, codes, param = {$container: fObject(ele.field, baseDiv), savedVal: savedVal};
                    if ($.type(dictionary) === "string") {
                        $.vvPlugin.load_Dictionary({codetype: dictionary}, buildSelection, param);
                    } else {
                        buildSelection(dictionary, param)
                    }
                    break;

            }
        });


        function buildSelection(codes, param) {
            codes = evalV(codes);
            param.$container.html("").addClass("v-Select mg-t-15");
            $.each(codes, function (idx, ele) {
                if (idx != 0) {
                    param.$container.append("|");
                }
                param.$container.append($("<span>").addClass("label label-dark").text(ele.CODENAME)
                    .attr("data-code", ele.CODE).attr("title", ele.CODEALIAS));
            });
            param.$container.find("span").click(function () {
                var $this = $(this);
                if ($this.hasClass("selected")) {
                    $this.removeClass("selected  label-primary").addClass("label-dark");
                } else {
                    $this.removeClass("label-dark").addClass("selected label-primary");
                }
            });
            if (param.savedVal) {
                var arr = param.savedVal.split("|");
                $.each(arr, function (idx, ele) {
                    param.$container.find("[data-code='" + ele + "']").trigger("click");
                });
            }

        }


        fObject("confirmBtn", baseDiv).click(function () {
            var savingData = {};
            $.each(configData, function (idx, ele) {
                var $container = fObject(ele.field, baseDiv);
                switch (ele.configType) {
                    case "text":
                        savingData[ele.field] = $container.find("input").val();
                        break;
                    case "select":

                    case "multiSelect":
                        var selectStr = "";
                        $container.find(".selected").each(function () {
                            selectStr += $(this).attr("data-code") + "|";
                        });
                        savingData[ele.field] = cutTail(selectStr);
                        break;
                }
            });
            commonAjax("sysmanage/saveDeployConfig.do", {configData: displayObj(savingData)}, function (msg) {
                alertMsgByResponse(msg,null,"更新成功，重启系统后生效");
            })


        });

    });
})();