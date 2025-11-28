import { tv } from 'tailwind-variants'

type Context = {
  mobile?: boolean
  [key: string]: any
}

type ResolverValue = string | string[] | number | Resolver | undefined | null
type Resolver = (context: Context) => ResolverValue
type ResolvableObj = { [key: string]: ResolverValue | ResolvableObj }

const resolveConfig = (config: any, context: Context): any => {
  if (typeof config === 'function') {
    return resolveConfig(config(context), context)
  }
  if (Array.isArray(config)) {
    return config.map((item) => resolveConfig(item, context))
  }
  if (typeof config === 'object' && config !== null) {
    const result: any = {}
    for (const key in config) {
      result[key] = resolveConfig(config[key], context)
    }
    return result
  }
  return config
}

export const sv = (options: any) => (props: any) => {
  const resolvedOptions = resolveConfig(options, props || {})
  return tv(resolvedOptions)(props)
}
