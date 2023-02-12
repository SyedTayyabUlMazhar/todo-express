const omitProperties = <O extends Record<string, any>, Key extends keyof O>(
  obj: O,
  ...keys: Key[]
): Omit<O, Key> => {
  for (const key of keys) delete obj[key];

  return obj;
};

const ObjectUtil = {
  omitProperties,
};

export default ObjectUtil;
