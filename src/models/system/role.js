/* CREATE BY ZC 2017/12/22 下午1:48:16*/
import { parse } from 'qs';
import { message } from 'antd';
import { queryPosts, savePost, queryRoles, queryPostCode, updateStatus } from '../../services/system/role';
import { getSession } from '../../utils/index';

export default {
  namespace: 'role',
  state: {
    id: null,
    isSuper: null,
    nodeIdList: [],
    postCode: null,
    dataCode: '',
    postName: null,
    source: null,
    sourceId: null,
    tenantId: null,
    updateUser: null,
    userCount: 0,
    loading: false,
    staffId: null,      // 员工Id
    storeid: null,      // 隶属机构
    editStoreId: null,  // 编辑机构Id
    tenantid: null,     // 商户ID
    title: null,        // 模态框头
    realname: null,     // 姓名
    gender: 1,       // 性别
    authStores: [],     // 机构id
    idCard: null,       // 身份证号
    provinceName: null, // 省名称
    cityName: null,     // 市名称
    districtName: null, // 地区名称
    address: null,      // 详细地址
    mobile: null,       // 手机账户
    post: null,         // 岗位
    checkedStaff: [],   // 选中员工
    checkedStaffId: [], // 选中员工id
    checkedStaffStartId: [], // 选中可停用员工id
    checkedStaffBlockId: [], // 选中可启用员工id
    searchInfo: '', // 搜索信息
    visible: false,   // 模态框显示
    province: null,   // 省
    city: null,       // 城市
    district: null,   // 区县
    deleteBtnStatus: true, // 删除按钮禁用状态
    startBtnStatus: true,  // 启用按钮禁用状态
    blockBtnStatus: true,  // 停用按钮禁用状态
    status: '',     // 状态
    provinceList: [], // 省列表
    cityList: [],     // 城市列表
    districtList: [], // 区县列表
    modalKey: null,   // 模态框组件唯一key
    authorityTreeData: [], // 机构数据
    postList: [], // 岗位列表
    roleList: [], // 员工信息列表
    orderby: {},   // 排序
    listPagination: {
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
            dispatch({
              type: 'queryList',
              payload: {
                page: {
                  pageno: 1, // 查看第几页内容 默认1
                  rowcount: 10, // 一页展示条数 默认10
                  orderby: {},
                },
                key: null,
                storeids: null,
                status: '',
              },
            });
            dispatch({
              type: 'queryRoles',
              payload: {
              },
            });
            dispatch({
              type: 'queryPostCode',
              payload: {
              },
            });
            dispatch({ // 设置是否是个人中心，用来控制左侧菜单
              type: 'account/updateState',
              payload: {
                isPersonal: false,
              },
            });
          }
        }
      });
    },
  },
  effects: {
    // 获取列表
    * queryList({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const oldPage = yield select(state => state.role.listPagination);
      const res = yield call(queryPosts, parse(payload));
      const { data, code, page } = res.data;
      if (code === '200') {
        console.log(data);
        yield put({
          type: 'querySuccess',
          payload: {
            roleList: data || [],
            listPagination: {
              ...oldPage,
              total: page ? page.total : 0,
              current: page ? page.pageno : 1,
              pageSize: page ? page.rowcount : '10',
            },
          },
        });
      }
      yield put({ type: 'hideLoading' });
    },
    // 获取岗位列表
    * queryRoles({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const res = yield call(queryRoles);
      const { data, code } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            postList: data || [],
          },
        });
      }
      yield put({ type: 'hideLoading' });
    },
    // 获取岗位列表
    * queryPostCode({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const res = yield call(queryPostCode);
      const { data, code } = res.data;
      if (code === '200') {
        yield put({
          type: 'querySuccess',
          payload: {
            dataCode: data || '',
          },
        });
      }
      yield put({ type: 'hideLoading' });
    },
    // 启用停用
    * enableOrDisable({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const res = yield call(updateStatus, parse(payload));
      const { code } = res.data;
      if (code === '200') {
        message.success('操作成功');
        yield put({ type: 'reload' });
      }
      yield put({ type: 'hideLoading' });
    },
    // 编辑
    * editRole({ payload }, { call, put }) {
      const res = yield call(savePost, parse(payload));
      const { code } = res.data;
      if (code === '200') {
        message.success('编辑成功');
        yield put({
          type: 'queryList',
        });
        yield put({
          type: 'hideModal',
        });
      }
      yield put({ type: 'hideLoading' });
    },
    // 重载页面
    * reload({ payload }, { put, select }) {
      const staff = yield select(state => state.role);
      yield put({
        type: 'queryList',
        payload: {
          page: {
            pageno: staff.listPagination.current, // 查看第几页内容 默认1
            rowcount: staff.listPagination.pageSize, // 一页展示条数 默认10
            orderby: (Object.keys(staff.orderby).length === 0) ? {} :
              staff.orderby,
          },
          key: staff.searchInfo,
          storeids: staff.storeid,
          status: staff.status,
        },
      });
    },
    // 判断状态
    * judgeStatus({ payload }, { put, select }) {
      const { checkedStaff } = yield select(state => state.role);
      const startArray = [];      // 启用按钮数组
      const blockArray = [];      //  停用按钮数组
      const judgeStartArray = checkedStaff.filter(item => item.status === 1);
      const judgeBlockArray = checkedStaff.filter(item => item.status === 0);
      judgeStartArray.map((item) => {
        startArray.push(item.id);
        return false;
      });
      judgeBlockArray.map((item) => {
        blockArray.push(item.id);
        return false;
      });
      yield put({
        type: 'updateState',
        payload: {
          deleteBtnStatus: !((checkedStaff.length > 0)),
          startBtnStatus: (judgeStartArray.length === checkedStaff.length),
          blockBtnStatus: (judgeBlockArray.length === checkedStaff.length),
          checkedStaffStartId: startArray, // 选中可停用员工id
          checkedStaffBlockId: blockArray, // 选中可启用员工id
        },
      });
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
        visible: true,
        modalKey: Date.parse(new Date()) / 1000,
      };
    },
    querySuccess(state, action) {
      return { ...state, ...action.payload, loading: false };
    },
    updateState(state, action) {
      return { ...state, ...action.payload };
    },
    hideModal(state) {
      return { ...state, visible: false };
    },
  },
};
