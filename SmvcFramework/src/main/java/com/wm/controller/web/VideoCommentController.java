package com.wm.controller.web;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.wm.controller.base.BaseController;
import com.wm.mapper.entity.VideoComment;
import com.wm.mapper.entity.VideoCommentVote;
import com.wm.service.VideoCommentService;
import com.wm.service.VideoCommentVoteService;

@Controller
@RequestMapping(value = "/videoComment")
public class VideoCommentController extends BaseController<VideoComment> {

	private static final Logger LOGGER = Logger
			.getLogger(VideoCommentController.class);

	@Resource(type = VideoCommentService.class)
	private VideoCommentService videoCommentService;

	@Resource(type = VideoCommentVoteService.class)
	private VideoCommentVoteService videoCommentVoteService;

	@ResponseBody
	@RequestMapping(value = "/save_comt", method = { RequestMethod.POST,
			RequestMethod.GET })
	public Map<String, Object> saveComt(VideoComment vc) {
		Map<String, Object> result = new HashMap<String, Object>();
		// 评论时切换帐号问题
		try {
			if ("PL".equals(vc.getVcType())) {// HF:回复,PL评论

				vc.setFromUid(getLoginUserId());
				// vc.setReplyGroup(vc.getTopicId()+getLoginUserId());
				vc.setLikeCount(0);
				vc.setDislikeCount(0);
				vc.setCreateTime(new Date());
				vc.setTimeStamp(new Date());
				videoCommentService.insert(vc);
			}
			if ("HF".equals(vc.getVcType())) {

				vc.setReplyUid(getLoginUserId());
				vc.setReplyGroup(vc.getId());
			//	vc.setReplyedId(vc.getId());
				vc.setLikeCount(0);
				vc.setDislikeCount(0);
				vc.setCreateTime(new Date());
				vc.setTimeStamp(new Date());
				videoCommentService.insert(vc);
			}

			result.put("success", "true");
			result.put("msg", "请求成功");
			result.put("data", vc);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("success", "false");
			result.put("msg", "请求失败");
		}
		return result;
	}

	@ResponseBody
	@RequestMapping(value = "/web/get_comt", method = { RequestMethod.POST,
			RequestMethod.GET })
	public Map<String, Object> getComt(HttpServletResponse response,
			HttpServletRequest request) {
		Map<String, Object> result = new HashMap<String, Object>();

		VideoComment vc = new VideoComment();
		vc.setTopicId("voidID1111111");
		vc.setVcType("PL");
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("topicId", "voidID1111111");
		param.put("vcType", "PL");
		param.put("curPage", 1);
		param.put("pageSize", 10);
		param.put("deleteMark", 0);
		List<VideoComment> vcs = videoCommentService.queryByPage(param);

		param.put("vcType", "HF");
		param.put("curPage", 1);
		param.put("pageSize", 10);
		for (VideoComment videoComment : vcs) {
			param.put("replyGroup", videoComment.getId());
			videoComment.setReplyList(videoCommentService.queryByPage(param));
		}
		try {
			result.put("success", "true");
			result.put("msg", "请求成功");
			result.put("data", vcs);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("success", "false");
			result.put("msg", "请求失败");
		}
		return result;
	}

	@ResponseBody
	@RequestMapping(value = "/vote", method = { RequestMethod.POST,
			RequestMethod.GET })
	public Map<String, Object> vote(HttpServletResponse response,
			HttpServletRequest request) {
		Map<String, Object> result = new HashMap<String, Object>();

		try {
			String cId = request.getParameter("cId");
			String vote = request.getParameter("vote");
			VideoCommentVote vcv = new VideoCommentVote();
			vcv.setTopicId(cId);
			vcv.setFromUid(getLoginUserId());
			if ("thumbs_up".equals(vote)) {
				vcv.setVote(1);
				videoCommentVoteService.updateOrInsert(vcv);
			} else if ("thumbs_down".equals(vote)) {
				vcv.setVote(-1);
				videoCommentVoteService.updateOrInsert(vcv);
			} else if ("thumbs_up_cancel".equals(vote)
					|| "thumbs_down_cancel".equals(vote)) {
				vcv.setVote(0);
				videoCommentVoteService.cancelVote(vcv);
			}
			result.put("success", "true");
			result.put("msg", "请求成功");
			result.put("data", "");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("success", "false");
			result.put("msg", "请求失败");
		}
		return result;
	}
}
