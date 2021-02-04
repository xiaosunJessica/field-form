/*
 * @Author: your name
 * @Date: 2021-02-03 11:31:23
 * @LastEditTime: 2021-02-04 10:47:13
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

import {
  getNamePath,
  getValue
} from './utils/valueUtil'

export class FormStore {
  
  // store用来存储表单数据，它的格式是：{"username": "sun"}
  private store: Store = {}

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
    this.store = {
      ...this.store,
      ...newStore,
    }

    this.notifyObservers(this.store)
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
  private notifyObservers = (store: Store) => {
    this.fieldEntities.forEach((entity: any) => {
      const { name } = entity.props;
      Object.keys(store).forEach(key => {
        if (key === name) {
          entity.onStoreChange();
        }
      })
    })
  }

  // 提交数据，获取store
  private submit = () => {
    console.log(this.getFieldsValue())
  }

  // 提供formStore实例方法
  public getForm = (): Partial<InternalFormInstance> => ({
    getFieldValue: this.getFieldValue,
    getFieldsValue: this.getFieldsValue,
    setFieldsValue: this.setFieldsValue,
    submit: this.submit,
    registerField: this.registerField,
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
