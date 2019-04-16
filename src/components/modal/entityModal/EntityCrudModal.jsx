import React, { Component } from "react";
import { connect } from "dva";
import { Modal, Table, Divider, Popconfirm, Button, Form, Input } from "antd";
import { randomColor } from "../../../utils";

const FormItem = Form.Item;

@connect(stores => ({
  manualAnnotationDetail: stores.manualAnnotationDetail,
}))
@Form.create()
class EntityCrudModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      entityData: {},
    };
    this.columns = [
      {
        title: "实体",
        dataIndex: "text",
      },
      {
        title: "操作",
        key: "action",
        width: 120,
        render: (text, record) => (
          <span>
            <a onClick={() => this.handleUpdate(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除?"
              onConfirm={() => this.handleDelete(record.id)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
  }

  handleDelete = id => {
    const {
      dispatch,
      manualAnnotationDetail: { labelCategories = [] } = {},
    } = this.props;
    dispatch({
      type: "manualAnnotationDetail/saveLabelsList",
      payload: labelCategories.filter(item => item.id !== id),
    });
  };

  handleUpdate = record => {
    this.setState({
      visible: true,
      entityData: record,
    });
  };

  render() {
    const {
      dispatch,
      visible,
      onCancel,
      manualAnnotationDetail: { labelCategories = [] } = {},
      form: { getFieldDecorator, validateFields },
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
        title="编辑实体集"
        visible={visible}
        onOk={onCancel}
        onCancel={onCancel}
      >
        <Button
          size="small"
          onClick={() => {
            this.setState({ visible: true });
          }}
        >
          新增
        </Button>
        <Table
          columns={this.columns}
          dataSource={labelCategories}
          rowKey={record => record.id}
        />
        <Modal
          title={
            this.state.entityData && this.state.entityData.id
              ? "编辑实体"
              : "新增实体"
          }
          visible={this.state.visible}
          onOk={() => {
            validateFields((errors, values) => {
              if (errors) {
                return;
              }
              const temp = JSON.parse(JSON.stringify(labelCategories));
              if (this.state.entityData && this.state.entityData.id) {
                //编辑
                dispatch({
                  type: "manualAnnotationDetail/saveLabelsList",
                  payload: temp.map(item => {
                    if (item.id === this.state.entityData.id) {
                      return {
                        ...item,
                        ...values,
                      };
                    } else {
                      return item;
                    }
                  }),
                });
              } else {
                // 新增
                temp.push({
                  ...values,
                  id: Math.random() * 100,
                  color: randomColor(),
                  borderColor: randomColor(),
                });
                dispatch({
                  type: "manualAnnotationDetail/saveLabelsList",
                  payload: temp,
                });
              }
              this.setState({ visible: false, entityData: {} });
            });
          }}
          onCancel={() => {
            this.setState({ visible: false, entityData: {} });
          }}
          destroyOnClose
        >
          <FormItem label="实体名称" {...formItemLayout}>
            {getFieldDecorator("text", {
              rules: [{ required: true, message: "实体名称不能为空!" }],
              initialValue: this.state.entityData && this.state.entityData.text,
            })(<Input />)}
          </FormItem>
        </Modal>
      </Modal>
    );
  }
}

export default EntityCrudModal;
