import React, { Component } from "react";
import { connect } from "dva";
import router from "umi/router";
import Layout from "@cbd/layout";
import { findActiveArray } from "@cbd/utils";
import menuData from "./menuData";
import Logo from "../components/logo";

import styles from "./index.less";

@connect(stores => ({ publicData: stores.public }))
class BaseLayout extends Component {
  localChangeActiveMenu = key => {
    const activeMenus = findActiveArray(
      item => item.key === key || item.link === key,
      menuData
    );
    return Array.isArray(activeMenus)
      ? activeMenus[activeMenus.length - 1]
      : {};
  };

  localOnClickMenu = ({ item }) => {
    const { props } = item;
    if (props && props.link) {
      router.push(props.link);
    }
  };

  render() {
    const { children, publicData, location, dispatch, history } = this.props;
    const { username, roleLevel } = publicData;

    if (location.pathname === "/login") {
      return children;
    }

    const { key = "" } =
      this.localChangeActiveMenu(location.pathname, menuData) || {};

    const layoutOptions = {
      menuData: menuData.filter(
        item => !item.roleLevel || roleLevel >= item.roleLevel
      ),
      menuOptions: {
        logoRender: Logo,
        selectedkey: key,
        defaultSelectedKeys: [key],
        onClick: this.localOnClickMenu,
      },
      headerOptions: {
        username,
        showBreadcrumb: false,
        onLogout: () => {
          dispatch({ type: "public/logout" }).then(errCode => {
            if (errCode === 0) {
              history.push("/login");
            }
          });
        },
      },
    };

    return (
      <Layout className={styles.root} {...layoutOptions}>
        {children}
      </Layout>
    );
  }
}

export default BaseLayout;
