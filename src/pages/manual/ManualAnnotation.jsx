import React, { Component } from "react";
import { connect } from "dva";
import { Annotator, Action } from "poplar-annotation";
import { List, Radio, Tooltip, Button } from "antd";
import { equals } from "@cbd/utils";
import EntityCrudModal from "../../components/modal/entityModal/EntityCrudModal";
import ConnectionModal from "../../components/modal/connectionModal/ConnectionModal";
import ConnectionCrudModal from "../../components/modal/connectionModal/ConnectionCrudModal";
import ProjectModal from "../../components/modal/projectModal/ProjectModal";
import styles from "./ManualAnnotation.less";

@connect(stores => ({
  manualAnnotationDetail: stores.manualAnnotationDetail,
}))
class ManualAnnotation extends Component {
  state = {
    selectedLabelCategoryId: null,
    sentenceId: 0,
    EntityCrudModalVisible: false,
    ProjectModalVisible: false,
  };

  componentDidMount() {
    this.init();
  }

  init = () => {};

  // 初始化标注区域
  annotationInit = async (sentenceObj = {}) => {
    const {
      dispatch,
      manualAnnotationDetail: {
        labelCategories = [],
        connectionCategories = [],
        projectId,
      } = {},
    } = this.props;
    this.annotator && this.annotator.remove();
    const { content = "", sentenceId } = sentenceObj;
    this.setState({ sentenceId });
    const { labels = [], connections = [] } = await dispatch({
      type: "manualAnnotationDetail/queryAnnotation",
      payload: { projectId, sentenceId },
    });
    const originString = {
      content,
      labelCategories: labelCategories.map(item => ({
        id: item.labelId,
        borderColor: item.bordercolor,
        text: item.text,
        color: item.color,
      })),
      labels: labels.map(item => ({
        id: item.labelId,
        categoryId: item.categoryId,
        startIndex: item.startIndex,
        endIndex: item.endIndex,
      })),
      connectionCategories: connectionCategories.map(item => ({
        id: item.connectionId,
        text: item.text,
      })),
      connections: connections.map(item => ({
        id: item.connectionlId,
        categoryId: item.categoryId,
        fromId: item.fromId,
        toId: item.toId,
      })),
    };
    this.annotator = new Annotator(
      originString,
      document.getElementById("AnnotationArea"),
      { allowMultipleLabel: false, maxLineWidth: 30 }
    );
    // Label 新增
    this.annotator.on("textSelected", (startIndex, endIndex) => {
      // 获取用户想要添加的LabelCategoryId
      const { selectedLabelCategoryId } = this.state;
      if (selectedLabelCategoryId) {
        this.annotator.applyAction(
          Action.Label.Create(selectedLabelCategoryId, startIndex, endIndex)
        );
      }
    });
    // Label 删除
    this.annotator.on("labelRightClicked", (id, x, y) => {
      // 输出用户点击的label的ID, 被点击时鼠标的 X,Y 值
      this.annotator.applyAction(Action.Label.Delete(id));
    });
    // Connection 新增
    this.annotator.on("twoLabelsClicked", (startIndex, endIndex) => {
      // 获取用户想要添加的ConnectionCategoryId
      this.setState({ ConnectionModalVisible: true, startIndex, endIndex });
      // this.annotator.applyAction(
      //   Action.Connection.Create(1, startIndex, endIndex)
      // );
    });
    // Connection 删除
    this.annotator.on("connectionRightClicked", (id, x, y) => {
      // 输出用户点击的Connection的ID, 被点击时鼠标的 X,Y 值
      this.annotator.applyAction(Action.Connection.Delete(id));
    });
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      manualAnnotationDetail: {
        labelCategories: prevLabelCategories = [],
        connectionCategories: prevConnectionCategories = [],
      } = {},
    } = prevProps;
    const {
      manualAnnotationDetail: {
        labelCategories = [],
        connectionCategories = [],
      } = {},
    } = this.props;
    // 监听实体集列表变化并更新
    if (!equals(prevLabelCategories, labelCategories)) {
      (labelCategories || []).forEach(item => {
        if (this.annotator) {
          this.annotator.store.labelCategoryRepo.add({
            id: item.labelId,
            borderColor: item.bordercolor,
            text: item.text,
            color: item.color,
          });
        }
      });
    }
    // 监听关系集列表变化并更新
    if (!equals(prevConnectionCategories, connectionCategories)) {
      (connectionCategories || []).forEach(item => {
        if (this.annotator) {
          this.annotator.store.connectionCategoryRepo.add({
            id: item.connectionId,
            text: item.text,
          });
        }
      });
    }
  }

  render() {
    const {
      dispatch,
      manualAnnotationDetail: {
        projectId,
        projectName,
        sentencesList = [],
        labelCategories = [],
      } = {},
    } = this.props;
    const {
      EntityCrudModalVisible,
      ConnectionCrudModalVisible,
      ConnectionModalVisible,
      sentenceId,
      ProjectModalVisible,
    } = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.sidebar}>
          <section>
            <ProjectModal
              visible={ProjectModalVisible}
              onCancel={() => {
                this.setState({ ProjectModalVisible: false });
              }}
              annotationInit={sentenceObj => {
                this.annotationInit(sentenceObj);
              }}
            />
            <h3 className={styles.subtitle}>
              项目信息
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ ProjectModalVisible: true });
                }}
              >
                选择项目
              </Button>
            </h3>
            <div className={`${styles.subitem} ${styles.margin}`}>
              <div className={styles.key}>文件名</div>
              {projectName}
            </div>
            <div className={`${styles.subitem} ${styles.margin}`}>
              <div className={styles.key}>实体集</div>
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ EntityCrudModalVisible: true });
                }}
              >
                编辑
              </Button>
              <EntityCrudModal
                visible={EntityCrudModalVisible}
                onCancel={() => {
                  this.setState({ EntityCrudModalVisible: false });
                }}
              />
            </div>
            <div className={`${styles.subitem} ${styles.margin}`}>
              <div className={styles.key}>关系集</div>
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ ConnectionCrudModalVisible: true });
                }}
              >
                编辑
              </Button>
              <ConnectionModal
                visible={ConnectionModalVisible}
                onCancel={() => {
                  this.setState({ ConnectionModalVisible: false });
                }}
                onOk={ConnectionCategoryId => {
                  this.annotator.applyAction(
                    Action.Connection.Create(
                      ConnectionCategoryId,
                      this.state.startIndex,
                      this.state.endIndex
                    )
                  );
                }}
              />
              <ConnectionCrudModal
                visible={ConnectionCrudModalVisible}
                onCancel={() => {
                  this.setState({ ConnectionCrudModalVisible: false });
                }}
              />
            </div>
            <div className={`${styles.subitem} ${styles.margin}`}>
              <div className={styles.key}>导出数据</div>
              <Button type="primary">
                <a href={`/api/manual/exportTxt?projectId=${projectId}`}>
                  .txt
                </a>
              </Button>
              <Button type="primary">
                <a href={`/api/manual/exportCsv?projectId=${projectId}`}>
                  .csv
                </a>
              </Button>
            </div>
          </section>
          <section>
            <h3 className={styles.subtitle}>进度</h3>
            <div className={styles.subitem}>
              <div className={styles.key}>已标注</div>
              {sentencesList.filter(item => item.labeled).length}
            </div>
            <div className={styles.subitem}>
              <div className={styles.key}>总共</div>
              {sentencesList.length}
            </div>
            <div className={styles.subitem}>
              <div className={styles.key}>
                <progress
                  value={
                    (sentencesList.filter(item => item.labeled).length /
                      sentencesList.length) *
                    100
                  }
                  max="100"
                />
              </div>
              {(
                (sentencesList.filter(item => item.labeled).length /
                  sentencesList.length) *
                100
              ).toFixed(1)}
              %
            </div>
          </section>
          <section>
            <h3 className={styles.subtitle}>句子列表</h3>
            <List
              dataSource={sentencesList}
              renderItem={(item, index) => (
                <div className={styles.subitem}>
                  <Tooltip placement="left" title={item.content}>
                    <List.Item
                      onClick={() => {
                        this.annotator && this.annotator.remove();
                        this.annotationInit(item);
                      }}
                    >
                      {`${index + 1}.${item.content}`}
                    </List.Item>
                  </Tooltip>
                </div>
              )}
            />
          </section>
        </div>
        <div className={styles.right}>
          <div className={styles.container}>
            <div className={styles.content}>
              <div className={styles.entities}>
                <Radio.Group
                  buttonStyle="solid"
                  onChange={e => {
                    this.setState({ selectedLabelCategoryId: e.target.value });
                  }}
                >
                  {(labelCategories || []).map(item => (
                    <Radio.Button value={item.labelId} key={item.labelId}>
                      {item.text}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>
              <div className={styles.text} id="AnnotationArea" />
            </div>
            <div className={styles.meta}>
              <span>
                <strong>来源：</strong>
                xxxxxxxxxxx
              </span>
            </div>
          </div>
          <footer className={styles.footer}>
            <button
              style={{ background: "#4fd364" }}
              onClick={() => {
                const {
                  labels = [],
                  connections = [],
                } = this.annotator.store.json;
                dispatch({
                  type: "manualAnnotationDetail/saveAnnotation",
                  payload: {
                    projectId,
                    sentenceId,
                    labels,
                    connections,
                  },
                }).then(errCode => {
                  if (!errCode) {
                    dispatch({
                      type: "manualAnnotationDetail/querySentencesList",
                      payload: projectId,
                    }).then(res => {
                      if (res) {
                        this.annotationInit(
                          res.find(
                            item =>
                              !item.labeled && item.sentenceId !== sentenceId
                          )
                        );
                      }
                    });
                  }
                });
              }}
            >
              <svg
                aria-hidden="true"
                fill="currentColor"
                width="40"
                height="40"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.172l10.594-10.594 1.406 1.406-12 12-5.578-5.578 1.406-1.406z" />
              </svg>
            </button>
            <button style={{ background: "#f74c4a" }}>
              <svg
                aria-hidden="true"
                fill="currentColor"
                width="40"
                height="40"
                viewBox="0 0 24 24"
              >
                <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z" />
              </svg>
            </button>
          </footer>
        </div>
      </div>
    );
  }
}

export default ManualAnnotation;
