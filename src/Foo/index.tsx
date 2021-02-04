/*
 * @Author: your name
 * @Date: 2021-02-03 11:21:48
 * @LastEditTime: 2021-02-04 13:21:47
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
      <Form ref={this.formRef} 
        initialValues={{ username: 'strange', password: 123 }}
        onFinish={(values: any) => {
          console.log('Submit:', values);
        }}>
      	<Field name='username'>
        	<Input />
        </Field>
        <Field name='password'>
          <Input />
        </Field>
        <button onClick={() => {
          console.log(this.formRef.current.getFieldsValue())
        }}>提交</button>
       </Form>
    )
  }
}