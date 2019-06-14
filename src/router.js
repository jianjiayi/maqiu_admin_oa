
import React, { Component } from 'react';
import { message } from 'antd';
import { Route, Switch, Redirect, HashRouter } from 'react-router-dom';
import lazyLoad from '@/components/lazyLoad/lazyLoad';
import { connect } from 'react-redux';

//分装好的axios
import http from '@/api';


const App = lazyLoad(() => import('@/App'));

const MqLayout = lazyLoad(() => import('@/components/layout'));
const Login = lazyLoad(() => import('@/pages/login'));
const Register = lazyLoad(() => import('@/pages/register'));
const Forget = lazyLoad(() => import('@/pages/forget'));
const NotFound = lazyLoad(() => import('@/pages/notfound'))


//首页
const Home = lazyLoad(() => import('@/pages/home'));

const router = [
    {
        path:'/base/site',
        component:lazyLoad(() => import('@/pages/base/site')),
    },
    {
        path:'/base/company',
        component:lazyLoad(() => import('@/pages/base/company')), 
    },
    {
        path:'/content/article',
        component:lazyLoad(() => import('@/pages/content/article')), 
    },
    {
        path:'/content/articleSort',
        component:lazyLoad(() => import('@/pages/content/articleSort')), 
    },
    {
        path:'/content/banner',
        component:lazyLoad(() => import('@/pages/content/banner')), 
    },
    {
        path:'/content/special',
        component:lazyLoad(() => import('@/pages/content/special')), 
    },
    {
        path:'/extend/adServer',
        component:lazyLoad(() => import('@/pages/extend/adServer')), 
    },
    {
        path:'/extend/friendLink',
        component:lazyLoad(() => import('@/pages/extend/friendLink')), 
    },
    {
        path:'/notify/systemBulletin',
        component:lazyLoad(() => import('@/pages/notify/systemBulletin')), 
    },
    {
        path:'/notify/websiteMessage',
        component:lazyLoad(() => import('@/pages/notify/websiteMessage')), 
    },
    {
        path:'/organization/department',
        component:lazyLoad(() => import('@/pages/organization/department')), 
    },
    {
        path:'/organization/user',
        component:lazyLoad(() => import('@/pages/organization/user')), 
    },
    {
        path:'/setting/personal',
        component:lazyLoad(() => import('@/pages/setting/personal')), 
    },
    {
        path:'/setting/admin',
        component:lazyLoad(() => import('@/pages/setting/admin')), 
    },
    {
        path:'/setting/log',
        component:lazyLoad(() => import('@/pages/setting/log')), 
    },
    {
        path:'/setting/post',
        component:lazyLoad(() => import('@/pages/setting/post')), 
    },
]




class Router extends Component {
    state={
        loading: true,

        routeList:[],
        sliderMenus:[],
    }
    componentDidMount() {
        this.request();
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        this.request();
    }

    //ajax加载数据
    request = () => {//status:状态码，pages:查询页数
        let _this = this;
        _this.setState({
            loading: true,
        });
        let params={};
        http.get('/resource/getRoutes', params).then(res => {
            console.log(res);
            if (res === undefined) {
                // message.error('网络问题,或服务器异常，稍后重试');
                return;
            }

            if (res.status === 200) {
                //获取用户拥有的路由、侧边栏路由
                let data = res.data.data.list;
                let list = data.routerList;
                //存储路由
                let routerList = [];
                //匹配路由
                list.map((n)=>{
                    router.map((c)=>{
                        if(n.path === c.path){
                            routerList.push(c);
                            return;
                        }
                    })
                })
                //设置路由
                _this.setState({
                    routeList: routerList,
                    sliderMenus:data.sliderMenus
                },()=>{
                    _this.setState({
                        loading: false
                    })
                });
                console.log(_this.state.sliderMenus)
            } else {
                _this.setState({
                    loading: false,
                }, () => {
                    // message.error(res.data.msg);
                });
            }
        });
    }

    render() {
        
        return (
            <HashRouter>
                <App>
                    <Switch>
                        <Route path='/login' component={Login}></Route>
                        <Route path='/register' component={Register}></Route>
                        <Route path='/forget' component={Forget}></Route>
                        
                        <Route path='/' render={() =>
                            this.props.userInfo.size !== 0 ?
                                <MqLayout loading={this.state.loading} sliserMenus={this.state.sliderMenus}>
                                    <Switch>
                                        <Route path='/home' component={Home}></Route>
                                        
                                        {
                                            this.state.routeList.map((router,index)=>{
                                                return  <Route exact key={index} path={router.path} component={router.component}></Route>
                                            })
                                        }
                                        
                                        <Route component={NotFound}></Route>
                                    </Switch>
                                </MqLayout> : <Redirect to="/login"></Redirect>
                        }></Route>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}

const mapState = (state) => {
    return {
        userInfo: state.getIn(['all', 'userInfo'])
    }
}

export default connect(mapState)(Router);
