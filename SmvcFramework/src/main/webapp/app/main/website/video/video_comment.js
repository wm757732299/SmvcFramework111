/**
 * 
 */
'use strict';
$(document)
		.ready(
				function() {

					$("div").on("click", ".comt-reply", function(e) {
						if (this === e.target) {
							var cId = $(this).data("cid");
							$(this).removeClass("comt-reply");
							$(this).addClass("comt-cancel-reply");
							$(this).text("取消回复");
							console.log($(this).text());
							reply(cId);

						}
						// 阻止事件冒泡到父元素
						e.stopPropagation();
					});
					$("div").on("click", ".comt-cancel-reply", function(e) {
						if (this === e.target) {
							var cId = $(this).data("cid");
							$(this).removeClass("comt-cancel-reply");
							$(this).addClass("comt-reply");
							$(this).text("回复");
							cancelReply(cId);
						}
						// 阻止事件冒泡到父元素
						e.stopPropagation();
					});

					$("div").on("click", ".icon-comment-alt", function(e) {
						if (this === e.target) {
							var cId = $(this).data("cid");

							codeEff(1, function() {
							});

						}
						// 阻止事件冒泡到父元素
						e.stopPropagation();
					});

					$("div")
							.on(
									"click",
									".icon-thumbs-o-down",
									function(e) {
										if (this === e.target) {
											var cId = $(this).data("cid");
											var f = cacheData(
													cId,
													"video_comt_thumbs_down_localstorage",
													true);

											$(this).removeClass(
													"icon-thumbs-o-down");
											$(this)
													.addClass(
															"icon-thumbs-down");
											if (f) {
												var span = $(this.children[0]);
												var voteNum = span.text();
												voteNum = Number(voteNum) + 1;
												span.text(voteNum);
												thumbsDown(cId);
											}

										}
										// 阻止事件冒泡到父元素
										e.stopPropagation();
									});

					$("div")
							.on(
									"click",
									".icon-thumbs-down",
									function(e) {
										if (this === e.target) {
											var cId = $(this).data("cid");
											var f = cacheData(
													cId,
													"video_comt_thumbs_down_localstorage",
													false);

											var span = $(this.children[0]);
											var voteNum = span.text();
											voteNum = Number(voteNum) - 1;
											span.text(voteNum);
											$(this).removeClass(
													"icon-thumbs-down");
											$(this).addClass(
													"icon-thumbs-o-down");
											cancelVote(cId);
										}
										e.stopPropagation();
									});

					$("div")
							.on(
									"click",
									".thumbs-up-btn .icon-thumbs-o-up",
									function(e) {
										if (this === e.target) {
											var cId = $(this).data("cid");
											var f = cacheData(
													cId,
													"video_comt_thumbs_up_localstorage",
													true);
											if (f) {
												thumbsUp(cId);
												var span = $(this.children[0]);
												var voteNum = span.text();
												voteNum = Number(voteNum) + 1;
												span.text(voteNum);
											}
											$(this).removeClass(
													"icon-thumbs-o-up");
											$(this).addClass("icon-thumbs-up");
										}
										e.stopPropagation();
									});
					$("div")
							.on(
									"click",
									".thumbs-up-btn .icon-thumbs-up",
									function(e) {
										if (this === e.target) {
											var cId = $(this).data("cid");

											var f = cacheData(
													cId,
													"video_comt_thumbs_up_localstorage",
													false);

											$(this).removeClass(
													"icon-thumbs-up");
											$(this)
													.addClass(
															"icon-thumbs-o-up");

											var span = $(this.children[0]);
											var voteNum = span.text();
											voteNum = Number(voteNum) - 1;
											span.text(voteNum);
											cancelVote(cId);

										}
										e.stopPropagation();
									});

					$("div").on("click", ".icon-ellipsis-h", function(e) {

						clearCache();
					});
				});

// 方法执行效率测试
function codeEff(i, fn, para) {
	var start = new Date().getTime();// 起始时间
	for (var int = 0; int < i; int++) {
		fn(para);
	}
	var end = new Date().getTime();// 接受时间
	console.log("=======代码执行 " + i + "次耗时:" + (end - start) + "毫秒=======");
}

function clearCache() {
	window.localStorage.clear();
}

// 缓存管理 flag:true点赞点踩，false取消赞、踩
// return: false已操作过，true未操作过
function cacheData(cId, sign, flag) {
	// sign : video_comt_thumbs_up_localstorage
	// sign : video_comt_thumbs_down_localstorage
	var myLocalStorage = window.localStorage;
	var localVoteStr = myLocalStorage.getItem(sign);
	var localVoteArr = null;
	var f = true;
	if (localVoteStr) {
		localVoteArr = localVoteStr.split(",");
		if (localVoteArr.length > 100) {
			localVoteArr.shift();
		}
		var index = localVoteArr.lastIndexOf(cId);
		if (index >= 0) {
			f = false;
			if (!flag) {
				localVoteArr.splice(index, 1);
			}
			// else {
			// localVoteArr.push(cId);
			// }
			localVoteStr = localVoteArr.join(",");
			myLocalStorage.setItem(sign, localVoteStr);
		} else {
			if (flag) {
				localVoteArr.push(cId);
			}
			localVoteStr = localVoteArr.join(",");
			myLocalStorage.setItem(sign, localVoteStr);
		}
	} else {
		localVoteArr = [];
		if (flag) {
			localVoteArr.push(cId);
			localVoteStr = localVoteArr.join(",");
			myLocalStorage.setItem(sign, localVoteStr);
		}
	}
	return f;
}

function getComt() {
	var data = {};
	$.ajax({
		type : 'post',
		url : basePath + "/videoComment/web/get_comt.wmctl",
		data : data,
		async : false,
		success : function(result) {
			if (result.success == "true") {
				var d = result.data;
				var h = buildComtModel(d);
				$("#video_comment").append(h);
			} else {
				alert("请登录");
			}
		}
	});
	// $(".icon-thumbs-o-down").click(function(e) {
	//	     
	// console.log(3333);
	// // e.stopPropagation();
	// });
}

function comtHtml(c) {
	var html = '';
	if (c) {
		var cid = c.id;
		html += '<hr style="margin-top: 8px; margin-bottom: 8px;"><a href="###" class="avatar"><img src="'
				+ basePath
				+ '/app/images/deft-head.ico"></a>'
				+ '<div class="content">'
				+ '<div class="pull-right text-muted">'
				+ moment(c.createTime).format("YYYY-MM-DD HH:mm")
				+ '</div>'
				+ '	<div>'
				+ '	<a href="###"><strong>'
				+ '用户名'
				+ '</strong></a>'
				+ '	</div>'
				+ '	<div class="text">'
				+ c.content
				+ '</div>'
				+ '	<div class="actions">'
				+ '	<a class="comt-reply" data-cid='
				+ cid
				+ ' href="javascript:;">回复</a>'
				// + ' <a href="javascript:cancelReply(\''
				// + cid
				// + '\')">取消回复</a>'
				// + ' <button class="btn btn-mini " type="button"
				// onclick="submitReply(\''
				// + cid
				// + '\')">发表评论</button>'
				+ '<div class="pull-right text-muted"><a class="reply-list-btn" href="javascript:;"><i class="icon icon-comment-alt" data-cid='
				+ cid
				+ '>评论</i></a><a class="thumbs-up-btn" href="javascript:;"><i class="icon icon-thumbs-o-up" data-cid='
				+ cid
				+ '>赞<span class="thumbs-up-count">'
				+ c.likeCount
				+ '</span></i></a><a class="thumbs-down-btn" href="javascript:;"><i class="icon icon-thumbs-o-down" data-cid='
				+ cid
				+ '>踩<span class="thumbs-down-count">'
				+ c.dislikeCount
				+ '</span></i></a><a href="javascript:;"><i class="icon icon-ellipsis-h"></i></a></div>'
				+ '	</div>'
				+ '<div id="'
				+ cid
				+ '_div'
				+ '"></div>'
				+ '</div>';
	}
	return html;
}
function replyHtml(r) {
	var html = '';
	if (r) {
		html += '<div class="comment reply">'
				+ '<a href="###" class="avatar">'
				+ '<img style="    height: 30px; width: 30px;" src="'
				+ basePath
				+ '/app/images/deft-head.ico">'
				+ '</a>'
				+ '<div class="content">'
				+ '<div class="pull-right text-muted">'
				+ moment(r.createTime).format("YYYY-MM-DD HH:mm")
				+ '</div>'
				+ '<div>'
				+ '<a href="###"><strong>华师大第一美女</strong></a> <span class="text-muted">回复</span> <a href="###">张士超</a>'
				+ '</div>' + '<div class="text">' + r.content + '</div>'
				+ '<div class="actions">' + '<a href="##">回复</a>' + '</div>'
				+ '	</div>' + '	</div>';
	}

	return html;
}
function buildComtModel(data) {
	var commentsList = '';
	if (data) {
		for (var int = 0; int < data.length; int++) {
			var c = data[int];
			commentsList += comtHtml(c);
			var replys = c.replyList;
			var replyList = '<div id="' + c.id
					+ '_reply_list" class="comments-list">';
			if (replys && replys.length > 0) {
				for (var i = 0; i < replys.length; i++) {
					var re = replys[i];
					replyList += replyHtml(re);
				}
			}
			replyList += '</div>';
			commentsList += replyList;
		}
	}
	return commentsList;
}

function comment() {
	// var url=basePath+"/web/checklogin.wmctl";
	// $.ajax({
	// type : 'post',
	// url : url,
	// data : null,
	// async : false,
	// success : function(result){
	// if(result.success=="true"){
	//				
	// }else{
	// alert("请登录");
	// }
	// }
	// });

	var content = editor.getContent();
	console.log(content);
	var data = {
		topicId : "voidID1111111",
		fromUid : "2e7a8ec1-c39b-11e7-9786-d017c298b1bf",
		replyUid : "",
		content : content,
		replyGroup : "",
		vcType : "PL"
	}
	$.ajax({
		type : 'post',
		url : basePath + "/videoComment/save_comt.wmctl",
		data : data,
		async : false,
		success : function(result) {
			if (result.success == "true") {
				var c = result.data;
				var cc = comtHtml(c);
				cc += '<div id="' + c.id
						+ '_reply_list" class="comments-list"></div>';
				$("#video_comment").prepend(cc);
				editor.execCommand('cleardoc');
			} else {
				alert("请登录");
			}
		}
	});

}

function reply(cId) {
	var ume = cId + "_editor";

	var edi = '<div> <input class="ueditor-reply-btn" type="button" value="发表评论" onclick="submitReply(\''
			+ cId
			+ '\')" style="height:24px;line-height:20px"/><script type="text/plain" id="'
			+ ume + '" style="width: 100%; height: 60px;"></script></div>';
	$("#" + cId + '_div').append(edi);
	UE.getEditor(ume, {
		toolbars : [ [ 'removeformat', 'selectall', 'cleardoc', 'emotion'
//				,'fullscreen' 
				] ],
		wordCount : false
	});
}
function cancelReply(cId) {
	var ume = cId + "_editor";
	UE.getEditor(ume).destroy();
	$("#" + ume).remove();
}
function submitReply(cId) {
	var ume = cId + "_editor";
	var content = UE.getEditor(ume).getContent();
	console.log(content);
	var data = {
		id : cId,
		topicId : "voidID1111111",
		fromUid : "2e7a8ec1-c39b-11e7-9786-d017c298b1bf",
		replyUid : "11ea8ae5-c44c-11e7-a1be-d017c298b1bf",
		content : content,
		replyGroup : cId,
		vcType : "HF"
	}
	$.ajax({
		type : 'post',
		url : basePath + "/videoComment/save_comt.wmctl",
		data : data,
		async : false,
		success : function(result) {
			if (result.success == "true") {
				var re = result.data;
				var rep = cId + '_reply_list';
				var repHtml = replyHtml(re);
				$("#" + rep).prepend(repHtml);
				cancelReply(cId);
			} else {
				alert("请登录");
			}
		}
	});
}

// 点赞
function thumbsUp(cId) {
	$.ajax({
		type : 'get',
		url : basePath + "/videoComment/vote.wmctl",
		data : {
			cId : cId,
			vote : "thumbs_up"
		},
		async : false,
		success : function(result) {
			if (result.success == "true") {

				// if(this === e.target){
				// this.style.backgroundColor = "#00f";
				// }

			} else {
				alert("请登录");
			}
		}
	});
}
// 点踩
function thumbsDown(cId) {
	$.ajax({
		type : 'get',
		url : basePath + "/videoComment/vote.wmctl",
		data : {
			cId : cId,
			vote : "thumbs_down"
		},
		async : false,
		success : function(result) {
			if (result.success == "true") {

			} else {
				alert("请登录");
			}
		}
	});
}

// 取消点赞或点踩
function cancelVote(cId) {
	$.ajax({
		type : 'get',
		url : basePath + "/videoComment/vote.wmctl",
		data : {
			cId : cId,
			vote : "thumbs_up_cancel"
		},
		async : false,
		success : function(result) {
			if (result.success == "true") {

			} else {
				alert("请登录");
			}
		}
	});
}