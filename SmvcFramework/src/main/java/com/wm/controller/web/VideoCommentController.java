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
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.wm.controller.base.BaseController;
import com.wm.mapper.entity.VideoComment;
import com.wm.mapper.entity.VideoCommentVote;
import com.wm.model.LoginUserDetails;
import com.wm.service.VideoCommentService;
import com.wm.service.VideoCommentVoteService;
import com.wm.util.CommentVoteQueue;

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
			
			LoginUserDetails loginer = getLoginUser();
			
			if ("PL".equals(vc.getVcType())) {// HF:回复,PL评论

				//冗余评论人信息
				vc.setComtUname(loginer.getuName());
				vc.setComtUpic(loginer.getuPhoto());
				
				vc.setFromUid(loginer.getId());
				// vc.setReplyGroup(vc.getTopicId()+getLoginUserId());
				vc.setLikeCount(0);
				vc.setDislikeCount(0);
				vc.setCreateTime(new Date());
				vc.setTimeStamp(new Date());
				videoCommentService.insert(vc);
			}
			if ("HF".equals(vc.getVcType())) {
				
				//冗余回复人信息
				vc.setComtUname(loginer.getuName());
				vc.setComtUpic(loginer.getuPhoto());
				
				vc.setReplyUid(loginer.getId());
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

	/**
	 * 点赞点踩或取消
	 * @param response
	 * @param request
	 * @return
	 */
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
			
			CommentVoteQueue.instance().getQueue().offer(cId);
			
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
	
	
	@ResponseBody
	@RequestMapping(value = "/video_comt_list", method = { RequestMethod.POST,
			RequestMethod.GET })
	public ModelAndView videoComtList(HttpServletResponse response,
			HttpServletRequest request, Model model) {
		Map<String, Object> result = new HashMap<String, Object>();
		try {
			result.put("success", "true");
			result.put("msg", "请求成功");
			result.put("data", "");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("success", "false");
			result.put("msg", "请求失败");
		}
		return new ModelAndView("main/admin/comment/video_comt_list", result);
	}
	
	@ResponseBody
	@RequestMapping(value = "/vc_list_data", method = { RequestMethod.POST,
			RequestMethod.GET })
	public Map<String, Object> videoComtListData(
			@RequestParam("curPage") int curPage,
			@RequestParam("pageSize") int pageSize, HttpServletRequest request) {

		Map<String, Object> result = new HashMap<String, Object>();

		try {
			Map<String, Object> param = getFormParam(request);
			param.put("curPage", curPage);
			param.put("pageSize", pageSize);
			param.put("vcType", "PL");
			List<VideoComment> data = videoCommentService.queryByPage(param);
			Map<String, Object> pageInfo = getPageInfo(data);
			result.put("success", "true");
			result.put("msg", "请求成功");
			result.put("data", data);
			result.put("param", param);
			result.put("pageInfo", pageInfo);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("success", "false");
			result.put("msg", "请求失败");
		}
		return result;

	}
	
	@ResponseBody
	@RequestMapping(value = "/del_comt", method = { RequestMethod.POST,
			RequestMethod.GET })
	public Map<String, Object> delComt(@RequestParam("cId") String cId) {
		Map<String, Object> result = new HashMap<String, Object>();
		try {
			// 不再事务内需改进
			String[] ids = cId.split(",");
			if(ids.length>0){
				videoCommentService.batDelete(ids);
				result.put("success", "true");
				result.put("msg", "删除成功");
				result.put("data", "");
			}else{
				result.put("success", "false");
				result.put("msg", "删除失败");
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.put("success", "false");
			result.put("msg", "删除失败");
		}
		return result;
	}
}
