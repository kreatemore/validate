export function isValid<T extends { [key: string]: any }>(
    testSubject: T,
    validators: {[K in keyof Partial<T>]: Function[]},
): boolean {
  const result = validate(testSubject, validators);
  const testedProperties = Object.keys(validators);
  const passingTests = testedProperties
      .map(property => result[property])
      .filter(isPassingTest => !!isPassingTest);

  return passingTests.length === testedProperties.length;
}

export function validate<T extends { [key: string]: any }>(
    testSubject: T,
    validators: {[K in keyof Partial<T>]: Function[]},
): {[K in keyof Partial<T>]: boolean} {

  const results = {} as {[K in keyof Partial<T>]: boolean};
  const propertiesToTest = Object.keys(validators);

  propertiesToTest.forEach((property: string) => {
    let isValid = true;
    const propertyUnderTest = testSubject[property];
    const propertyValidators = validators[property];

    while (isValid && propertyValidators.length > 0) {
      const validate = propertyValidators.shift();
      const result = validate(propertyUnderTest);
      const isTestFunctionVoid = typeof result === 'undefined';

      isValid = isTestFunctionVoid ? isValid : result;
    }

    results[property] = isValid;
  });

  return results;
}

export function isNotNull(value: any | null): boolean {
  return value !== null;
}

export function isNotEmpty(value: any[] | string | object): boolean {
  let isNotEmpty = false;

  if (value instanceof Object && value.constructor === Object) {
    isNotEmpty = !!Object.keys(value).length;
  } else if (isTruthy(value)) {
    isNotEmpty = !!(value as any[] | string).length;
  }

  return isNotEmpty;
}

export function isNotUndefined(value: any | undefined): boolean {
  return typeof value !== 'undefined';
}

export function isTruthy(value: any | null | undefined): boolean {
  return !!value;
}

export function isRequired(value: any | null | undefined): boolean {
  return isTruthy(value);
}

function getLength(value: any[] | string): number {
  return isNotEmpty(value) ? value.length : NaN;
}

export function minLength(value: any[] | string, minLength: number): boolean {
  return getLength(value) >= minLength;
}

export function maxLength(value: any[] | string, maxLength: number): boolean {
  return getLength(value) <= maxLength;
}

export function isEnumSubset(
    values: string | string[],
    enumerable: EnumWithNumericKeys | EnumWithStringKeys,
): boolean {
  const acceptableValues = Object.keys(enumerable)
      .map(key => enumerable[key]);
  const actualValues = Array.isArray(values) ? values : [values];
  const noValuesOutsideOfEnum = 0;

  return actualValues.map(value => acceptableValues.indexOf(value) > -1)
      .filter(result => !result)
      .length === noValuesOutsideOfEnum;
}

type EnumWithStringKeys = { [id: string]: string };
type EnumWithNumericKeys = { [id: number]: string };