// Mock for nuqs library to avoid ESM issues in Jest

export const useQueryState = jest.fn((key: string, options?: any) => {
  const [state, setState] = jest.requireActual('react').useState(options?.defaultValue ?? null);
  return [state, setState];
});

export const useQueryStates = jest.fn((keys: Record<string, any>, options?: any) => {
  const [state, setState] = jest.requireActual('react').useState(
    Object.entries(keys).reduce((acc, [key, config]) => {
      acc[key] = config?.defaultValue ?? null;
      return acc;
    }, {} as Record<string, any>)
  );
  return [state, setState];
});

export const parseAsString = {
  parse: (value: string) => value,
  serialize: (value: string) => value,
};

export const parseAsInteger = {
  parse: (value: string) => parseInt(value, 10),
  serialize: (value: number) => value.toString(),
};

export const parseAsFloat = {
  parse: (value: string) => parseFloat(value),
  serialize: (value: number) => value.toString(),
};

export const parseAsBoolean = {
  parse: (value: string) => value === 'true',
  serialize: (value: boolean) => value.toString(),
};

export const parseAsArrayOf = (parser: any) => ({
  parse: (value: string) => value.split(',').map(parser.parse),
  serialize: (value: any[]) => value.map(parser.serialize).join(','),
});
