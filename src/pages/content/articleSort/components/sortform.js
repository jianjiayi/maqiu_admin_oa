
import React, { Component } from 'react'
import { Form, Button, Input, TreeSelect, message } from 'antd';

//分装好的axios
import http from '@/api';

const FormItem = Form.Item;

const TreeNode = TreeSelect.TreeNode;

class SortForm extends Component {
    state = {
        loading: false,
        sortTreeList: [],
        showBtn: false,
        pcodeName: '顶级分类',
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
                    let pcode = _this.props.formData.pcode;
                    _this.belongToSort(_this.state.sortTreeList, parseInt(pcode));
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


    //添加分类
    addSortSubmit = (e) => {
        let _this = this;
        let userInfo = this.props.form.getFieldsValue();
        console.log(userInfo)
        this.props.form.validateFields((err, values) => {
            console.log(err)
            if (!err) {
                _this.setState({
                    showBtn: true
                });

                if (userInfo.pcode === '顶级分类') {
                    userInfo.pcode = 0;
                }

                let params = {
                    name: userInfo.name,
                    pcode: userInfo.pcode,
                    outlink: userInfo.outlink
                }
                console.log(params)

                this.props.formDataSubmit(params);

                _this.props.form.resetFields();
            }
        })
    }
    //修改form
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.file;
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
        let pcode = nextProps.formData.pcode?nextProps.formData.pcode:'0';
        this.belongToSort(this.state.sortTreeList, parseInt(pcode));
    }


    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className='article-sort-addform' >
                <Form onSubmit={this.addSortSubmit} layout="horizontal">
                    <FormItem label="分类名称">
                        {
                            getFieldDecorator('name', {
                                initialValue: this.props.formData.name,
                                getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\s+/g, "")
                                },
                                rules: [
                                    {
                                        required: true,
                                        message: '分类名称'
                                    }
                                ]
                            })(
                                <Input allowClear placeholder="请输入分类名称"></Input>
                            )
                        }
                    </FormItem>
                    <FormItem label="所属分类">
                        {
                            getFieldDecorator('pcode', {
                                initialValue: this.state.pcodeName,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择所属分类'
                                    }
                                ]
                            })(
                                <TreeSelect
                                    style={{ width: '100%' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="Please select"
                                    allowClear
                                    treeDefaultExpandAll
                                >
                                    <TreeNode
                                        value={0}
                                        title={<b style={{ color: '#48BC77' }}>顶级分类</b>}
                                        key={0}>
                                    </TreeNode>
                                    {
                                        this.state.sortTreeList.map((item) => {
                                            return this.treeSelectItem(item)
                                        })
                                    }
                                </TreeSelect>
                            )
                        }
                    </FormItem>

                    <FormItem label="外部链接">
                        {
                            getFieldDecorator('outlink', {
                                initialValue: this.props.formData.outlink,
                                getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\s+/g, "")
                                },
                                rules: [],
                            })(
                                <Input addonBefore="Http://" allowClear placeholder="请输入外部链接"></Input>
                            )
                        }
                    </FormItem>

                    <FormItem className="submit-button">
                        <Button type="primary" loading={this.props.btnLodding} onClick={this.addSortSubmit} block>提交</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(SortForm)
