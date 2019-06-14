import React, { Component } from 'react';

import {Button } from 'antd';

import './index.less'
//分装好的axios
import http from '@/api';

class SystemBulletin extends Component{
    mkdirfile = ()=>{
        let params={
            filename:'2019cctv'
        }
        http.post('/special/rmdirFiles', params).then(res => {
            console.log(res);
            if (res === undefined) {
                console.log('11')
                return;
            }

            if (res.status === 200) {
                console.log(222)
            } else {
               console.log('333')
            }
        });
    }
    render(){
        return(
            <div>
                <Button onClick={this.mkdirfile}>创建一个文件夹</Button>
            </div>
        )
    }
};


export default SystemBulletin;