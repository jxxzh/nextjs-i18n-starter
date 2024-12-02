/**
 * 深度合并两个对象
 * 1. 会创建一个新对象，不会修改原对象
 * 2. 如果两个值都是对象且不是null，则递归合并
 * 3. 如果是数组，会创建一个新的数组，并使用源对象数组的值填充，而不是合并数组
 * 4. 其他情况直接赋值
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的新对象
 */
export function deepMerge<T extends object, U>(target: T, source: U): T & U {
  // 创建目标对象的副本
  const output = { ...target } as T & U

  // 如果source不是对象或为null，直接返回target的副本
  if (!source || typeof source !== 'object') {
    return output
  }

  // 遍历源对象的所有属性
  Object.keys(source).forEach((key) => {
    const targetValue = (output as any)[key]
    const sourceValue = (source as any)[key]

    // 如果两个值都是对象且不是null，则递归合并
    if (
      targetValue && sourceValue
      && typeof targetValue === 'object' && typeof sourceValue === 'object'
      && !Array.isArray(targetValue) && !Array.isArray(sourceValue)
    ) {
      (output as any)[key] = deepMerge(targetValue, sourceValue)
    }
    // 如果是数组，创建新数组
    else if (Array.isArray(sourceValue)) {
      (output as any)[key] = [...sourceValue]
    }
    // 其他情况直接赋值
    else {
      (output as any)[key] = sourceValue
    }
  })

  return output
}
