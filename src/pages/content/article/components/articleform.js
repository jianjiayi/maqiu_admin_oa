import React, { Component } from 'react';

import { Form, Button, Input, Spin, Modal, message, Icon, Radio, DatePicker, TreeSelect } from 'antd'
import moment from 'moment';
import 'moment/locale/zh-cn';

import UploadCropper from '@/components/upload/cropper';


import BraftEditor from '@/components/braftEditor/index2.js';

import './index.less';
import '@/assets/less/form.less';

//分装好的axios
import http from '@/api';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const TreeNode = TreeSelect.TreeNode;

moment.locale('zh-cn');

class ArticleEditForm extends Component {
    state = {
        loading: false,
        showBtn: false,
        sortTreeList: [],
        pcodeName:'',
        picList: this.props.formData.pics,
    }

    onRef = (ref) => {
        this.child = ref
    }

    componentDidMount() {
        this.request();
    }
    //ajax加载数据
    request = () => {//status:状态码，pages:查询页数
        let _this = this;
        _this.setState({
            loading: true,
        });
        let params = {
            pcode: 0,//默认查询顶级分类
            status: 1//所有状态启动台
        }
        http.post('/sort/list', params).then(res => {
            console.log(res);
            if (res === undefined) {
                message.error('网络问题,或服务器异常，稍后重试');
                return;
            }

            if (res.status === 200) {
                let listData = res.data.data.listData;
                _this.setState({
                    sortTreeList: listData,
                    loading: false
                },()=>{
                    let pcode = _this.props.formData.contentSortId;
                    _this.belongToSort(_this.state.sortTreeList, parseInt(pcode));
                    _this.picsList(_this.props.formData.pics);
                });
            } else {
                _this.setState({
                    loading: false,
                }, () => {
                    message.error(res.data.msg);
                });
            }
        });
    }

    //生成控件树list
    treeSelectItem = (item) => {
        return item.children ? (
            <TreeNode
                value={item.id}
                title={item.name}
                key={item.id}
            >
                {item.children.map(childItem => this.treeSelectItem(childItem))}
            </TreeNode>
        ) : (
                <TreeNode
                    value={item.id}
                    title={item.name}
                    key={item.id}>

                </TreeNode>
            )
    };

    //查询所属分类上一级
    belongToSort = (listdata, pcode) => {
        let _this = this;
        if(pcode===0){
            _this.setState({
                pcodeName: '顶级分类'
            })
            return;
        }
        listdata.map((item) => {
            if (item.id === pcode) {
                _this.setState({
                    pcodeName: item.name
                })
                return;
            }
            if (item.children) {
                this.belongToSort(item.children, pcode)
            }
        })
    }

    //传递的组件参数改变是调用
    componentWillReceiveProps(nextProps){
        console.log(nextProps)
        let pcode = nextProps.formData.contentSortId?nextProps.formData.contentSortId:'0';
        this.belongToSort(this.state.sortTreeList, parseInt(pcode));
        let picStr = nextProps.formData.pics;
        this.setState({
            picList: picStr
        })

    }

    //生成缩略图列表
    picsList = (str) => {
        if (str !== '' && str !== undefined) {
            //去掉最后一个逗号
            let newStr = str.substring(0, str.length - 1);
            return newStr.split(',');
        } else {
            return [];
        }
    }

    //获取裁切图上传服务器后url
    getCropperImagesUrl = (url) => {
        let _this = this;
        let picsStr = this.state.picList + url + ',';
        _this.setState({
            picList: picsStr
        })
    }

    //删除图片
    deleteCroperImages = (src) => {
        let _this = this;
        //执行删除、更新视图操作
        let data = _this.picsList(_this.state.picList);
        data.splice(data.findIndex(item => item === src), 1)
        if(data.length!==0){
            _this.setState({
                picList: data.join(',')+','
            });
        }else{
            _this.setState({
                picList: ''
            });
        }
        
    }

    handleSubmit = () => {
        let _this = this;
        //获取富文本内容
        let contentText = _this.child.submitContent();
        let articleInfo = _this.props.form.getFieldsValue()
        console.log(articleInfo)
        this.props.form.validateFields((err, values) => {
            console.log(err)
            if (!err) {
                _this.setState({
                    showBtn: true
                });


                let params = {
                    contentSortId: articleInfo.contentSortId,//栏目编号**
                    title: articleInfo.title,//标题**
                    subtitle: articleInfo.subtitle,//副标题**
                    author: articleInfo.author,//作者**
                    source: articleInfo.source,//来源
                    outlink: articleInfo.outlink,//外部链接
                    date: moment(articleInfo.date).format('YYYY-MM-DD HH:mm:ss'),//发布日期**
                    pics: _this.state.picList,//缩略图**
                    content: contentText,//详情
                    tags: articleInfo.tags,//关键字
                    description: articleInfo.description,//描述
                    keywords: articleInfo.keywords,//关键词
                }
                console.log(params)

                this.props.updateSubmit(params);
            }
        })
    }


    render() {
        const { getFieldDecorator } = this.props.form;

        //时间选择器
        const range = (start, end) => {
            const result = [];
            for (let i = start; i < end; i++) {
                result.push(i);
            }
            return result;
        }
        const disabledDate = (current) => {
            // Can not select days before today and today
            return current && current < moment().endOf('day');
        }

        const disabledDateTime = () => {
            return {
                disabledHours: () => range(0, 24).splice(4, 20),
                disabledMinutes: () => range(30, 60),
                disabledSeconds: () => [55, 56],
            };
        }
        return (
            <div className="article">
                <Spin tip="加载中" spinning={this.state.loading} indicator={<Icon type="minus" spin />}>
                    <Form>
                        <FormItem label="标题">
                            {
                                getFieldDecorator('title', {
                                    initialValue: this.props.formData.title,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '标题不能为空'
                                        },
                                    ]
                                })(<Input placeholder="请输入标题"></Input>)
                            }
                        </FormItem>
                        <FormItem label="副标题">
                            {
                                getFieldDecorator('subtitle', {
                                    initialValue: this.props.formData.subtitle,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: '副标题不能为空'
                                        },
                                    ]
                                })(<Input placeholder="请输入副标题"></Input>)
                            }
                        </FormItem>

                        <FormItem label="发布日期">
                            {
                                getFieldDecorator('date', {
                                    initialValue: this.props.formData.date,
                                    rules: [{
                                        required: true,
                                    }]
                                })(<DatePicker
                                    placeholder="请选择发布日期"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    disabledDate={disabledDate}
                                    disabledTime={disabledDateTime}
                                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                ></DatePicker>)
                            }
                        </FormItem>

                        <FormItem label="文章分类">
                            {
                                getFieldDecorator('contentSortId', {
                                    initialValue: this.state.pcodeName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择文章分类'
                                        }
                                    ]
                                })(
                                    <TreeSelect
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        placeholder="请选择文章分类"
                                        allowClear
                                        treeDefaultExpandAll
                                    >
                                        {
                                            this.state.sortTreeList.map((item) => {
                                                return this.treeSelectItem(item)
                                            })
                                        }
                                    </TreeSelect>
                                )
                            }
                        </FormItem>

                        <FormItem label="来源">
                            {
                                getFieldDecorator('source', {
                                    initialValue: this.props.formData.source,
                                    rules: []
                                })(<RadioGroup>
                                    <Radio value="1">原创</Radio>
                                    <Radio value="2">转发</Radio>
                                </RadioGroup>)
                            }
                        </FormItem>
                        <div>
                            {
                                this.props.form.getFieldValue('source') === '1' ?
                                    <FormItem label="作者">
                                        {
                                            getFieldDecorator('author', {
                                                initialValue: this.props.formData.author,
                                                getValueFromEvent: (event) => {
                                                    return event.target.value.replace(/\s+/g, "")
                                                },
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '作者不能为空'
                                                    },
                                                ]
                                            })(<Input placeholder="请输入文章作者"></Input>)
                                        }
                                    </FormItem> :
                                    <FormItem label="外部链接">
                                        {
                                            getFieldDecorator('outlink', {
                                                initialValue: this.props.formData.outlink,
                                                getValueFromEvent: (event) => {
                                                    return event.target.value.replace(/\s+/g, "")
                                                },
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '链接地址不能为空'
                                                    },
                                                ],
                                            })(
                                                <Input addonBefore="Http://" allowClear placeholder="请输入外部链接"></Input>
                                            )
                                        }
                                    </FormItem>
                            }
                        </div>

                        <FormItem className="middle-flex-start" label="上传缩略图">
                            {
                                getFieldDecorator('pics', {
                                    initialValue: this.state.picList,
                                    rules: []
                                })(<div className='pics-list'>
                                    <div className='content'>
                                        {
                                            this.picsList(this.state.picList).map((item, index) => {
                                                return <div className='avatar' key={index}>
                                                    <img src={item}></img>
                                                    <Icon className='delete' type="close-circle" onClick={() => { this.deleteCroperImages(item) }} />
                                                </div>
                                            })

                                        }
                                    </div>
                                    {
                                        this.picsList(this.state.picList).length < 3 ?
                                            <UploadCropper
                                                UploadVisible={true}
                                                aspectRatio={1 / 1}
                                                getCropperImagesUrl={this.getCropperImagesUrl}
                                            ></UploadCropper> : ''
                                    }

                                </div>)
                            }
                        </FormItem>


                        <FormItem label="tags">
                            {
                                getFieldDecorator('tags', {
                                    initialValue: this.props.formData.tags,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: []
                                })(<TextArea rows={4} placeholder="请输入文章的tag，英文逗号隔开"></TextArea>)
                            }
                        </FormItem>

                        <FormItem label="SEO关键字">
                            {
                                getFieldDecorator('keywords', {
                                    initialValue: this.props.formData.keywords,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: []
                                })(<Input placeholder="输入内容页的SEO关键字"></Input>)
                            }
                        </FormItem>

                        <FormItem label="SEO描述">
                            {
                                getFieldDecorator('description', {
                                    initialValue: this.props.formData.description,
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(/\s+/g, "")
                                    },
                                    rules: []
                                })(<TextArea rows={4} placeholder="请输入内容页SEO描述"></TextArea>)
                            }
                        </FormItem>


                        <FormItem className="middle-flex-start form-editor" label="文章详情">
                            {
                                getFieldDecorator('content', {
                                    initialValue: '',
                                    rules: []
                                })(<BraftEditor 
                                    onRef={this.onRef}
                                    htmlContent={this.props.formData.content}></BraftEditor>)
                            }
                        </FormItem>

                        <FormItem className="submit-button">
                            <Button type="primary" loading={this.state.showBtn} block onClick={this.handleSubmit}>提交</Button>
                        </FormItem>
                    </Form>
                </Spin>
            </div>
        )
    }
};


export default Form.create()(ArticleEditForm);