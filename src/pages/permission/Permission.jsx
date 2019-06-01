import React, { Component } from "react";
import { connect } from "dva";
import { Table } from "antd";
import UserModal from "./components/UserModal";
import styles from "./Permission.less";

@connect(stores => ({
  usersDetail: stores.usersDetail,
}))
class Permission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      recordData: {},
    };
    this.columns = [
      {
        title: "用户编号",
        dataIndex: "userId",
      },
      {
        title: "名称",
        dataIndex: "userName",
      },
      {
        title: "角色",
        dataIndex: "role",
        render: text => {
          switch (text) {
            case "admin":
              return "超级管理员";
            case "user":
              return "普通用户";
            case "guest":
              return "游客";
            default:
              return "Unknown";
          }
        },
      },
      {
        title: "操作",
        key: "action",
        width: 120,
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                this.setState({
                  visible: true,
                  recordData: record,
                });
              }}
            >
              编辑
            </a>
          </span>
        ),
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "usersDetail/queryUsersList" });
  }

  render() {
    const { usersDetail: { usersList = [] } = {} } = this.props;
    const { visible, recordData } = this.state;
    return (
      <div className={styles.root}>
        用户列表
        <Table
          className={styles.table}
          columns={this.columns}
          dataSource={usersList}
          rowKey={record => record.userId}
        />
        <UserModal
          visible={visible}
          recordData={recordData}
          onCancel={() => {
            this.setState({ visible: false, recordData: {} });
          }}
        />
      </div>
    );
  }
}

export default Permission;
