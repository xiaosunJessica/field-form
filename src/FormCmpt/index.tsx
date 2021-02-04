/*
 * @Author: your name
 * @Date: 2021-02-04 10:25:14
 * @LastEditTime: 2021-02-04 10:25:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /field-form/src/Form/index.tsx
 */

import FieldForm from './Form';
import Field from './Field';
import useForm from './useForm';

const Form = FieldForm as any;
Form.Field = Field;
Form.useForm = useForm;

export { Field, useForm };

export default Form;
