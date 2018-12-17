import React, { PropTypes } from 'react';
import { Table, Row, Col, Badge } from 'antd';
import { codeToString, codeToArray } from '../../../utils/index';

const list = ({
  // code,
  choosedCodes,
  dataList,
  loading,
  pagination,
  roleButton,
  onEdit,
  onSelectRoles,
  onPageChange,
  onDeleteRoles,
}) => {
  const disabled = roleButton && roleButton.edit;
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'postName',
      key: 'postName',
    },
    {
      title: '所含员工数',
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        const badgeProps = {
          status: text === 1 ? 'success' : 'default',
          text: text === 1 ? '正常' : '停用',
        };
        return <Badge {...badgeProps} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => (
        <span>
          {disabled && (
            <button className="btn-link" onClick={() => onEdit(record)}>
              编辑
            </button>
          )}
          {!disabled && <span>编辑</span>}
        </span>
      ),
    },
  ];
  const rowSelection = {
    selectedRowKeys: choosedCodes,
    type: 'checkbox',
    onSelect: (record, selected) => {
      if (!selected) {
        onDeleteRoles(record.id);
      } else {
        const dataArray = [];
        dataArray.push(record);
        const rolesParam = {
          selectedCodes: codeToArray(dataArray, 'id'),
          selectedRoles: dataArray,
        };
        onSelectRoles(rolesParam);
      }
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      const changeRowsIds = [];
      changeRows.map((item) => {
        changeRowsIds.push(item.id);
        return null;
      });
      if (!selected) {
        onDeleteRoles(codeToString(changeRows, 'id'));
      } else {
        const rolesParam = {
          selectedCodes: codeToArray(changeRows, 'id'),
          selectedRoles: changeRows,
        };
        onSelectRoles(rolesParam);
      }
    },
    getCheckboxProps: record => ({
      disabled: record.isSuper === 1,
    }),
  };
  return (
    <div>
      <Row gutter={16} className="list">
        <Col span={24}>
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataList}
            pagination={pagination}
            bordered
            rowSelection={rowSelection}
            rowKey={record => record.id}
            onChange={onPageChange}
          />
        </Col>
      </Row>
    </div>
  );
};
list.propTypes = {
  loading: PropTypes.bool,
  dataList: PropTypes.array,
  choosedCodes: PropTypes.array,
  pagination: PropTypes.object,
  roleButton: PropTypes.object,
  onEdit: PropTypes.func,
  onPageChange: PropTypes.func,
  onSelectRoles: PropTypes.func,
  onDeleteRoles: PropTypes.func,
  // code: PropTypes.number,
};

export default list;
