package com.wm.mapper.base;

import java.util.List;
import java.util.Map;


//import com.dfratings.utils.PageInfoUtil;

/**
 * Mapepr公共接口
 * @version 1.0
 * @author WangMingM
 * @date 2017.10.27
 *
 */
public interface IBaseMapper<T> {
	
	
	public long insert (T t);
	
	public long deleteTrueByKey (String id);
	
	public long deleteFalseByKey (String id);
	
	public long update (T t);
	
	public T queryByKey (String id);
	
	public List<T> queryByCondition (T t);
	
	public List<T> queryByPage (Map<String, Object> t);
	
//	/**
//	 * 分页查询
//	 * 
//	 * @param page
//	 * @return
//	 */
//	public List<?> search(PageInfoUtil page);
//
//	/**
//	 * 获取数据总数
//	 * 
//	 * @param page
//	 * @return
//	 */
//	public long searchCount(PageInfoUtil page);
//
//	/**
//	 * 删除
//	 * 
//	 * @param params
//	 * @return
//	 */
//	public long delete(Map<String, Object> params);
//
//	/**
//	 * 保存数据
//	 * 
//	 * @param obj
//	 * @return
//	 */
//	public long saveData(Object obj);
}
