import React, { Component } from "react";
import { connect } from "dva";
import { Modal, Table, Divider, Popconfirm, Button, Form, Input } from "antd";

const FormItem = Form.Item;

@connect(stores => ({
  manualAnnotationDetail: stores.manualAnnotationDetail,
  public: stores.public,
}))
@Form.create()
class ConnectionCrudModal extends Component {
  constructor(props) {
    super(props);
    const { public: { roleLevel } = {} } = props;
    this.state = {
      visible: false,
      connectionData: {},
    };
    this.columns = [
      {
        title: "关系",
        dataIndex: "text",
      },
    ];
    if (roleLevel >= 3) {
      this.columns.push({
        title: "操作",
        key: "action",
        width: 120,
        render: (text, record) => (
          <span>
            <a onClick={() => this.handleUpdate(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除?"
              onConfirm={() => this.handleDelete(record.connectionId)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      });
    }
  }

  handleDelete = connectionId => {
    const { dispatch, manualAnnotationDetail: { projectId } = {} } = this.props;
    dispatch({
      type: "manualAnnotationDetail/deleteConnection",
      payload: connectionId,
    }).then(errCode => {
      if (!errCode) {
        // 获取关系集列表
        dispatch({
          type: "manualAnnotationDetail/queryConnectionsList",
          payload: projectId,
        });
      }
    });
  };

  handleUpdate = record => {
    this.setState({
      visible: true,
      connectionData: record,
    });
  };

  render() {
    const {
      dispatch,
      visible,
      onCancel,
      manualAnnotationDetail: { connectionCategories = [], projectId } = {},
      public: { roleLevel } = {},
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
        title="编辑关系集"
        visible={visible}
        onOk={onCancel}
        onCancel={onCancel}
      >
        {roleLevel >= 3 && (
          <Button
            type="primary"
            onClick={() => {
              this.setState({ visible: true });
            }}
          >
            新增
          </Button>
        )}
        <Table
          columns={this.columns}
          dataSource={connectionCategories}
          rowKey={record => record.connectionId}
        />
        <Modal
          title={
            this.state.connectionData && this.state.connectionData.connectionId
              ? "编辑关系"
              : "新增关系"
          }
          visible={this.state.visible}
          onOk={() => {
            validateFields((errors, values) => {
              if (errors) {
                return;
              }
              if (
                this.state.connectionData &&
                this.state.connectionData.connectionId
              ) {
                //编辑
                dispatch({
                  type: "manualAnnotationDetail/updateConnection",
                  payload: {
                    connectionId: this.state.connectionData.connectionId,
                    text: values.text,
                  },
                }).then(errCode => {
                  if (!errCode) {
                    // 获取关系集列表
                    dispatch({
                      type: "manualAnnotationDetail/queryConnectionsList",
                      payload: projectId,
                    });
                  }
                });
              } else {
                // 新增
                dispatch({
                  type: "manualAnnotationDetail/addConnection",
                  payload: {
                    projectId,
                    connection: {
                      text: values.text,
                    },
                  },
                }).then(errCode => {
                  if (!errCode) {
                    // 获取关系集列表
                    dispatch({
                      type: "manualAnnotationDetail/queryConnectionsList",
                      payload: projectId,
                    });
                  }
                });
              }
              this.setState({ visible: false, connectionData: {} });
            });
          }}
          onCancel={() => {
            this.setState({ visible: false, connectionData: {} });
          }}
          destroyOnClose
        >
          <FormItem label="关系名称" {...formItemLayout}>
            {getFieldDecorator("text", {
              rules: [{ required: true, message: "关系名称不能为空!" }],
              initialValue:
                this.state.connectionData && this.state.connectionData.text,
            })(<Input />)}
          </FormItem>
        </Modal>
      </Modal>
    );
  }
}

export default ConnectionCrudModal;
