import React, { Component } from "react";
import LoginForm from "./form/LoginForm";
import RegisterForm from "./form/RegisterForm";
import styles from "./Login.less";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: true,
    };
  }

  render() {
    const { isLogin } = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.form}>
          <div className={styles.title}>文本标注系统</div>
          {isLogin ? (
            <LoginForm
              goToRegister={() => {
                this.setState({ isLogin: false });
              }}
            />
          ) : (
            <RegisterForm
              goToLogin={() => {
                this.setState({ isLogin: true });
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Login;
