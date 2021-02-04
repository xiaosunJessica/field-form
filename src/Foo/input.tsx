/*
 * @Author: your name
 * @Date: 2021-02-04 10:31:20
 * @LastEditTime: 2021-02-04 10:31:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /field-form/src/Foo/input.tsx
 */
import React from 'react';

export default (props: any) => {
  const { value = '', onChange, ...restProps } = props;
  return <input {...restProps} value={value} onChange={onChange} />;
};