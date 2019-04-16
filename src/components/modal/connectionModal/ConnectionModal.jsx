import React, { Component } from "react";
import { connect } from "dva";
import { Modal, Radio, Form } from "antd";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(stores => ({
  manualAnnotationDetail: stores.manualAnnotationDetail,
}))
@Form.create()
class ConnectionModal extends Component {
  render() {
    const {
      visible,
      onCancel,
      onOk,
      manualAnnotationDetail: { connectionCategories = [] } = {},
      form: { getFieldDecorator, validateFields },
    } = this.props;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    return (
      <Modal
        title="选择关系类型"
        visible={visible}
        onOk={() => {
          validateFields((errors, values) => {
            if (errors) {
              return;
            }
            onOk(values.ConnectionCategoryId);
            onCancel();
          });
        }}
        onCancel={onCancel}
        destroyOnClose
      >
        <FormItem>
          {getFieldDecorator("ConnectionCategoryId", {
            rules: [{ required: true, message: "请选择关系类型!" }],
          })(
            <RadioGroup>
              {(connectionCategories || []).map(item => (
                <Radio style={radioStyle} value={item.id} key={item.id}>
                  {item.text}
                </Radio>
              ))}
            </RadioGroup>
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default ConnectionModal;
