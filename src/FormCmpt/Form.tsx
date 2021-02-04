/*
* @Author: your name
* @Date: 2021-02-03 12:51:34
 * @LastEditTime: 2021-02-04 11:47:29
 * @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: /field-form/src/Form.tsx
*/

import * as React from 'react';
import useForm from './useForm';
import FieldContext from './FieldContext';
import { FormInstance } from './interface';

const Form: React.ForwardRefRenderFunction<FormInstance, {}> = ({
  form,
  children,
  ...restProps
}: any,
ref,) => {
  const [ formInstance ] = useForm(form) as any;
  return (
    <form
      {...restProps}>
      <FieldContext.Provider value={formInstance}>
        {children}
      </FieldContext.Provider>
    </form>
  )
}

export default Form;
