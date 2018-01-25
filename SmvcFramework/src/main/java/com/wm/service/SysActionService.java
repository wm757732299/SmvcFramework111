package com.wm.service;

import com.wm.mapper.entity.SysAction;
import com.wm.service.base.IBaseService;

public interface SysActionService extends IBaseService<SysAction>{

	public void batDelete(String[] ids);

}