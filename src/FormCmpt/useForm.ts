/*
 * @Author: your name
 * @Date: 2021-02-03 11:31:23
 * @LastEditTime: 2021-02-05 11:55:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /field-form/src/useForm.ts
 */

import * as React from 'react';

import type {
  Store,
  FieldEntity,
  NamePath,
  InternalNamePath,
  InternalFormInstance,
  FormInstance
} from './interface';
import { allPromiseFinish } from './utils/asyncUtil';

import {
  getNamePath,
  getValue,
  setValues
} from './utils/valueUtil'

export class FormStore {
  
  // store用来存储表单数据，它的格式是：{"username": "sun"}
  private store: Store = {}

  // 定义初始化变量
  private initialValues = {};

  // 存放回调函数
  private callbacks = {} as any;

  // 用来存储每个field的实例数据，因此在store中可以通过fieldEntities来访问每个表单项
  private fieldEntities: FieldEntity[] = [];

  //获取单个表单字段值
  private getFieldValue = (name: NamePath) => {
    const namePath: InternalNamePath = getNamePath(name);
    return getValue(this.store, namePath);
  }

  // 获取所有字段值
  private getFieldsValue = () => {
    return this.store;
  }

  // 设置字段的值
  private setFieldsValue = (newStore: Store) => {
    // 更新store的值
    const preStore = this.store;
    if (newStore) {
      this.store = setValues(this.store, newStore)
    }
    this.notifyObservers(preStore)
  }

  // 之前写一个registerField是用来设置Field实例的存储，再添加一个获取方法
  getFieldEntities = () => {
    return this.fieldEntities;
  }

  // 表单注册到fieldEntities
  private registerField = (entity: FieldEntity) => {
    console.log(entity, 'entityentityentity')
    this.fieldEntities.push(entity);
    return () => {
      this.fieldEntities = this.fieldEntities.filter((item) => item!== entity);
      // delete this.store[entity.props.name]
    }
  }

  // 监听改变
  private notifyObservers = (prevStore: Store) => {
    this.getFieldEntities().forEach((entity: any) => {
      const { onStoreChange } = entity;
      onStoreChange(prevStore, this.getFieldsValue());
    })
  }

  // 提交数据，获取store
  private submit = () => {
    this.validateFields()
    .then(values => {
      const { onFinish } = this.callbacks;
      if (onFinish) {
        try {
          onFinish(values)
          
        } catch (error) {
          console.log(error)
        }
      }
    })
    .catch(e => {
      const { onFinishFailed } = this.callbacks;
      if (onFinishFailed) {
        onFinishFailed(e);
      }
    });

  }

  // 初始化变量
  setInitialValues = (initialValues: any, init: boolean) => {
    this.initialValues = initialValues;
    if (init) {
      this.store = setValues({}, initialValues, this.store)
    }
  }

  // 提交回调
  setCallbacks = (cbs: any) => {
    this.callbacks = cbs;
  }

  // 供内部使用的相关方法集合
  getInternalHooks = () => {
    return {
      setInitialValues: this.setInitialValues,
      setCallbacks: this.setCallbacks,
    }
  }

  // 字段校验
  validateFields = () => {
    const promiseList: any = [];
    // 遍历字段实例，调用Field组件的验证方法，获取返回的promise，同时push到promiseList中
    this.getFieldEntities().forEach((field: any) => {
      const { name, rules } = field.props;
      if (!rules || !rules.length) {
        return;
      }

      const promise = field.validateRules();
      promiseList.push(promise
        .then(() => ({name, errors: []}))
        .catch((errors: any) => Promise.reject({
          name,
          errors
        }))
      )
    })
    const summaryPromise = allPromiseFinish(promiseList);
    const returnPromise = summaryPromise
      .then(() => Promise.resolve(this.getFieldsValue()))
      .catch((results) => {
        const errorList = results.filter((result: any) => result && result.errors.length);
        return Promise.reject({
          values: this.getFieldsValue(),
          errorFields: errorList,
        })
      })
    // 捕获错误
    returnPromise.catch(e => e);
      
    return returnPromise;
  }

  // 提供formStore实例方法
  public getForm = (): Partial<InternalFormInstance> => ({
    getFieldValue: this.getFieldValue,
    getFieldsValue: this.getFieldsValue,
    setFieldsValue: this.setFieldsValue,
    submit: this.submit,
    registerField: this.registerField,
    validateFields: this.validateFields,
    getInternalHooks: this.getInternalHooks
  })

}



// 创建单例formStore
export default function useForm<Values = any>(form?: FormInstance<Values>): [FormInstance<Values>|any] {
  const formRef = React.useRef<FormInstance>();
  if(!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      const formStore: FormStore = new FormStore();
      formRef.current = (formStore.getForm()) as any;
    }
  }
  return [formRef.current]
}
