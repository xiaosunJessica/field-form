/*
 * @Author: your name
 * @Date: 2021-02-03 11:21:48
 * @LastEditTime: 2021-02-04 11:49:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /field-form/src/Foo/index.tsx
 */
import React, { useEffect } from 'react';
import Form, { Field } from '../FormCmpt';
import Input from './input';

export default ({ title }: { title: string }) => {
  const [ form ] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({username: 'lion'})
  }, [])

  return (
    <Form form={form}>
      <Field name='username'>
        <Input placeholder='请输入姓名' />
      </Field>
      <Field name='password'>
        <Input placeholder='请输入密码' />
      </Field>
      <button onClick={() => {
        console.log(form.getFieldsValue())
      }}>提交</button>
    </Form>
  )
};
