package com.wm.mapper.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public class VideoComment implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6246489560376159315L;

	private String id;
	private String topicId;
	private String fromUid;
	private String replyUid;
	private String content;
	private String replyGroup;
	private String replyedId;
	private String vcType;
	private Integer likeCount;
	private Integer dislikeCount;
	private Date createTime;
	private Date timeStamp;
	private int deleteMark;
	
	private List<VideoComment> replyList;

	public VideoComment() {
		this.deleteMark = 0;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTopicId() {
		return topicId;
	}

	public void setTopicId(String topicId) {
		this.topicId = topicId;
	}

	public String getFromUid() {
		return fromUid;
	}

	public void setFromUid(String fromUid) {
		this.fromUid = fromUid;
	}

	public String getReplyUid() {
		return replyUid;
	}

	public void setReplyUid(String replyUid) {
		this.replyUid = replyUid;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getReplyGroup() {
		return replyGroup;
	}

	public void setReplyGroup(String replyGroup) {
		this.replyGroup = replyGroup;
	}

	public String getReplyedId() {
		return replyedId;
	}

	public void setReplyedId(String replyedId) {
		this.replyedId = replyedId;
	}

	public String getVcType() {
		return vcType;
	}

	public void setVcType(String vcType) {
		this.vcType = vcType;
	}

	public Integer getLikeCount() {
		return likeCount;
	}

	public void setLikeCount(Integer likeCount) {
		this.likeCount = likeCount;
	}

	public Integer getDislikeCount() {
		return dislikeCount;
	}

	public void setDislikeCount(Integer dislikeCount) {
		this.dislikeCount = dislikeCount;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(Date timeStamp) {
		this.timeStamp = timeStamp;
	}

	public int getDeleteMark() {
		return deleteMark;
	}

	public void setDeleteMark(int deleteMark) {
		this.deleteMark = deleteMark;
	}

	public List<VideoComment> getReplyList() {
		return replyList;
	}

	public void setReplyList(List<VideoComment> replyList) {
		this.replyList = replyList;
	}

}
