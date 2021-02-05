/*
* @Author: your name
* @Date: 2021-02-03 12:59:40
 * @LastEditTime: 2021-02-05 11:27:55
 * @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: /field-form/src/Field.ts
*/

import * as React from 'react';
import FieldContext from './FieldContext';
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
import RawAsyncValidator from 'async-validator';

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

export default class Field extends React.Component<FieldProps, FieldState> {
  // field组件获取fieldContext
  static contextType = FieldContext;

  private cancelRegisterFunc: any;

  private validatePromise: Promise<string[]> | null = null;

  private errors: string[] = [];

  // field挂载时，把职级注册到fieldContext中，也就是上面提及的fieldEntities数组中
  componentDidMount() {
    console.log(this.context, 'this.contextthis.context- componentDidMount -')
    const { registerField } = this.context;
    this.cancelRegisterFunc = registerField(this)
  }

  // field数组卸载时，调用取消注册，就是从fieldEntities中删除
  componentWillUnmount() {
    if (this.cancelRegisterFunc) {
      this.cancelRegisterFunc()
    }
  }

  public onStoreChange = (prevStore: any, curStore: any) => {
    const { shouldUpdate } = this.props as any;
    if (typeof shouldUpdate === 'function') {
      if (shouldUpdate(prevStore, curStore)) {
        this.forceUpdate()
      }
    } else {
      this.forceUpdate()
    }
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

  // Field组件根据rules校验函数
  validateRules = () => {
    const { getFieldValue } = this.context;
    const { name } = this.props as any;
    const currentValue = getFieldValue(name);

    // async-validator库的校验结果是Promise
    const rootPromise = Promise.resolve()
    .then(() => {
      // 获取rules规则
      let filteredRules = this.getRules();
      // 获取执行校验结果是Promise
      const promise = this.executeValidate(name, currentValue, filteredRules);

      promise
      .catch((e: any) => e)
      .then((errors: string[] = []) => {
        if (this.validatePromise === rootPromise) {
          this.validatePromise = null;
          this.errors = errors;
          this.forceUpdate();
        }
      })
      return promise;
    })

    this.validatePromise = rootPromise;
    return rootPromise;
  }

  // 获取rules校验结果
  public getRules = () => {
    const { rules } = this.props as any;
    return rules.map((rule: any) => {
      if (typeof rule === 'function') {
        return rule(this.context)
      }
      return rule
    })
  }

  // 执行规则校验
  executeValidate = (namePath: any, value: any, rules: any) => {
    let summaryPromise: Promise<string[]>;
    summaryPromise = new Promise(async (resolve, reject) => {
      // 多个规则遍历校验，只要其中一条规则校验失败，就不用继续，返回错误
      for (let i = 0; i < rules.length; i++) {
        const errors = await this.validateRule(namePath, value, rules[i]);
        if (errors.length) {
          reject(errors)
          return;
        }
      }
      resolve([])
    })
    return summaryPromise
  } 

  // 对单条规则进行校验的方法
  validateRule = async (name: any, value: any, rule: any) => {
    const cloneRule = { ...rule };

    const validator = new RawAsyncValidator({
      [name]: [cloneRule]
    })

    let result = [];
    try {
      await Promise.resolve(validator.validate({[name]: value}))
    } catch (error) {
      if (error.errors) {
        result = error.errors.map((e: any) => e.message)
      }
    }

    return result;
  }

  
  render() {
    const {children} = this.props as any;
    return React.cloneElement(children, this.getControlled())
  }
}