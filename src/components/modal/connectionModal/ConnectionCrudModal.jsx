import React, { Component } from "react";
import { connect } from "dva";
import { Modal, Table, Divider, Popconfirm, Button, Form, Input } from "antd";

const FormItem = Form.Item;

@connect(stores => ({
  manualAnnotationDetail: stores.manualAnnotationDetail,
}))
@Form.create()
class ConnectionCrudModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      connectionData: {},
    };
    this.columns = [
      {
        title: "关系",
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
      manualAnnotationDetail: { connectionCategories = [] } = {},
    } = this.props;
    dispatch({
      type: "manualAnnotationDetail/saveConnectionsList",
      payload: connectionCategories.filter(item => item.id !== id),
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
      manualAnnotationDetail: { connectionCategories = [] } = {},
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
          dataSource={connectionCategories}
          rowKey={record => record.id}
        />
        <Modal
          title={
            this.state.connectionData && this.state.connectionData.id
              ? "编辑关系"
              : "新增关系"
          }
          visible={this.state.visible}
          onOk={() => {
            validateFields((errors, values) => {
              if (errors) {
                return;
              }
              const temp = JSON.parse(JSON.stringify(connectionCategories));
              if (this.state.connectionData && this.state.connectionData.id) {
                //编辑
                dispatch({
                  type: "manualAnnotationDetail/saveConnectionsList",
                  payload: temp.map(item => {
                    if (item.id === this.state.connectionData.id) {
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
                });
                dispatch({
                  type: "manualAnnotationDetail/saveConnectionsList",
                  payload: temp,
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
