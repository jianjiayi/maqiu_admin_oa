import React, { Component } from 'react';
import { Layout, Drawer, Spin, Icon } from 'antd';

import { withRouter } from 'react-router-dom';

import SliderMenu from './sliderMenu';
import MqHeader from './header';
import TimeWeather from '../timeWeather';
import MqBreadcrumb from '../breadcrumb';

import { connect } from 'react-redux';
import * as actionCreators from '@/store/all/actionCreators';


// import adminRoutes from '@/config/adminMenu.js';

import './index.less'

const { Content, Sider } = Layout;

class MqLayout extends Component {
    state = {
        adminRoutes:this.props.sliserMenus,
        collapsed: false,
        drawerVisible: false,
    };
    componentWillReceiveProps(nextProps) {
        // console.log(nextProps)
        let _this = this;
        _this.setState({
            adminRoutes:nextProps.sliserMenus,
        })
    }
    //pc端侧边菜单折叠
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            drawerVisible: false
        });
    };
    //移动端侧边菜单折叠
    toggleDrawer = () => {
        this.setState({
            drawerVisible: !this.state.drawerVisible,
            collapsed: false,
        });
    };

    //保存展开过得菜单
    saveReduxMenu = (path) => {
        let i = 0;
        let adminRoutes = this.state.adminRoutes;
        let pathMenu = adminRoutes.filter((n) => { return n.path === '/' + path[i] });
        if (pathMenu.length === 0) return;
        if (pathMenu[0].children) {
            ++i
            pathMenu = pathMenu[0].children.filter((m) => { return m.path === '/' + path[i - 1] + '/' + path[i] });
        }

        //路由输入错误
        if (pathMenu.length === 0) return;
        //获取保存的路由
        let navArrays = this.props.navArrays.toJS();
        //判断是否打开过
        let isOpenKey = navArrays.filter((n) => { return n.path === pathMenu[0].path });
        if (isOpenKey.length === 0) {
            navArrays.push(pathMenu[0]);
            this.props.pushNavArray(navArrays);
        }
    }

    render() {
        // 通过URL判断是哪个菜单，将导航传入redux
        let path = this.props.location.pathname;
        path = path.substr(1); //删除第一个字符
        this.saveReduxMenu(path.split('/'));

        return (
            <Spin tip="加载中" spinning={this.props.loading} indicator={<Icon type="minus" spin />}>
                <Layout>
                    <MqHeader
                        collapsed={this.state.collapsed}
                        toggleCollapsed={this.toggle}

                        drawerVisible={this.state.drawerVisible}
                        toggleDrawerVisible={this.toggleDrawer}

                        userInfo={this.props.userInfo.toJS()}
                        logout={this.props.loginOut}
                    >
                    </MqHeader>
                    <Layout>
                        {/* 移动端侧边菜单 */}
                        <Drawer
                            className="mobile-slider"
                            title="大为科技后台管理"
                            placement="left"
                            closable={true}
                            cancelable={false}
                            onClose={this.toggleDrawer}
                            visible={this.state.drawerVisible}>
                            <SliderMenu
                                menuRoutes = {this.state.adminRoutes}
                                toggleDrawerVisible={this.toggleDrawer}
                                collapsed={this.state.collapsed}
                                selectedKeys={this.props.location.pathname.split(',')}
                            ></SliderMenu>
                            <div className="bottom-fiexd">
                                <TimeWeather></TimeWeather>
                            </div>
                        </Drawer>
                        {/* pc端侧边菜单 */}
                        <Sider
                            className="pc-slider"
                            trigger={null}
                            collapsible
                            collapsed={this.state.collapsed}>
                            <SliderMenu
                                menuRoutes = {this.state.adminRoutes}
                                toggleDrawerVisible={this.toggleDrawer}
                                collapsed={this.state.collapsed}
                                selectedKeys={this.props.location.pathname.split(',')}
                            ></SliderMenu>
                        </Sider>

                        <Content
                            className="layoutContent"
                            style={{ overflow: 'auto', height: 'calc(100vh - 74px)' }}
                        >
                            <div className="breadcrumb-time-weather">
                                {/* 浏览页面记录 */}
                                <MqBreadcrumb
                                    pathname={this.props.location.pathname}
                                    navArrays={this.props.navArrays.toJS()}
                                ></MqBreadcrumb>
                                <TimeWeather></TimeWeather>
                            </div>

                            {this.props.children}
                        </Content>

                    </Layout>
                </Layout>
            </Spin>
        )
    }
}

const mapState = (state) => {
    return {
        userInfo: state.getIn(['all', 'userInfo']),
        navArrays: state.getIn(['all', 'navArrays'])
    }
}

const mapDispatch = (dispatch) => {
    return {
        loginOut() {
            dispatch(actionCreators.login_out())
        },
        pushNavArray(item) {
            dispatch(actionCreators.navArrayPush(item))
        }

    }
}

export default withRouter(connect(mapState, mapDispatch)(MqLayout));