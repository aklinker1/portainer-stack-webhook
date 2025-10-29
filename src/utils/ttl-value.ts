interface TtlValue<T> {
  getValue(): T | undefined;
  setValue(value: T): void;
}

export function createTtlValue<T>(
  ttlMs: number,
  initialValue?: T,
): TtlValue<T> {
  let value: T | undefined;
  let timeout: any;

  const getValue: TtlValue<T>["getValue"] = () => value;
  const setValue: TtlValue<T>["setValue"] = (newValue) => {
    value = newValue;
    clearTimeout(timeout);
    timeout = setTimeout(() => void (value = undefined), ttlMs);
  };

  if (initialValue) {
    setValue(initialValue);
  }

  return {
    getValue,
    setValue,
  };
}
