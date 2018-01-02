package com.wm.service;

import java.util.List;
import java.util.Map;

import com.wm.mapper.entity.VideoComment;
import com.wm.service.base.IBaseService;

public interface VideoCommentService extends IBaseService<VideoComment>{

	public List<VideoComment> queryByPage(Map<String, Object> param);
}