import React, { Component } from "react";
import { connect } from "dva";
import { withRouter } from "react-router-dom";
import { Form, Icon, Input, Button } from "antd";
import styles from "../Login.less";

@connect(stores => ({
  public: stores.public,
}))
@Form.create()
@withRouter
class RegisterForm extends Component {
  handleRegister = e => {
    e.preventDefault();
    const {
      dispatch,
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({ type: "public/register", payload: values }).then(errCode => {
        if (errCode === 0) {
          console.log("注册成功");
        }
      });
    });
  };
  render() {
    const {
      form: { getFieldDecorator } = {},
      goToLogin = () => {},
    } = this.props;
    return (
      <Form onSubmit={this.handleRegister}>
        <Form.Item>
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "请输入你的账号!" }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="账号"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "请输入密码!" }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("confirmPassword", {
            rules: [
              { required: true, message: "请再次输入密码!" },
              {
                validator: (rule, value, callback) => {
                  const {
                    form: { getFieldValue },
                  } = this.props;
                  if (value && value !== getFieldValue("password")) {
                    callback("输入的两个密码不一致!");
                  } else {
                    callback();
                  }
                },
              },
            ],
            validateTrigger: "onBlur",
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="确认密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.loginButton}
          >
            注册
          </Button>
          或 <a onClick={goToLogin}>去登录!</a>
        </Form.Item>
      </Form>
    );
  }
}

export default RegisterForm;
