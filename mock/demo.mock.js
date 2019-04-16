const mock = {
  "GET /api/fetch": (req, res) => {
    // console.log(req.query);
    // const type = req.body.type;
    setTimeout(() => {
      if (req.query.type === "error") {
        res.status(200).json({
          errCode: "-1",
          errMsg: "连接数据库错误啦",
          data: "",
        });
      } else {
        res.status(200).json({
          errCode: "0",
          data: "hello 我是后端，注意，这里是mock数据，不是真实数据",
        });
      }
    }, 50);
  },
  "POST /api/manual/querySentencesList": (req, res) => {
    setTimeout(() => {
      res.status(200).json({
        errCode: "0",
        data: [
          {
            id: 1,
            sentence:
              "目前,2型糖尿病及其并发症已经成为危害公众健康的主要疾病之一,控制血糖是延缓糖尿病进展及其并发症发生的重要措施之一",
            mark: {},
          },
          {
            id: 2,
            sentence:
              "虽然HBA1C  。是评价血糖控制水平的公认指标,但应该控制的理想水平即目标值究竟是多少还存在争议。",
            mark: {},
          },
          {
            id: 3,
            sentence:
              "糖尿病控制与并发症试验(DCCT,1993)、熊本(Kumamoto,1995)、英国前瞻性糖尿病研究(UKPDS,1998)等高质量临床研究已经证实,对新诊断的糖尿病患者或病情较轻的患者进行严。",
            mark: {},
          },
          {
            id: 4,
            sentence:
              "控制在7.5%左右,那么年龄较大、糖尿病病程较长、部分已有心血管疾病(CVD)或伴CVD极高危因素的糖尿病人群进一步降低血糖,对CVD的影响将会如何?",
            mark: {},
          },
          {
            id: 5,
            sentence:
              "糖尿病患者心血管风险干预研究(ACCORD)、退伍军人糖尿病研究(VADT)和糖尿病与心血管疾病行动研究(ADVANCE)等对该类人群平均5年左右的干预,结果显示强化降糖治疗使HBA1C。",
            mark: {},
          },
        ],
      });
    }, 50);
  },
  "POST /api/manual/queryLabelsList": (req, res) => {
    setTimeout(() => {
      res.status(200).json({
        errCode: "0",
        data: [
          {
            id: 0,
            text: "Disease",
            color: "#eac0a2",
            borderColor: "#8c7361",
          },
          {
            id: 1,
            text: "Test",
            color: "#619dff",
            borderColor: "#3c619d",
          },
          {
            id: 2,
            text: "Symptom",
            color: "#9d61ff",
            borderColor: "#613C9D",
          },
          {
            id: 3,
            text: "Level",
            color: "#ff9d61",
            borderColor: "#995e3a",
          },
        ],
      });
    }, 50);
  },
  "POST /api/manual/queryConnectionsList": (req, res) => {
    setTimeout(() => {
      res.status(200).json({
        errCode: "0",
        data: [
          {
            id: 1,
            text: "xxxxx修饰",
          },
          {
            id: 2,
            text: "xxxx关系",
          },
          {
            id: 3,
            text: "gggggg动作",
          },
        ],
      });
    }, 50);
  },
};
module.exports = mock;
