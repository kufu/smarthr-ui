const getTypeOf = (input: any): string => {
  if (input === null) {
    return 'null'
  } else if (typeof input === 'undefined') {
    return 'undefined'
  } else if (typeof input === 'object') {
    return Array.isArray(input) ? 'array' : 'object'
  }

  return typeof input
}

const cloneValue = (value: any): any[] | {} => {
  if (getTypeOf(value) === 'object') {
    return quickCloneObject(value)
  } else if (getTypeOf(value) === 'array') {
    return quickCloneArray(value)
  }

  return value
}

const quickCloneArray = (input: any[]) => input.map(cloneValue)

const quickCloneObject = (input: any) => {
  const output = {}

  for (const key in input) {
    if (!input.hasOwnProperty(key)) {
      continue
    }

    ;(output as any)[key] = cloneValue(input[key])
  }

  return output
}

const executeDeepMerge = (
  target: {},
  tmpObjects: any[] = [],
  tmpOtions: any = {},
) => {
  const options = {
    arrayBehaviour: tmpOtions.arrayBehaviour || 'replace',
  }

  const objects = tmpObjects.map(object => object || {})
  const output: any = target || {}

  for (const object of objects) {
    const keys = Object.keys(object)

    for (const key of keys) {
      const value = (object as any)[key]
      const type = getTypeOf(value)
      const existingValueType = getTypeOf(output[key])

      if (type === 'object') {
        if (existingValueType !== 'undefined') {
          const existingValue =
            existingValueType === 'object' ? output[key] : {}
          output[key] = executeDeepMerge(
            {},
            [existingValue, quickCloneObject(value)],
            options,
          )
        } else {
          output[key] = quickCloneObject(value)
        }
      } else if (type === 'array') {
        if (existingValueType === 'array') {
          const newValue = quickCloneArray(value)
          output[key] =
            options.arrayBehaviour === 'merge'
              ? output[key].concat(newValue)
              : newValue
        } else {
          output[key] = quickCloneArray(value)
        }
      } else {
        output[key] = value
      }
    }
  }

  return output
}

const objectAssign = (target: {}, ...objects: any[]) =>
  executeDeepMerge(target, objects)

export default objectAssign
