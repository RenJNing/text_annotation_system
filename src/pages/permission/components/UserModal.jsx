import React, { Component } from "react";
import { connect } from "dva";
import { Modal, Form, Input, Select } from "antd";

const FormItem = Form.Item;
const { Option } = Select;

@connect(stores => ({
  usersDetail: stores.usersDetail,
}))
@Form.create()
class UserModal extends Component {
  render() {
    const {
      dispatch,
      form: { getFieldDecorator, validateFields },
      onCancel = () => {},
      visible,
      recordData = {},
    } = this.props;
    const formItemLayout = {
      //表单的栅格行配置
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <Modal
        title={"编辑用户信息"}
        visible={visible}
        onOk={() => {
          validateFields((errors, values) => {
            if (errors) {
              return;
            }
            const params = {
              userId: recordData.userId,
              role: values.role,
            };
            dispatch({ type: "usersDetail/assignRole", payload: params }).then(
              errCode => {
                if (!errCode) {
                  dispatch({ type: "usersDetail/queryUsersList" });
                  onCancel();
                }
              }
            );
          });
        }}
        onCancel={onCancel}
        destroyOnClose
      >
        <FormItem label="账号" {...formItemLayout}>
          {getFieldDecorator("username", {
            initialValue: recordData.userName,
          })(<Input disabled={true} />)}
        </FormItem>
        <FormItem label="角色" {...formItemLayout}>
          {getFieldDecorator("role", {
            rules: [{ required: true, message: "请选择角色!" }],
            initialValue: recordData.role,
          })(
            <Select style={{ width: 120 }}>
              <Option value="admin">超级管理员</Option>
              <Option value="user">普通用户</Option>
              <Option value="guest">游客</Option>
            </Select>
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default UserModal;
