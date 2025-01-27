import { ref, Ref, SetupContext } from '@vue/composition-api';

export type ChangeHandler<T, P extends any[]> = (value: T, ...args: P) => void;

export default function useDefaultValue<T, P extends any[]>(
  value: Ref<T>,
  defaultValue: T,
  onChange: ChangeHandler<T, P>,
  // emit 和 propsName 用于支持 .sync 语法糖。而 eventName 用于支持 @change 类型的事件
  emit: SetupContext['emit'],
  propsName: string,
  eventName: string,
): [Ref<T>, ChangeHandler<T, P>] {
  const internalValue = ref();
  internalValue.value = defaultValue;

  // 受控模式
  if (typeof value.value !== 'undefined') {
    return [
      value,
      (newValue, ...args) => {
        onChange?.(newValue, ...args);
        propsName && emit?.(`update:${propsName}`, newValue, ...args);
        eventName && emit?.(eventName, newValue, ...args);
      },
    ];
  }

  // 非受控模式
  return [
    internalValue,
    (newValue, ...args) => {
      internalValue.value = newValue;
      onChange?.(newValue, ...args);
      eventName && emit?.(eventName, newValue, ...args);
    },
  ];
}
