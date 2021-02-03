/*
* @Author: your name
* @Date: 2021-02-03 12:59:40
 * @LastEditTime: 2021-02-03 13:28:00
 * @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: /field-form/src/Field.ts
*/

import * as React from 'react';
import FieldContext from './fieldContext';
import {
  FieldEntity,
  FormInstance,
  InternalNamePath,
  Meta,
  NamePath,
  NotifyInfo,
  Rule,
  Store,
  InternalFormInstance,
  StoreValue,
  EventArgs,
} from './interface';

export type ShouldUpdate<Values = any> =
  | boolean
  | ((prevValues: Values, nextValues: Values, info: { source?: string }) => boolean);


interface ChildProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: any;
}

export interface InternalFieldProps<Values = any> {
  children?:
    | React.ReactElement
    | ((control: ChildProps, meta: Meta, form: FormInstance<Values>) => React.ReactNode);
  /**
   * Set up `dependencies` field.
   * When dependencies field update and current field is touched,
   * will trigger validate rules and render.
   */
  dependencies?: NamePath[];
  getValueFromEvent?: (...args: EventArgs) => StoreValue;
  name?: InternalNamePath;
  normalize?: (value: StoreValue, prevValue: StoreValue, allValues: Store) => StoreValue;
  rules?: Rule[];
  shouldUpdate?: ShouldUpdate<Values>;
  trigger?: string;
  validateTrigger?: string | string[] | false;
  validateFirst?: boolean | 'parallel';
  valuePropName?: string;
  getValueProps?: (value: StoreValue) => object;
  messageVariables?: Record<string, string>;
  initialValue?: any;
  onReset?: () => void;
  preserve?: boolean;

  /** @private Passed by Form.List props. Do not use since it will break by path check. */
  isListField?: boolean;

  /** @private Passed by Form.List props. Do not use since it will break by path check. */
  isList?: boolean;

  /** @private Pass context as prop instead of context api
   *  since class component can not get context in constructor */
  fieldContext?: InternalFormInstance;
}

export interface FieldProps<Values = any>
  extends Omit<InternalFieldProps<Values>, 'name' | 'fieldContext'> {
  name?: NamePath;
}

export interface FieldState {
  resetCount: number;
}

export default class Field extends React.Component<InternalFieldProps, FieldState> {
  // field组件获取fieldContext
  public static contextType = FieldContext;

  private cancelRegisterFunc: any;

  // field挂载时，把职级注册到fieldContext中，也就是上面提及的fieldEntities数组中
  componentDidMount() {
    const { registerField } = this.context;
    this.cancelRegisterFunc = registerField(this)
  }

  // field数组卸载时，调用取消注册，就是从fieldEntities中删除
  componentWillUnmount() {
    if (this.cancelRegisterFunc) {
      this.cancelRegisterFunc()
    }
  }

  public onStoreChange = () => {
    this.forceUpdate()
  }

  // Field中传进来的子元素变为受控组件，也就是主动添加value和onChange方法
  getControlled = () => {
    const { name } = this.props as any;
    const { getFieldValue, setFieldsValue } = this.context;
    return {
      value: getFieldValue(name),
      onChange: (event: any) => {
        const newValue = event.target.value
        setFieldsValue({[name]: newValue})
      }
    }
  }
  
  render() {
    const {children} = this.props as any;
    return React.cloneElement(children, this.getControlled())
  }
}