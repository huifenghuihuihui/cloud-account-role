/* CREATE BY ZC 2017/12/22 下午1:48:16*/
import React, { PropTypes } from 'react';
import { connect } from 'dva';
import Search from '../../components/System/Role/search';
import List from '../../components/System/Role/list';
import Modal from '../../components/System/Role/modal';
import { deleteArray, deleteCodes } from '../../utils/index';

const Role = ({ dispatch, cloudState }) => {
  const {
    loading,
    list,
    nodeIdList,
    choosedCodes,
    selectedRoles,
    pagination,
    currentItem,
    modalVisible,
    modalType,
    modalError,
    modalErrorValue,
    treeData,
    treeOption,
    code,
  } = cloudState.role;
  // 取得role页面的button权限
  const roleButton = cloudState.account.buttonPermissions.system.set.role;
  const searchProps = {
    choosedCodes,
    selectedRoles,
    roleButton,
    // 新增角色
    onAdd() {
      // 打开弹窗
      dispatch({
        type: 'role/showModal',
        payload: {
          modalType: 'create',
        },
      });
      // loading设为false
      dispatch({
        type: 'role/hideLoading',
      });
      // 新增时清空已选权限
      dispatch({
        type: 'role/updateState',
        payload: {
          treeOption: {
            ...treeOption,
            checkedKeys: [],
          },
        },
      });
    },
    // 启用、停用
    onChangeStatus(status, array) {
      dispatch({
        type: 'role/onOff',
        payload: {
          ids: array.join(','),
          status,
        },
      });
    },
    // 删除
    onDelete(param) {
      dispatch({
        type: 'role/delete',
        payload: {
          ids: param.join(','),
        },
      });
    },
  };
  const listProps = {
    loading,
    dataList: list,
    choosedCodes,
    code,
    selectedRoles,
    pagination,
    roleButton,
    // 分页
    onPageChange(page) {
      const currPage = page.pageSize === pagination.pageSize ? page.current : 1;
      dispatch({
        type: 'role/queryList',
        payload: {
          pageno: currPage,
          rowcount: page.pageSize,
        },
      });
    },
    // 编辑
    onEdit(item) {
      dispatch({
        type: 'role/showModal',
      });
      dispatch({
        type: 'role/updateState',
        payload: {
          modalType: 'update',
          currentItem: item,
          nodeIdList: item.nodeIdList,
          treeOption: {
            ...treeOption,
            checkedKeys: item.nodeIdList,
          },
        },
      });
    },
    // 勾选
    onSelectRoles(data) {
      let codeArray = [];
      if (choosedCodes) {
        codeArray = [...choosedCodes, ...data.selectedCodes];
      } else {
        codeArray = data.selectedCodes;
      }
      dispatch({
        type: 'role/updateState',
        payload: {
          selectedRoles: [...selectedRoles, ...data.selectedRoles],
          choosedCodes: codeArray,
        },
      });
    },
    // 取消勾选
    onDeleteRoles(codes) {
      dispatch({
        type: 'role/updateState',
        payload: {
          selectedRoles: deleteArray(selectedRoles, codes, 'id'),
          choosedCodes: deleteCodes(choosedCodes, codes),
        },
      });
    },
  };
  const modalProps = {
    postArray: cloudState.account.postArray,
    loading,
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    title: modalType === 'create' ? '新增角色' : '编辑角色',
    visible: modalVisible,
    modalErr: modalError,
    modalErrValue: modalErrorValue,
    treeData,
    treeOption,
    nodeIdList,
    code,
    // 弹窗确认
    onOk(data) {
      const param = data;
      param.nodeIdList = nodeIdList;
      dispatch({
        type: 'role/add',
        payload: param,
      });
    },
    // 弹窗取消
    onCancel() {
      dispatch({
        type: 'role/hideModal',
      });
      dispatch({
        type: 'role/updateState',
        payload: {
          modalError: false,
          modalErrorValue: null,
        },
      });
    },
    // 勾选权限
    onCheck(val, event) {
      if (val.includes('sa01')) {
        val.splice(-1, 0, 'sa03', 'sa06');
      }
      if (val.includes('sa02')) {
        val.splice(-1, 0, 'sa04');
      }
      dispatch({
        type: 'role/updateState',
        payload: {
          nodeIdList: val.concat(event.halfCheckedKeys),
          treeOption: {
            ...treeOption,
            checkedKeys: val,
          },
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
