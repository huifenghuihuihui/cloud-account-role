import React, { PropTypes } from 'react';
import { Table, Row, Col, Badge } from 'antd';

const list = ({
   loading,
   staffButton,
   roleList,
   checkedStaffId,
   onEdit,
   onSelectStaff,
   listPagination,
   onChangeSorter,
   onDelectStaff,
  }) => {
  const disabled = staffButton && staffButton.edit;
  const columns = [{
    title: '角色名称',
    dataIndex: 'postName',
    key: 'postName',
  }, {
    title: '所含员工数',
    dataIndex: 'userCount',
    key: 'userCount',
    render: text => (text ? `${text}` : '无'),
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      const badgeProps = {
        status: text === 1 ? 'success' : 'default',
        text: text === 1 ? '正常' : '停用',
      };
      return (<Badge {...badgeProps} />);
    },
  }, {
    title: '操作',
    dataIndex: 'option',
    key: 'option',
    render: (text, record) => (
      <span>
        { disabled && <button className="btn-link" onClick={() => onEdit(record)}>编辑</button> }
        { !disabled && <span>编辑</span> }
      </span>
    ),
  }];
  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      console.log('选中');
      if (!selected) {
        onDelectStaff([record.id]);
      } else {
        onSelectStaff(selectedRows, [{ id: record.id, status: record.status }]);
      }
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log('quan选中');
      const changeRowsIds = [];
      changeRows.map((item) => {
        changeRowsIds.push(item.id);
        return null;
      });
      if (!selected) {
        onDelectStaff(changeRowsIds);
      } else {
        onSelectStaff(selectedRows, changeRows);
      }
    },
    selectedRowKeys: checkedStaffId,
  };
  return (<div>
    <Row gutter={16}>
      <Col span={24}>
        <Table
          loading={loading}
          columns={columns}
          dataSource={roleList}
          pagination={listPagination}
          bordered
          rowSelection={rowSelection}
          rowKey={record => record.id}
          onChange={onChangeSorter}
        />
      </Col>
    </Row>
  </div>);
};
list.propTypes = {
  onEdit: PropTypes.func,
  staffButton: PropTypes.object,
  roleList: PropTypes.array,
  checkedStaffId: PropTypes.array,
  onChangeSorter: PropTypes.func,
  onSelectStaff: PropTypes.func,
  listPagination: PropTypes.object,
  loading: PropTypes.bool,
  onDelectStaff: PropTypes.func,
};

export default list;
