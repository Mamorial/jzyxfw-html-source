function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 
function initGridSelectRowStyle(treeidobj){
	$(treeidobj).find("tbody tr").each(function (i,n){
		$(n).attr("highlight","0");
		$(n).hover(function (){
			if($(n).attr("highlight")==0)
				$(n).css({"background-color":"rgba(123,23,31,0.1)"});
		},function (){
			if($(n).attr("highlight")==0)
				$(n).css({"background-color":"rgba(123,23,31,0)"});
		}).click(function (){
			$(n).attr("highlight","1");
			$(n).siblings().attr("highlight","0");
			$(n).siblings().css({"background-color":"rgba(123,23,31,0)"});
			$(n).css({"background-color":"rgba(123,23,31,0.2)"});
		});
	});
}