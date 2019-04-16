import React, { Component } from "react";
import { connect } from "dva";
import { Annotator, Action } from "poplar-annotation";
import { List, Radio, Tooltip, Button } from "antd";
import { equals } from "@cbd/utils";
import EntityCrudModal from "../../components/modal/entityModal/EntityCrudModal";
import ConnectionModal from "../../components/modal/connectionModal/ConnectionModal";
import ConnectionCrudModal from "../../components/modal/connectionModal/ConnectionCrudModal";
import styles from "./ManualAnnotation.less";

@connect(stores => ({
  manualAnnotationDetail: stores.manualAnnotationDetail,
}))
class ManualAnnotation extends Component {
  state = {
    selectedLabelCategoryId: 0,
    sentenceId: undefined,
    EntityCrudModalVisible: false,
  };

  componentDidMount() {
    this.init();
  }

  init = () => {
    const { dispatch } = this.props;
    // 获取句子列表
    dispatch({ type: "manualAnnotationDetail/querySentencesList" }).then(
      (sentencesList = []) => {
        this.annotationInit(sentencesList[0]);
      }
    );
    // 获取实体集列表
    dispatch({ type: "manualAnnotationDetail/queryLabelsList" });
    // 获取关系集列表
    dispatch({ type: "manualAnnotationDetail/queryConnectionsList" });
  };

  // 初始化标注区域
  annotationInit = (sentenceObj = {}) => {
    const {
      manualAnnotationDetail: {
        labelCategories = [],
        connectionCategories = [],
      } = {},
    } = this.props;
    const { mark = {}, sentence = "", id } = sentenceObj;
    this.setState({ sentenceId: id });
    const originString = {
      content: sentence,
      labelCategories,
      labels: [],
      connectionCategories,
      connections: [],
      ...mark,
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
      this.annotator.applyAction(
        Action.Label.Create(selectedLabelCategoryId, startIndex, endIndex)
      );
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
          this.annotator.store.labelCategoryRepo.add(item);
        }
      });
    }
    // 监听关系集列表变化并更新
    if (!equals(prevConnectionCategories, connectionCategories)) {
      (connectionCategories || []).forEach(item => {
        if (this.annotator) {
          this.annotator.store.connectionCategoryRepo.add(item);
        }
      });
    }
  }

  render() {
    const {
      dispatch,
      manualAnnotationDetail: { sentencesList = [], labelCategories = [] } = {},
    } = this.props;
    const {
      EntityCrudModalVisible,
      ConnectionCrudModalVisible,
      ConnectionModalVisible,
    } = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.sidebar}>
          <section>
            <h3 className={styles.subtitle}>项目信息</h3>
            <div className={styles.subitem}>
              <div className={styles.key}>文件名</div>
              prodigy_demo
            </div>
            <div className={styles.subitem}>
              <div className={styles.key}>实体集</div>
              <Button
                size="small"
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
            <div className={styles.subitem}>
              <div className={styles.key}>关系集</div>
              <Button
                size="small"
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
          </section>
          <section>
            <h3 className={styles.subtitle}>进度</h3>
            <div className={styles.subitem}>
              <div className={styles.key}>已标注</div>0
            </div>
            <div className={styles.subitem}>
              <div className={styles.key}>总共</div>
              {sentencesList.length}
            </div>
            <div className={styles.subitem}>
              <div className={styles.key}>
                <progress value={(1 / sentencesList.length) * 100} max="100" />
              </div>
              {(1 / sentencesList.length) * 100}%
            </div>
          </section>
          <section>
            <h3 className={styles.subtitle}>句子列表</h3>
            <List
              dataSource={sentencesList}
              renderItem={item => (
                <Tooltip title={item.sentence}>
                  <List.Item
                    onClick={() => {
                      this.annotator.remove();
                      this.annotationInit(item);
                    }}
                  >
                    {`${item.id}.${item.sentence}`}
                  </List.Item>
                </Tooltip>
              )}
            />
          </section>
        </div>
        <div className={styles.right}>
          <div className={styles.container}>
            <div className={styles.content}>
              <div className={styles.entities}>
                <Radio.Group
                  defaultValue={0}
                  buttonStyle="solid"
                  onChange={e => {
                    this.setState({ selectedLabelCategoryId: e.target.value });
                  }}
                >
                  {(labelCategories || []).map(item => (
                    <Radio.Button value={item.id} key={item.id}>
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
                dispatch({
                  type: "manualAnnotationDetail/saveSentencesList",
                  payload: sentencesList.map(item =>
                    item.id === this.state.sentenceId
                      ? { ...item, mark: this.annotator.store.json }
                      : item
                  ),
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
