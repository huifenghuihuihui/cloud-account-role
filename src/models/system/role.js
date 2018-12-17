/* CREATE BY YBY 2017/12/22 下午1:48:16*/
import { parse } from 'qs';
import { message } from 'antd';
import {
  inquireRole,
  enable,
  removeRole,
  createRole,
  inquireTree,
  inquireCode,
} from '../../services/system/role';
import { getSession } from '../../utils/index';

export default {
  namespace: 'role',
  state: {
    list: [],
    loading: false,
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    modalKey: null,
    modalError: false,
    modalErrorValue: null,
    searchWord: null,
    choosedCodes: [],
    selectedRoles: [],
    treeData: [],
    nodeIdList: [],
    // 当前用户权重
    code: null,
    treeOption: {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
    },
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      pageSizeOptions: ['10', '20', '50', '100'],
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/system/set/role') {
          // 取得是否登录变量
          const isLogin = getSession('isLogin');
          // 请求相关信息
          if (isLogin && isLogin === 'yes') {
            // 初始请求权限列表
            dispatch({
              type: 'queryList',
              payload: {
                pageno: 1,
                rowcount: 10,
              },
            });
            // 请求权限树
            dispatch({
              type: 'queryTree',
              payload: {},
            });
            // 设置是否是个人中心，用来控制左侧菜单
            dispatch({
              type: 'account/updateState',
              payload: {
                isPersonal: false,
              },
            });
            // 请求权重
            dispatch({
              type: 'queryCode',
            });
          }
        }
      });
    },
  },
  effects: {
    // 获取列表
    * queryList({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      const paginationOld = yield select(state => state.role.pagination);
      const res = yield call(inquireRole, parse(payload));
      const { data, code, page } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data || [],
            pagination: {
              ...paginationOld,
              total: page.total || 0,
              current: page.pageno || 1,
              pageSize: page.rowcount || '10',
            },
          },
        });
      }
      yield put({ type: 'hideLoading' });
    },
    // 获取权限树列表
    * queryTree({ payload }, { call, put }) {
      const res = yield call(inquireTree, parse(payload));
      const { data, code } = res.data;
      if (code === '200') {
        yield put({
          type: 'updateState',
          payload: {
            treeData: data || [],
          },
        });
      }
    },
    // 删除员工
    * delete({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const delArr = payload.ids.split(',');
      const pagination = yield select(state => state.role.pagination);
      const { total, pageSize, current } = yield select(
        state => state.role.pagination,
      );
      const res = yield call(removeRole, parse(payload));
      const { code } = res.data;
      if (code === '200') {
        message.success('删除成功');
        if (
          (total - delArr.length) % pageSize === 0 &&
          (total - delArr.length) / pageSize <= current &&
          current > 1
        ) {
          yield put({
            type: 'updateState',
            payload: {
              pagination: {
                ...pagination,
                current: current - 1,
              },
            },
          });
        }
        yield put({ type: 'reload' });
      }
      yield put({ type: 'hideLoading' });
    },
    // 启用停用
    * onOff({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const res = yield call(enable, parse(payload));
      const { code } = res.data;
      if (code === '200') {
        if (payload.status === '1') {
          message.success('启用成功');
        } else if (payload.status === '0') {
          message.success('停用成功');
        }
        yield put({ type: 'reload' });
      }
      yield put({ type: 'hideLoading' });
    },
    // 新增编辑
    * add({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const res = yield call(createRole, payload);
      const { code, msg } = res.data;
      if (code === '200') {
        message.success('保存成功');
        yield put({ type: 'hideModal' });
        yield put({ type: 'reload' });
        yield put({
          type: 'querySuccess',
          payload: {
            modalError: false,
            modalErrorValue: null,
          },
        });
      } else if (msg) {
        yield put({
          type: 'querySuccess',
          payload: {
            modalError: true,
            modalErrorValue: msg,
          },
        });
      }
      yield put({ type: 'hideLoading' });
    },
    // 重新加载
    * reload(action, { put, select }) {
      const roleData = yield select(state => state.role);
      // 清空选择
      yield put({
        type: 'updateState',
        payload: {
          choosedCodes: [],
          selectedRoles: [],
        },
      });
      // 重新请求列表
      yield put({
        type: 'queryList',
        payload: {
          pageno: roleData.pagination.current,
          rowcount: roleData.pagination.pageSize,
        },
      });
    },
    // 查询权重
    * queryCode({ payload }, { call, put }) {
      const res = yield call(inquireCode);
      const { code, data } = res.data;
      if (data && code === '200') {
        yield put({
          type: 'updateState',
          payload: {
            code: data,
          },
        });
      }
    },
  },
  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    showModal(state, action) {
      return {
        ...state,
        ...action.payload,
        modalVisible: true,
        modalKey: Date.parse(new Date()) / 1000,
      };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
    querySuccess(state, action) {
      return { ...state, ...action.payload, loading: false };
    },
    updateState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
