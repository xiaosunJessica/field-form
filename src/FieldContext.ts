/*
 * @Author: your name
 * @Date: 2021-02-03 12:47:50
 * @LastEditTime: 2021-02-03 12:54:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /field-form/src/fieldContext.ts
 */

import * as React from 'react';
const warningFunc: any = () => {
  console.log(false, 'Can not find FormContext. Please make sure you wrap Field under Form.');
};
import { InternalFormInstance } from './interface';


 const Context = React.createContext<Partial<InternalFormInstance>>({
  getFieldValue: warningFunc,
  getFieldsValue: warningFunc,
  setFieldsValue: warningFunc,
  submit: warningFunc,
 })

 export default Context;