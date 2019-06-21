import React, { Component } from 'react';

import { withRouter } from 'react-router';

import { Layout, Icon, Avatar, Popover, Modal } from 'antd';

import Notice from '../../notice';


import './index.less';

const { Header } = Layout;

class MqHeader extends Component {
    state = {
        visiblePopover: false
    }
    goLink = (url) => {
        let _this = this;
        _this.setState({
            visiblePopover: false
        },()=>{
            _this.props.history.push(url)
        });
    }

    modelLoginOut = () => {
        let _this = this;
        _this.setState({
            visiblePopover: false
        });
        Modal.confirm({
            title: '提示',
            content: `真的要注销登录吗？`,
            onOk: () => {
                //注销登录
                _this.props.logout()
            }
        })
    }

    handleVisibleChange = () => {
        this.setState({
            visiblePopover: !this.state.visiblePopover
        });
    }

    render() {

        const popoverContent = (
            <div className="icon_menu">
                <p onClick={()=>this.goLink('/home')}>
                    <span>
                        <Icon type="home" /> 首页
                    </span>
                </p>
                <p onClick={()=>this.goLink('/setting/personal')}>
                    <span>
                        <Icon type="user" /> 个人中心
                    </span>
                </p>
                <p onClick={this.modelLoginOut}>
                    <span>
                        <Icon type="export" /> 退出登录
                    </span>
                </p>
            </div>
        );


        return (
            <Header className="maqiu-header">
                <div className="header-normal">
                    <div className="left-nav">
                        <div className="logo" style={{ width: this.props.collapsed ? 70 : 190 }}>
                            <img src="images/logo.jpg" />
                        </div>
                        <Icon
                            className="pc-trigger"
                            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.props.toggleCollapsed}
                        />
                        <Icon
                            className="mobile-trigger"
                            type='pic-left'
                            onClick={this.props.toggleDrawerVisible}
                        />
                    </div>

                    {/* <Notice></Notice> */}

                    {/* pc */}
                    <div className='right_menu'>
                        <div className="icon_menu">

                            {popoverContent}

                            <Avatar
                                shape="square"
                                size="large"
                                icon="user"
                                src={this.props.userInfo.avatar}>
                            </Avatar>
                        </div>
                        {/* h5 */}
                        <Popover
                            className="mobile-popover"
                            trigger="click"
                            placement="bottomRight"
                            content={popoverContent}
                            visible={this.state.visiblePopover}
                            onVisibleChange={this.handleVisibleChange}>
                            <Avatar
                                shape="square"
                                size="large"
                                icon="user"
                                src={this.props.userInfo.avatar}>
                            </Avatar>
                        </Popover>
                    </div>
                </div>
            </Header>
        )

    }

}

export default withRouter(MqHeader);