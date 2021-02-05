/*
 * @Author: your name
 * @Date: 2021-02-03 11:21:48
 * @LastEditTime: 2021-02-05 11:56:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /field-form/src/Foo/index.tsx
 */
import React, { useEffect } from 'react';
import Form, { Field } from '../FormCmpt';
import Input from './input';
export default class extends React.Component {
  formRef: any = React.createRef()

  // componentDidMount() {
  //   this.formRef.current.setFieldsValue({username: 'lion'})
  // }

  render() {
    return (
      <Form 
        ref={this.formRef} 
        initialValues={{ username: 'strange', password: 123 }}
        onFinish={(value: any) => {
          console.log(value, '----valuess')
        }}>
        <Field 
          name='username'
          rules={[
            {required: true, message: '请输入用户名'}
          ]}>
        	<Input />
        </Field>
        <Field name='password'>
          <Input />
        </Field>
        <button onClick={async() => {
          const res = await this.formRef.current.validateFields()
          console.log(res, 'reeeee------ssss')
        }}>提交</button>
       </Form>
    )
  }
}