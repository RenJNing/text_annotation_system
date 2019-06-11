import React, { Component } from "react";
import { connect } from "dva";
import { Upload, Modal, Button, Icon, message, Table } from "antd";

@connect(stores => ({
  manualAnnotationDetail: stores.manualAnnotationDetail,
  public: stores.public,
}))
class ProjectModal extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "序号",
        dataIndex: "projectId",
        render: (text, record, index) => index + 1,
      },
      {
        title: "文件名",
        dataIndex: "name",
      },
      {
        title: "操作",
        key: "action",
        width: 120,
        render: (text, record) => (
          <span>
            <a
              onClick={async () => {
                // 并行处理多个异步结果：获取实体集列表、获取关系集列表
                await Promise.all([
                  props.dispatch({
                    type: "manualAnnotationDetail/queryLabelsList",
                    payload: record.projectId,
                  }),
                  props.dispatch({
                    type: "manualAnnotationDetail/queryConnectionsList",
                    payload: record.projectId,
                  }),
                ]);
                props.dispatch({
                  type: "manualAnnotationDetail/saveProjectInfo",
                  payload: { projectId: record.projectId, name: record.name },
                });
                props
                  .dispatch({
                    type: "manualAnnotationDetail/querySentencesList",
                    payload: record.projectId,
                  })
                  .then(res => {
                    props.annotationInit(res.find(item => !item.labeled));
                  });
                props.onCancel();
              }}
            >
              选择
            </a>
          </span>
        ),
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "manualAnnotationDetail/queryProjectsList" });
  }

  render() {
    const {
      visible,
      onCancel,
      manualAnnotationDetail: { projectsList = [] } = {},
      public: { roleLevel } = {},
      dispatch,
    } = this.props;
    const props = {
      name: "file",
      action: "/api/manual/upload",
      headers: {
        authorization: "authorization-text",
      },
      onChange(info) {
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
          message.success(`${info.file.name} 导入成功`);
          dispatch({ type: "manualAnnotationDetail/queryProjectsList" });
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} 导入失败`);
        }
      },
    };
    return (
      <Modal
        title="选择项目"
        visible={visible}
        onOk={onCancel}
        onCancel={onCancel}
      >
        {roleLevel >= 2 && (
          <Upload {...props}>
            <Button>
              <Icon type="upload" />
              上传文件
            </Button>
          </Upload>
        )}
        <Table
          columns={this.columns}
          dataSource={projectsList}
          rowKey={record => record.projectId}
        />
      </Modal>
    );
  }
}

export default ProjectModal;
