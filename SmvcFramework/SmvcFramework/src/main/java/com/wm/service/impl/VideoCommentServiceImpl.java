package com.wm.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.pagehelper.PageHelper;
import com.wm.annotation.DataSourceChoose;
import com.wm.annotation.DataSourceChoose.SourceKey;
import com.wm.mapper.VideoCommentMapper;
import com.wm.mapper.entity.VideoComment;
import com.wm.service.VideoCommentService;

@Service("videoCommentService")
@DataSourceChoose(sourceKey = SourceKey.DSK2)
@Transactional(timeout = 60)
public class VideoCommentServiceImpl implements VideoCommentService {

	@Resource(type = VideoCommentMapper.class)
	private VideoCommentMapper videoCommentMapper;

	public long insert(VideoComment t) {
		return videoCommentMapper.insert(t);
	}

	public long delete(VideoComment t) {
		return videoCommentMapper.deleteTrueByKey(t.getId());
	}

	public long update(VideoComment t) {
		return videoCommentMapper.update(t);
	}

	public VideoComment queryByKey(String id) {
		return videoCommentMapper.queryByKey(id);
	}

	public List<VideoComment> queryByCondition(VideoComment t) {
		return videoCommentMapper.queryByCondition(t);
	}

	public List<VideoComment> queryByPage(VideoComment t) {
		return null;
	}

	public List<VideoComment> queryByPage(Map<String, Object> param) {
		PageHelper.startPage((Integer)param.get("curPage"), (Integer)param.get("pageSize"));
		return  videoCommentMapper.queryByPage(param);
	}
}