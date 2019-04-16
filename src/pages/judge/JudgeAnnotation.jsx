import React, { Component } from "react";
import styles from "./JudgeAnnotation.less";

class JudgeAnnotation extends Component {
  state = {
    selectedEntity: "Disease",
    2: "Disease",
    16: "Disease",
  };

  render() {
    const chars = [
      "目前",
      ",",
      "2型糖尿病",
      "及其",
      "并发症",
      "已经",
      "成为",
      "危害",
      "公众",
      "健康",
      "的",
      "主要",
      "疾病",
      "之一",
      ",",
      "控制",
      "血糖",
      "是",
      "延缓",
      "糖尿病",
      "进展",
      "及其",
      "并发症",
      "发生",
      "的",
      "重要",
      "措施",
      "之一",
      "。",
    ];
    return (
      <div className={styles.root}>
        <div className={styles.sidebar}>
          <section>
            <h3 className={styles.subtitle}>项目信息</h3>
            <div className={styles.subitem}>
              <div className={styles.key}>数据集</div>
              prodigy_demo
            </div>
            <div className={styles.subitem}>
              <div className={styles.key}>VIEW ID</div>
              ner_manual
            </div>
            <div className={styles.subitem}>
              <div className={styles.key}>AUTHOR</div>
              Explosion AI
            </div>
          </section>
          <section>
            <h3 className={styles.subtitle}>进度</h3>
            <div className={styles.subitem}>
              <div className={styles.key}>已标注</div>0
            </div>
            <div className={styles.subitem}>
              <div className={styles.key}>总共</div>0
            </div>
            <div className={styles.subitem}>
              <div className={styles.key}>
                <progress value="50" max="100" />
              </div>
              0%
            </div>
          </section>
          <section>
            <h3 className={styles.subtitle}>历史记录</h3>
          </section>
        </div>
        <div className={styles.right}>
          <div className={styles.container}>
            <div className={styles.content}>
              <div className={styles.text}>
                {chars.map((item, index) => (
                  <mark
                    className={
                      this.state[index] ? styles.highlight : styles.normal
                    }
                  >
                    <span>{item}</span>
                    <span className={styles.entitiesType}>
                      {this.state[index]}
                    </span>
                  </mark>
                ))}
              </div>
            </div>
            <div className={styles.meta}>
              <span>
                <strong>来源：</strong>
                The New York Times
              </span>
            </div>
          </div>
          <footer className={styles.footer}>
            <button style={{ background: "#4fd364" }}>
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
            <button>
              <svg
                aria-hidden="true"
                fill="currentColor"
                width="40"
                height="40"
                viewBox="0 0 24 24"
              >
                <path d="M12 20.016c4.406 0 8.016-3.609 8.016-8.016 0-1.828-0.609-3.563-1.688-4.922l-11.25 11.25c1.359 1.078 3.094 1.688 4.922 1.688zM3.984 12c0 1.828 0.609 3.563 1.688 4.922l11.25-11.25c-1.359-1.078-3.094-1.688-4.922-1.688-4.406 0-8.016 3.609-8.016 8.016zM12 2.016c5.531 0 9.984 4.453 9.984 9.984s-4.453 9.984-9.984 9.984-9.984-4.453-9.984-9.984 4.453-9.984 9.984-9.984z" />
              </svg>
            </button>
            <button>
              <svg
                aria-hidden="true"
                fill="currentColor"
                width="40"
                height="40"
                viewBox="0 0 24 24"
              >
                <path d="M11.016 9l1.406 1.406-3.609 3.609h9.188v-10.031h2.016v12h-11.203l3.609 3.609-1.406 1.406-6-6z" />
              </svg>
            </button>
          </footer>
        </div>
      </div>
    );
  }
}

export default JudgeAnnotation;
