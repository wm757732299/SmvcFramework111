/**
 * @author:WangMingM
 * @date:2018.01
 */
$(function() {
	ActionList.init();
});

var ActionList = function() {
	'use strict';
	var _cols = [];
	
	var _url = basePath + "/sysAction/action_list_data.wmctl";
	var _param=null;
	var _data = null;
	var _loginRoleLevel=null;
	var _zTreeId="ztree";
	var _treeObj=null;
	// =========================定义方法===============================//
	var _searchData = function(url) {
		AjaxRequest.asyncAjax(url,null, function(result) {
			var record = result.data;
			var data = result.data;
			var html="";
			for (var int = 0; int < data.length; int++) {
				html+='<div class="col-md"><button class="btn btn-sm btn-warning btn-droppable zIndex" type="button" data-id="'+data[int].id+'"><span class="btn-droppable-id">'+data[int].actName+'</span></button></div>';
			}
			$('.actionBtnList').append(html);
		});
	};

	var _reLoadData = function(param) {
		AjaxRequest.asyncAjax(_url, param, function(result) {
			var record = result.data;
			_data = DataModel.buildDataModel(_cols, record);
			$('table.datatable').datatable('load', _data);
			PageTool.createPageBar(result.pageInfo);
		});
	};

	var _theAddRoleWindow = null;
	var _addRoleWindow = function() {
		var addHmtl = RoleAdd.initSelect(_loginRoleLevel);
		_theAddRoleWindow = Dialog.dialog({
			backdrop : 'static',
			toggle : 'modal',
			height : '400px',
			width : '700px',
			title : '添加',
			moveable : true,
			custom : function() {
				return addHmtl;
			}
		});
		_theAddRoleWindow.show();
		document.getElementById("saveBtn").onclick=_addSaveData;
	};

	var _theEditRoleWindow = null;
	var _editRoleWindow = function(id) {
		var addHmtl = RoleAdd.initSelect(_loginRoleLevel);//getAddRoleHtml();
		var ediUrl = basePath + '/sysrole/edit_role.wmctl';
		var data ={id:id};
		AjaxRequest.asyncAjaxPost(ediUrl, data, function(result) {
			if (result.success == "true") {
				_theEditRoleWindow = Dialog.dialog({
					backdrop : 'static',
					toggle : 'modal',
					height : '400px',
					width : '700px',
					title : '编辑',
					moveable : true ,
					custom :function() {
						return addHmtl;
					}
				});
				var formData =result.data;
				//==填充数据并展示编辑窗口==//
				_theEditRoleWindow.show({onShow: function() {
					for ( var i in formData) {
						if(document.getElementById(i)){
							if("roleLevel"==i){
								var optArr =document.getElementById(i).options;
								for (var j = 0; j < optArr.length; j++) {
									if(optArr[j].value==formData[i]){
										optArr[j].selected=true;
										document.getElementById(i).disabled="disabled";
									}
								}
							}else{
								document.getElementById(i).value=formData[i];
							}
						}
					}
				}});
				document.getElementById("saveBtn").onclick=_editSaveData;
			}
		});
	};
	
	//==新增保存节点==//
	var _addSaveData = function(){
		var saveUrl="/sysrole/save_role.wmctl";
		_saveData(saveUrl);
	};
	//==编辑保存节点==//
	var _editSaveData = function(){
		var saveUrl="/sysrole/edit_save.wmctl";
		_saveData(saveUrl);
	};
	
	var _saveData = function(urlType) {
		var saveUrl =basePath + (urlType?urlType:"/menu/edit_save.wmctl");
		var formData = $("#IForm").serialize();
		AjaxRequest.asyncAjaxPost(saveUrl, formData, function(result) {
			// 释放按钮
			if (result.success == "true") {
				_reLoadData(_param);
				if(_theAddRoleWindow) _theAddRoleWindow.close();
				if(_theEditRoleWindow) _theEditRoleWindow.close();
			} else {
				alert(result.msg);
			}
		});
	};

	var _batDelBtnListener = function() {
		$('#batDelRole').click(function() {
			var roleIds = "";
			try {
				var myDatatable = $('table.datatable').data('zui.datatable');
				var ids =myDatatable.checks.checks;
				roleIds = ids.join(",");
			} catch (e) {
			//	console.error(e);
			}
			if(roleIds){
				Dialog.delDialog(function() {
					_delData(roleIds);
				});
			}else{
				alert("请选择要操作的数据！");
				return false;
			}
			
		});
	};
	var _delRole = function(id){
		if(id){
			Dialog.delDialog(function() {
				_delData(id);
			});
		}else{
			alert("请选择要操作的数据！");
			return false;
		}
		
	};
	
	var _delData = function(ids) {
		var delData  = {
				roleId : ids
			};
		var delUrl = basePath + "/sysrole/del_role.wmctl";
		AjaxRequest.asyncAjaxPost(delUrl, delData, function(result) {
			if (result.success = "true") {
				Dialog.getDelDialog().close();
				_reLoadData(_param);
			} else {
				alert(result.msg);
			}
		});
	};

	var _resetForm= function(){
		//$('#').reset();
	};
	
	//==授权==//
	var _authorize = function(roleId,roleName){
		var _theAuthorizeWindow = Dialog.dialog({
			backdrop : 'static',
			toggle : 'modal',
			height : '700px',
			width : '80%',
			title : '【'+roleName+'】'+'授权',
			iframe :basePath + '/sysrole/authorize_list.wmctl?roleId='+roleId,
			moveable : true 
		});
		_theAuthorizeWindow.show();
	};
	//==添加权限==//
	var _authority = function(roleId,roleName){
		var _theAuthorityWindow = Dialog.dialog({
			backdrop : 'static',
			toggle : 'modal',
			height : '700px',
			width : '80%',
			title : '【'+roleName+'】'+'权限',
			iframe : basePath + '/sysrole/authority_menu.wmctl?roleId='+roleId,
			moveable : true 
		});
		_theAuthorityWindow.show();
	};
	
	
	var _droppable = function(){
		$('#actionBtn').droppable({
		    selector: '.btn-droppable', // 定义允许拖放的元素
		    target: '.droppable-target',
		    start: function() {
		        $('#actionBtn .droppable-target').removeClass('panel-warning').removeClass('panel-success').find('.panel-heading').text('拖动到这里吗？');
		    },
		    drop: function(event) {
//		        var msg = '真棒！';
//		        $('#actionBtn .droppable-target').removeClass('panel-success').removeClass('panel-warning');
		        if(event.target) {
		        	var url =basePath+"/sysAction/del_action.wmctl";
		        	var id=event.element.data("id");
		        	var data={actionId:id};
		    		AjaxRequest.asyncAjax(url,data, function(result) {
		    			var record = result.data;
		    			var data = result.data;
		    			if(result.success=="true"){
		    				event.element.remove();
		    			}
		    			$.zui.messager.show(result.msg);
		    		});
//		            var elementId = event.element.find('.btn-droppable-id').text();
//		            event.target.addClass('panel-success').find('.panel-heading').text('成功将【按钮#' + elementId + '】拖到目的地。');
//		            msg += '成功拖动【按钮#' + elementId + '】到区域 ' + event.target.find('.area-name').text();
		        }
		       // $.zui.messager.show(msg);
		    },
		    drag: function(event) {
		        $('#actionBtn .droppable-target').removeClass('panel-success').removeClass('panel-warning');
		        if(event.target) event.target.addClass('panel-warning');
		    }
		});
		
	};
	
	// ==获得导航树数据==//
	var _getTree = function() {
		var url = basePath + "/menu/init_menu.wmctl";
		AjaxRequest.asyncAjax(url, null, function(result) {
			if (result.success == "true") {
				var json = result.data;
				_dropdown(json);
			} else {
				alert("导航树获取失败!");
			}
		});
	};
	// ==根据航树数据初始化树对象==//
	var _dropdown = function(arr) {
		console.log(arr);
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].nodeType==1 && arr[i].children !=null){
				
			}
		}
	};
	return {
		init : function() {
			_searchData(_url);
			_droppable();
			_getTree();
		},
		searchData : function() {
			_searchData(_cols, _url);
		},
		reLoadData : function(param) {
			if(typeof param == "number"){//点击搜索
				_param.formParam =  $("#searchForm").serialize();
				_reLoadData(_param);
			}else if(typeof param == "object"){//点击分页
				//点击分页时注入查询条件
				param.formParam =  _param.formParam;
				var pf = param.formParam;
				if(pf!=$("#searchForm").serialize() ){
					if(pf){
//						表单填充
//						var arr =  $("#searchForm").serializeArray();
//						for (var i = 0; i < arr.length; i++) {
//							 arr[i].name;
//							 arr[i].value;
//						}
					}else{
						$('#searchForm')[0].reset();
					}
				} 
				_reLoadData(param);
			}else{
				 return false;
			}
		},
		addRoleWindow : function() {
			_addRoleWindow();
		},
		saveData : function() {
			_saveData();
		},
		editRoleWindow : function(id){
			_editRoleWindow(id);
		},
		delRole : function(id) {
			_delRole(id);
		},
		getTree: function(){
			_getTree();
		}
	}
}();