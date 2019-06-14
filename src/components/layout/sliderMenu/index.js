import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import { Menu, Icon, } from 'antd';

import adminRoutes from '@/config/adminMenu.js';
import userRoutes from '@/config/userMenu.js';


import './index.less';

const SubMenu = Menu.SubMenu;

// let menuRoutes = adminRoutes;


class SliderMenu extends Component {
    //初始默认首页菜单被展开，且高亮
    state = {
        menuRoutes:this.props.menuRoutes,
        openKeys: [],
        selectedKeys: []
    };

    //组件将要挂载
    componentDidMount = () => {
        let menuRoutes = this.state.menuRoutes;
        this.getRouteOpenKeys(menuRoutes, [], this.props.selectedKeys);
    };

    //在接受父组件改变后的props需要重新渲染组件时用到的比较多
    componentWillReceiveProps(nextProps) {
        let _this = this;
        if(nextProps.menuRoutes!==this.props.menuRoutes){
            _this.setState({
                menuRoutes:nextProps.menuRoutes,
            })
        }
        
        let menuRoutes = nextProps.menuRoutes;
        //js无法直接判断两个数组是否相同，必须转化成string在比较
        if (nextProps.selectedKeys.toString() !== this.props.selectedKeys.toString()) {
            this.getRouteOpenKeys(menuRoutes, [], nextProps.selectedKeys);
        } else {
        }
    }

    //判断展开的菜单，以及高亮的按钮
    getRouteOpenKeys = (routes, parentRoute, selectedKeys) => {//第一个参数：总路由，第二个参数：将要被菜单展开路由，第三个参数：高亮的路由

        for (const route of routes) {
            //被展开的菜单没有子路由被选中
            if (route.path === selectedKeys[0]) {
                this.setState({
                    openKeys: [...parentRoute, route.path],
                    selectedKeys: selectedKeys
                })
                return [...parentRoute, route.path];
            }
            //被展开的菜单里有子路由被选中
            if (route.children) {
                let res = this.getRouteOpenKeys(route.children, [...parentRoute, route.path], selectedKeys);
                if (res) {
                    this.setState({
                        openKeys: res,
                        selectedKeys: selectedKeys
                    })
                    return;
                }
            }

        }
        //在整个路由里没有找着要被高亮的路由，即关闭所有菜单
        this.setState({
            openKeys: [],
            selectedKeys: []
        })
    };

    //生成路由
    renderMenuItem = (route) => {
        return route.children ? (
            <SubMenu
                key={route.path}
                title={
                    <span>
                        <Icon type={route.icon} />
                        <span>{route.name}</span>
                    </span>
                }
            >
                {route.children.map(childRoute => this.renderMenuItem(childRoute))}
            </SubMenu>
        ) : (
                <Menu.Item key={route.path}>
                    <Link to={route.path} replace onClick={this.props.toggleDrawerVisible}>
                        {
                            route.icon ? <Icon type={route.icon} /> : null
                        }
                        <span>{route.name}</span>
                    </Link>
                </Menu.Item>
            )
    };
    //菜单项按钮
    menuClick = (v) => {
        this.setState({
            selectedKeys: [v.path]
        });
    };
    //菜单展开关闭按钮
    openChange = (v) => {
        if (v.length > 1) {
            this.setState({
                openKeys: [v[v.length - 1]]
            })
        } else {
            this.setState({
                openKeys: v
            })
        }
    };

    render() {
        let menuRoutes = this.state.menuRoutes;
        //菜单是否折叠
        let collapsed = this.props.collapsed; //inline 时菜单是否收起状态
        //生成路由
        let renderMenu = menuRoutes.map(route => this.renderMenuItem(route));

        //判断菜单是否折叠，对应的打开菜单
        let openKeys = this.state.openKeys;
        const defaultProps = collapsed ? {} : { openKeys };

        // console.log(this.state.openKeys);
        // console.log(this.state.selectedKeys)

        return (
            <Menu
                className="menu-line"
                mode="inline"
                theme="light"
                inlineCollapsed={collapsed}
                selectedKeys={this.state.selectedKeys}
                {...defaultProps}
                onClick={this.menuClick}
                onOpenChange={this.openChange}
            >
                {/* 生菜菜单 */}
                {
                    renderMenu
                }
            </Menu>
        )
    }
}

export default SliderMenu;