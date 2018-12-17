import React, { PropTypes } from 'react';
import { Form, Input, Modal, Select, Row, Col, Tree, message } from 'antd';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

message.config({
  top: 300,
  duration: 2,
});

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const modal = ({
   loading,
   title,
   visible,
   onSubmit,
   onCancel,
   postCode,
   postName,
   form: {
     validateFields,
     getFieldDecorator,
   },
 }) => {
  const handleOk = () => {
    validateFields((errors, values) => {
      if (!errors) {
        onSubmit(values);
      }
    });
  };
  const modalOpts = {
    width: 915,
    title,
    visible,
    cancelText: '取消',
    okText: '确定',
    onOk: handleOk,
    onCancel,
    confirmLoading: loading,
    maskClosable: false,
  };
  const renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.menugroupsName} key={item.id} value={item.id} dataRef={item}>
          {renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.menugroupsName} key={item.id} value={item.id} dataRef={item} />;
  });
  return (
    <Modal {...modalOpts} >
      <Form >
        <Row>
          <Col span={11}>
            <FormItem
              {...formItemLayout}
              label="角色名称"
              hasFeedback
            >
              {getFieldDecorator('postName', {
                initialValue: postName,
                rules: [{
                  required: true,
                  message: '请输入姓名！',
                }, {
                  pattern: /^[A-Za-z\u4e00-\u9fa5]{2,10}$/,
                  message: '请输入2到10位的中文/英文/数字/下划线字符，可组合',
                }],
              })(
                <Input
                  type="text"
                  placeholder="请输入2到10位的中文/英文/数字/下划线字符，可组合"
                />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="权重"
            >
              {getFieldDecorator('postCode', {
                initialValue: postCode,
                rules: [
                  { required: true,
                    message: '请选择权重',
                  },
                ],
              })(<Select placeholder="请选择权重" name="postCode" >
                <Select.Option value={1} key="1" >门店员工</Select.Option>
                <Select.Option value={5} key="5" >门店管理员</Select.Option>
                <Select.Option value={9} key="9" >总部管理员</Select.Option>
              </Select>)}
            </FormItem>
            {/* <FormItem
              {...formItemLayout}
              label="权限机构"
            >
              {getFieldDecorator('postList', {
                initialValue: postList,
                rules: [
                  {
                    required: true,
                    message: '请选择权限机构',
                  },
                ],
              })(<Tree placeholder="请选择权限机构">
                {console.log('加载输：')}
                {renderTreeNodes([])}
              </Tree>)}
            </FormItem> */}
          </Col>
        </Row>
      </Form>
    </Modal>

  );
};

modal.propTypes = {
  form: PropTypes.object,
  postCode: PropTypes.number,
  postName: PropTypes.string,
  title: PropTypes.string,
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default Form.create()(modal);
