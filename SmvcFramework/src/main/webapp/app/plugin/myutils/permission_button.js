/* ========================================================================
 * @author:WangMingM
 * ========================================================================
 *  行为控制      2018.01.26
 * ======================================================================== */
//全局变量：（MMP哟，非得逼老子用全局，后期优化. WangMingM :2018.01.26）
 window.$permissionAction=null;

var PermissionBtn = function() {
	'use strict';
	var _action = top.window.$permissionAction;
	var _build = function(o,menuId) {
		var html = "";
		if(o instanceof Array){
			var curbtn = null;
			for (var i = 0; i < o.length; i++) {
				var btn = o[i];
				var isin =false;
					if(_action==true){
					//内置管理员无限制
						isin=true;
					}else{
						isin=_action.some(function(b){
							if(menuId == b.menuId && b.actName ==btn.actName){
								curbtn=b;
								return true;
							}
							return false;
						});
					}
				if (isin) {
					html += '<button'
						+(btn.name?' name ="' + btn.name + '"':'')
						+(' class ="'+ (btn.clazz ? btn.clazz :'btn')+'"')
						+(btn.onclick?' onclick="javascript:'+btn.onclick+'"':'')
						+(curbtn?' data-btnid="'+curbtn.id+'"':'')
						+(btn.bstyle?' style="'+btn.bstyle+'"':'')
						+'>'
						+'<i'
						+(btn.icon?' class="'+btn.icon+'"':'')
						+(btn.istyle?' style="'+btn.istyle+'"':'')
						+'>'
						+btn.actName
						+'</i>'
						+'</button>';
				}
			}
		}
		return html;
	};

	var _b = function(btn){
				var curbtn = null;
		var isin =_action.some(function(b){
		if(b.id=="4444433" && b.actName ==btn.actName){
			curbtn=b;
			return true;
		}
		return false;
	});
	
	if (isin) {
		html = '<button'
			+(btn.name?' name ="' + btn.name + '"':'')
			+(' class ="'+ (btn.clazz ? btn.clazz :'btn')+'"')
			+(btn.onclick?' onclick="javascript:'+btn.onclick+'"':'')
			+(curbtn.id?' data-btnid="'+curbtn.id+'"':'')
			+'>'
			+(btn.icon?'<i class="'+btn.icon+'"></i>':'') 
			+btn.actName
			+'</button>';
	}
		};
	return {
		init : function(str) {
			$permissionAction = eval('(' + str + ')');
		},
		build : function(btn,menuId) {
			return _build(btn,menuId);
		}
	}
}();