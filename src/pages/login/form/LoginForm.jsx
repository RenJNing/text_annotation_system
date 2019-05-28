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
class LoginForm extends Component {
  handleLogin = e => {
    e.preventDefault();
    const {
      dispatch,
      history,
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({ type: "public/login", payload: values }).then(errCode => {
        if (errCode === 0) {
          history.push("/");
        }
      });
    });
  };
  render() {
    const {
      form: { getFieldDecorator } = {},
      goToRegister = () => {},
    } = this.props;
    return (
      <Form onSubmit={this.handleLogin}>
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
          <Button
            type="primary"
            htmlType="submit"
            className={styles.loginButton}
          >
            登录
          </Button>
          或 <a onClick={goToRegister}>去注册!</a>
        </Form.Item>
      </Form>
    );
  }
}

export default LoginForm;
