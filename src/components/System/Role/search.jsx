import React, { PropTypes } from 'react';
import { Button, Row, Col, Modal, Tree } from 'antd';
import { filterArray } from '../../../utils/index';

const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;

const search = ({
  choosedCodes, // 已选角色编码
  selectedRoles, // 已选角色数组
  roleButton,
  onAdd, // 新增角色
  onDelete, // 删除
  onChangeStatus, // 启用、停用
}) => {
  // 启用数组
  const selectedRolesOn = selectedRoles.filter(item => item.status === 0);
  const choosedCodesOn = filterArray(selectedRolesOn, 'id');
  // 停用数组
  const selectedRolesOff = selectedRoles.filter(item => item.status === 1);
  const choosedCodesOff = filterArray(selectedRolesOff, 'id');

  // 删除数组
  const selectedRolesDelete = selectedRoles.filter(
    item => item.userCount === 0,
  );
  const choosedCodesDelete = filterArray(selectedRolesDelete, 'id');

  const loopTree = data =>
    data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode
            title={item.storeName}
            key={item.key}
            value={item.key}
            dataRef={item}
          >
            {loopTree(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item.storeName}
          key={item.key}
          value={item.key}
          dataRef={item}
        />
      );
    });
  const showConfirm = (e) => {
    const info = e.target.value;
    let contentTxt;
    if (info === '启用') {
      contentTxt = `当前选中${choosedCodes.length}个角色，可${e.target.value}${
        choosedCodesOn.length
      }个角色！`;
    } else if (info === '停用') {
      contentTxt = `当前选中${choosedCodes.length}个角色，可${e.target.value}${
        choosedCodesOff.length
      }个角色！`;
    } else if (info === '删除') {
      contentTxt = `当前选中${choosedCodes.length}个角色，可${e.target.value}${
        choosedCodesDelete.length
      }个角色！`;
    }
    confirm({
      title: `确定${e.target.value}吗？`,
      content: contentTxt,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        switch (info) {
          case '删除':
            onDelete(choosedCodesDelete);
            break;
          case '启用':
            onChangeStatus('1', choosedCodesOn);
            break;
          case '停用':
            onChangeStatus('0', choosedCodesOff);
            break;
          default:
            break;
        }
      },
      onCancel() {},
    });
  };
  return (
    <div className="search">
      <div className="action-box">
        <Row>
          <Col span={24}>
            {roleButton && roleButton.add && (
              <Button type="primary" onClick={onAdd}>
                + 新增角色
              </Button>
            )}
            {roleButton && roleButton.off && (
              <Button
                onClick={showConfirm}
                value="停用"
                disabled={choosedCodesOff.length <= 0}
              >
                停用
              </Button>
            )}
            {roleButton && roleButton.on && (
              <Button
                onClick={showConfirm}
                value="启用"
                disabled={choosedCodesOn.length <= 0}
              >
                启用
              </Button>
            )}
            {roleButton && roleButton.delete && (
              <Button
                onClick={showConfirm}
                value="删除"
                disabled={choosedCodesDelete.length <= 0}
              >
                删除
              </Button>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};
search.propTypes = {
  choosedCodes: PropTypes.array,
  roleButton: PropTypes.object,
  selectedRoles: PropTypes.array,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onChangeStatus: PropTypes.func,
};

export default search;
