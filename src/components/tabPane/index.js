import React, { Component } from 'react';

import { Tabs } from 'antd';

import './index.less';

const TabPane = Tabs.TabPane;


class MqTabPane extends Component{
    state={
        tabsOptions : this.props.tabsOptions,//数组
        tabActiveIndex :this.props.tabActiveIndex//当前高亮
    }
    //点击回调函数
    callback = (key)=>{
        this.props.tabPaneCallback(key);
    }
    render(){
        return(
            <div className='tabPane'>
                <Tabs 
                    defaultActiveKey={ this.state.tabActiveIndex }
                    onTabClick={this.callback}>
                    {
                        this.state.tabsOptions.map((item)=>{
                            return <TabPane 
                                        tab={ item.label } 
                                        key={ item.value }>
                                    </TabPane>
                        })
                    }
                </Tabs>
                
            </div>
        )
    }
};


export default MqTabPane;