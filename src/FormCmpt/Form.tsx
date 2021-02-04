/*
* @Author: your name
* @Date: 2021-02-03 12:51:34
 * @LastEditTime: 2021-02-04 13:21:10
 * @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: /field-form/src/Form.tsx
*/

import React, { useRef} from 'react';
import useForm from './useForm';
import FieldContext from './FieldContext';
import {
  Store,
  FormInstance,
  FieldData,
  ValidateMessages,
  Callbacks,
  InternalFormInstance,
} from './interface';

type BaseFormProps = Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>;

type RenderProps = (values: Store, form: FormInstance) => JSX.Element | React.ReactNode;
export interface FormProps<Values = any> extends BaseFormProps {
  initialValues?: Store;
  form?: FormInstance<Values>;
  children?: RenderProps | React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: false | string | React.FC<any> | React.ComponentClass<any>;
  fields?: FieldData[];
  name?: string;
  validateMessages?: ValidateMessages;
  onValuesChange?: Callbacks<Values>['onValuesChange'];
  onFieldsChange?: Callbacks<Values>['onFieldsChange'];
  onFinish?: Callbacks<Values>['onFinish'];
  onFinishFailed?: Callbacks<Values>['onFinishFailed'];
  validateTrigger?: string | string[] | false;
  preserve?: boolean;
}

const Form: any = React.forwardRef(({
  form,
  children,
  initialValues,
  onFinish,
  ...restProps
}: any,
ref,) => {
  // const formContext: FormContextProps = React.useContext(FieldContext);
  const [ formInstance ] = useForm(form) as any;

  console.log(formInstance.getInternalHooks(), 'formInstance.getInternalHooks()')
  const { setInitialValues, setCallbacks } = formInstance.getInternalHooks();

  //第一次渲染时， setInitialValues第二个参数时true, 表示初始化，之后的为false
  const mountRef = useRef(null) as any;
  setInitialValues(initialValues, !mountRef.current);
  if (!mountRef.current) {
    mountRef.current = true;
  }

  // 获取外部传入的onFinish，注册到callbacks中，通过submit时会执行它
  setCallbacks({
    onFinish
  })
  React.useImperativeHandle(ref, () => formInstance);

  return (
    <form
      {...restProps}>
      <FieldContext.Provider value={formInstance}>
        {children}
      </FieldContext.Provider>
    </form>
  )
})

export default Form;
