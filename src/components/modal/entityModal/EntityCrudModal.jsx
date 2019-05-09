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
        title: "color",
        dataIndex: "color",
      },
      {
        title: "bordercolor",
        dataIndex: "bordercolor",
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
              onConfirm={() => this.handleDelete(record.labelId)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
  }

  handleDelete = labelId => {
    const { dispatch, manualAnnotationDetail: { projectId } = {} } = this.props;
    dispatch({
      type: "manualAnnotationDetail/deleteLabel",
      payload: labelId,
    }).then(errCode => {
      if (!errCode) {
        // 获取实体集列表
        dispatch({
          type: "manualAnnotationDetail/queryLabelsList",
          payload: projectId,
        });
      }
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
      manualAnnotationDetail: { labelCategories = [], projectId } = {},
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
          type="primary"
          onClick={() => {
            this.setState({ visible: true });
          }}
        >
          新增
        </Button>
        <Table
          columns={this.columns}
          dataSource={labelCategories}
          rowKey={record => record.labelId}
        />
        <Modal
          title={
            this.state.entityData && this.state.entityData.labelId
              ? "编辑实体"
              : "新增实体"
          }
          visible={this.state.visible}
          onOk={() => {
            validateFields((errors, values) => {
              if (errors) {
                return;
              }
              if (this.state.entityData && this.state.entityData.labelId) {
                //编辑
                dispatch({
                  type: "manualAnnotationDetail/updateLabel",
                  payload: {
                    labelId: this.state.entityData.labelId,
                    text: values.text,
                    color: values.color,
                    bordercolor: values.bordercolor,
                  },
                }).then(errCode => {
                  if (!errCode) {
                    // 获取实体集列表
                    dispatch({
                      type: "manualAnnotationDetail/queryLabelsList",
                      payload: projectId,
                    });
                  }
                });
              } else {
                // 新增
                dispatch({
                  type: "manualAnnotationDetail/addLabel",
                  payload: {
                    projectId,
                    label: {
                      text: values.text,
                      color: randomColor(),
                      bordercolor: randomColor(),
                    },
                  },
                }).then(errCode => {
                  if (!errCode) {
                    // 获取实体集列表
                    dispatch({
                      type: "manualAnnotationDetail/queryLabelsList",
                      payload: projectId,
                    });
                  }
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
          {this.state.entityData && this.state.entityData.labelId && (
            <React.Fragment>
              <FormItem label="color" {...formItemLayout}>
                {getFieldDecorator("color", {
                  rules: [{ required: true, message: "color不能为空!" }],
                  initialValue:
                    this.state.entityData && this.state.entityData.color,
                })(<Input />)}
              </FormItem>
              <FormItem label="bordercolor" {...formItemLayout}>
                {getFieldDecorator("bordercolor", {
                  rules: [{ required: true, message: "bordercolor不能为空!" }],
                  initialValue:
                    this.state.entityData && this.state.entityData.bordercolor,
                })(<Input />)}
              </FormItem>
            </React.Fragment>
          )}
        </Modal>
      </Modal>
    );
  }
}

export default EntityCrudModal;
