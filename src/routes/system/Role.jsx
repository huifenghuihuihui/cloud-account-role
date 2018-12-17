/* CREATE BY ZC 2017/12/22 下午1:48:16*/
import React, { PropTypes } from 'react';
import { connect } from 'dva';
import Search from '../../components/System/Role/search';
import List from '../../components/System/Role/list';
import Modal from '../../components/System/Role/modal';

const Role = ({ dispatch, cloudState }) => {
  const {
    id,
    isSuper,
    nodeIdList,
    postCode,
    postName,
    source,
    roleId,
    sourceId,
    tenantId,
    updateUser,
    userCount,
    visible,
    realname,
    gender,
    mobile,
    provinceName,
    cityName,
    districtName,
    address,
    post,
    searchInfo,
    listPagination,
    title,
    checkedStaff,
    authorityTreeData,
    postList,
    orderby,
    modalKey,
    provinceList,
    cityList,
    districtList,
    roleList,
    deleteBtnStatus,
    startBtnStatus,
    blockBtnStatus,
    checkedStaffId,
    checkedStaffStartId,
    checkedStaffBlockId,
    storeid,
    authStores,
    idCard,
    editStoreId,
    status,
    tenantid,
    province,
    city,
    district,
    loading,
  } = cloudState.role;
  // 取得staff页面的button权限
  const staffButton = cloudState.account.buttonPermissions.system.set.role;
  const searchProps = {
    loading,
    searchInfo,
    storeid,
    status,
    orderby,
    checkedStaff,
    deleteBtnStatus, // 删除按钮禁用状态
    startBtnStatus,  // 启用按钮禁用状态
    blockBtnStatus,  // 停用按钮禁用状态
    checkedStaffStartId, // 选中可停用员工id
    checkedStaffBlockId, // 选中可启用员工id
    authorityTreeData,
    checkedStaffId,
    staffButton,
    onAdd() {
      console.log('新增');
      dispatch({
        type: 'role/updateState',
        payload: {
          nodeIdList: [],
          postCode: 1,
          postName: '',
          title: '新增角色',
          userCount: 0,
        },
      });
      dispatch({
        type: 'role/showModal',
      });
    },
    // 停用
    onBlock() {
      const checkedStaffIds = checkedStaffStartId.join(',');
      console.log(checkedStaffIds);
      dispatch({
        type: 'role/enableOrDisable',
        payload: {
          ids: checkedStaffIds,
          status: '0',
        },
      });
      dispatch({
        type: 'role/updateState',
        payload: {
          checkedStaffId: [],
          checkedStaff: [],
          checkedStaffStartId: [], // 选中可停用员工id
          checkedStaffBlockId: [], // 选中可启用员工id
          deleteBtnStatus: true,
          startBtnStatus: true,
          blockBtnStatus: true,
        },
      });
    },
    // 启用
    onStart() {
      const checkedStaffIds = checkedStaffStartId.join(',');
      dispatch({
        type: 'role/enableOrDisable',
        payload: {
          ids: checkedStaffIds,
          status: '1',
        },
      });
      dispatch({
        type: 'role/updateState',
        payload: {
          checkedStaffId: [],
          checkedStaff: [],
          checkedStaffStartId: [], // 选中可停用员工id
          checkedStaffBlockId: [], // 选中可启用员工id
          deleteBtnStatus: true,
          startBtnStatus: true,
          blockBtnStatus: true,

        },
      });
    },
    // 删除
    onDelete() {
      const checkedStaffIds = checkedStaffId.join(',');
      dispatch({
        type: 'role/deleteStaff',
        payload: {
          ids: checkedStaffIds,
        },
      });
      dispatch({
        type: 'role/updateState',
        payload: {
          checkedStaffId: [],
          checkedStaff: [],
          checkedStaffStartId: [], // 选中可停用员工id
          checkedStaffBlockId: [], // 选中可启用员工id
          deleteBtnStatus: true,
          startBtnStatus: true,
          blockBtnStatus: true,
        },
      });
    },
    // 搜索输入
    onSearchItem(event) {
      dispatch({
        type: 'role/updateState',
        payload: {
          searchInfo: event.target.value,
        },
      });
    },
    // 清空搜索条件
    onClearSearch() {
      dispatch({
        type: 'role/updateState',
        payload: {
          searchInfo: '',
        },
      });
    },
    // 搜索按钮
    onSearch() {
      dispatch({
        type: 'role/queryList',
        payload: {
          page: {
            pageno: 1, // 查看第几页内容 默认1
            rowcount: 10, // 一页展示条数 默认10
            orderby: (Object.keys(orderby).length === 0) ? {} : orderby,
          },
          key: searchInfo,
          storeids: storeid,
          status,
        },
      });
    },
    onChangeStatus(event) {
      dispatch({
        type: 'role/queryList',
        payload: {
          page: {
            pageno: 1, // 查看第几页内容 默认1
            rowcount: 10, // 一页展示条数 默认10
            orderby: (Object.keys(orderby).length === 0) ? {} : orderby,
          },
          key: searchInfo,
          storeids: storeid,
          status: event.target.value,
        },
      });
      dispatch({
        type: 'role/updateState',
        payload: {
          status: event.target.value,
        },
      });
    },
  };
  const listProps = {
    listPagination,
    storeid,
    status,
    searchInfo,
    orderby,
    postList,
    roleList,
    nodeIdList,
    checkedStaffId,
    staffButton,
    loading,
    postCode,
    postName,
    onEdit(record) {
      dispatch({
        type: 'role/queryRoles',
      });
      dispatch({
        type: 'role/querySuccess',
        payload: {
          roleId: record.id,
          title: '编辑角色',
          tenantId: record.tenantId,
          postCode: record.postCode,
          postName: record.postName,
          nodeIdList: record.nodeIdList || [],
          postList: Role.postList || [],
          idCard: '',
        },
      });
      dispatch({
        type: 'role/showModal',
      });
    },
    onDelectStaff(idAarray) {
      const checkedStaffIds = []; // 删除后数组
      const checkedArray = []; // 去除后的状态数组
      const startArray = [];      // 启用按钮数组
      const blockArray = [];      //  停用按钮数组
      checkedStaffId.map((item) => {
        if (idAarray.indexOf(item) < 0) {
          checkedStaffIds.push(item);
        }
        return null;
      });
      checkedStaff.map((item) => {
        if (idAarray.indexOf(item.id) < 0) {
          checkedArray.push(item);
        }
        return null;
      });
      const judgeStartArray = checkedArray.filter(item => item.status === 1);
      const judgeBlockArray = checkedArray.filter(item => item.status === 0);
      judgeStartArray.map((item) => {
        startArray.push(item.id);
        return null;
      });
      judgeBlockArray.map((item) => {
        blockArray.push(item.id);
        return null;
      });
      dispatch({
        type: 'role/updateState',
        payload: {
          deleteBtnStatus: !((checkedArray.length > 0)),
          startBtnStatus: (judgeStartArray.length === checkedArray.length),
          blockBtnStatus: (judgeBlockArray.length === checkedArray.length),
          checkedStaff: checkedArray,
          checkedStaffId: checkedStaffIds,
          checkedStaffStartId: startArray, // 选中可停用员工id
          checkedStaffBlockId: blockArray, // 选中可启用员工id
        },
      });
    },
    // 选择员工
    onSelectStaff(selectedRows, record) {
      const checkedArray = [];   // 状态数组
      const checkedStaffIds = [];  // 员工Id
      record.map((item) => {
        checkedArray.push({ id: item.id, status: item.status });
        checkedStaffIds.push(item.id);
        return null;
      });
      dispatch({
        type: 'role/updateState',
        payload: {
          checkedStaff: [...checkedStaff, ...checkedArray],
          checkedStaffId: [...checkedStaffIds, ...checkedStaffId],
        },
      });
      dispatch({
        type: 'role/judgeStatus',
      });
    },
  };
  const modalProps = {
    id,
    isSuper,
    nodeIdList,
    postCode,
    postName,
    source,
    sourceId,
    tenantId,
    updateUser,
    userCount,
    loading,
    maskClosable: false,
    visible,
    title,
    roleId,
    tenantid,
    realname,
    mobile,
    province,
    city,
    district,
    gender,
    provinceName,
    cityName,
    districtName,
    address,
    post,
    storeid,
    authStores,
    idCard,
    postList,
    provinceList,
    cityList,
    districtList,
    authorityTreeData,
    editStoreId,
    key: modalKey,
    onChange(value) {
      dispatch({
        type: 'role/updateState',
        payload: {
          authStores: value,
        },
      });
    },
    onSubmit(value) {
      dispatch({
        type: 'role/editRole',
        payload: {
          id: roleId,
          tenantId: tenantid,
          postName: value.postName,
          postCode: value.postCode,
        },
      });
    },
    onCancel() {
      dispatch({
        type: 'role/updateState',
        payload: {
          visible: false,
        },
      });
    },
    onDistrictChange(selectedKeys, info) {
      console.log('key', selectedKeys);
      dispatch({
        type: 'role/updateState',
        payload: {
          district: selectedKeys,
          districtName: info.props.children,

        },
      });
    },
  };
  return (
    // noinspection JSAnnotator
    <div>
      <Search {...searchProps} />
      <List {...listProps} />
      <Modal {...modalProps} />
    </div>
  );
};
function mapStateToProps(cloudState) {
  return { cloudState };
}

Role.propTypes = {
  dispatch: PropTypes.func,
  cloudState: PropTypes.object,
};
export default connect(mapStateToProps)(Role);
