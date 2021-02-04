/*
 * @Author: your name
 * @Date: 2021-02-03 12:47:50
 * @LastEditTime: 2021-02-04 10:52:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /field-form/src/fieldContext.ts
 */

import * as React from 'react';
import { InternalFormInstance } from './interface';
const warningFunc: any = () => {
};


const Context = React.createContext<Partial<InternalFormInstance>>({
  getFieldValue: warningFunc,
  getFieldsValue: warningFunc,
  setFieldsValue: warningFunc,
  registerField: warningFunc,
  submit: warningFunc,
})

export default Context;