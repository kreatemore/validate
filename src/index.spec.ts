import {
  isEnumSubset,
  isNotEmpty,
  isNotNull,
  isNotUndefined,
  isRequired,
  isValid,
  maxLength,
  minLength,
  validate,
} from './index';

describe('validate', () => {
  it('should validate some properties', () => {
    let result = '';
    let expectedName = 'some name';
    validate<User>(
        {name: expectedName},
        {name: [name => result = name]},
    );
    expect(result).toBe(expectedName);
  });

  it('should validate multiple properties', () => {
    let finalName;
    let finalNumber;
    let numeric = 5;
    let expectedNumber = numeric * numeric;
    let expectedName = 'some name';
    validate<User>(
        {name: expectedName, age: numeric},
        {
          name: [name => finalName = name],
          age: [number => finalNumber = number * number],
        },
    );
    expect(finalName).toBe(expectedName);
    expect(finalNumber).toBe(expectedNumber);
  });

  it('should be able to validate optional properties', () => {
    let isTrue: false;
    let finalBoolean;
    validate<User>(
        {name: '', age: 0, isAdmin: isTrue},
        {
          name: [],
          age: [],
          isAdmin: [bool => finalBoolean = !bool],
        },
    );
    expect(finalBoolean).toBe(!isTrue);
  });

  it('should be able to run multiple validations against one property', () => {
    let result = '';
    let expectedName = 'some name';
    validate<User>(
        {name: expectedName},
        {
          name: [
            name => result = name,
            name => result += ` ${name}`,
          ],
        },
    );
    expect(result).toBe(`${expectedName} ${expectedName}`);
  });

  it('should skip property with no validators', () => {
    let result = '';
    let expectedName = 'some name';
    validate<User>(
        {name: expectedName},
        {},
    );
    expect(result).toBe('');
  });

  it('should contain the results in an object', () => {
    let expectedName = 'some name';
    const results = validate<User>(
        {name: expectedName, age: 3},
        {
          name: [name => !!name, name => name.length > 5],
          age: [number => number > 5],
        },
    );
    expect(results).toEqual({name: true, age: false});
  });

  it('should return true if a validation method is void', () => {
    let expectedName = 'some name';
    const results = validate<User>(
        {name: expectedName},
        {
          name: [name => {expectedName = name;}],
        },
    );
    expect(results).toEqual({name: true});
  });

  it('should return false if any of the validation methods fail', () => {
    let expectedName = 'some name';
    const results = validate<User>(
        {name: expectedName},
        {
          name: [
            name => !!name,
            name => name === 'other name',
            name => name.length > 1,
          ],
        },
    );
    expect(results).toEqual({name: false});
  });

  it('should not continue validating, if one has already failed', () => {
    const initialName = 'some name';
    let expectedName = initialName;
    const results = validate<User>(
        {name: expectedName},
        {
          name: [
            name => name === 'other name',
            () => expectedName = 'failed',
          ],
        },
    );
    expect(expectedName).toEqual(initialName);
  });
});

describe('isNotNull', () => {
  it('should fail if value is null', () => {
    const result = validate<User>(
        {name: null},
        {name: [isNotNull]},
    );
    expect(result.name).toBeFalsy();
  });

  it('should pass if value is not null', () => {
    const result = validate<User>(
        {name: 'null'},
        {name: [isNotNull]},
    );
    expect(result.name).toBeTruthy();
  });
});

describe('isNotEmpty', () => {
  it('should fail if value is an empty array', () => {
    const result = validate<User>(
        {name: 'capabilities', capabilities: []},
        {capabilities: [isNotEmpty]},
    );
    expect(result.capabilities).toBeFalsy();
  });

  it('should fail if value is an empty string', () => {
    const result = validate<User>(
        {name: ''},
        {name: [isNotEmpty]},
    );
    expect(result.name).toBeFalsy();
  });

  it('should fail if value is an empty object', () => {
    const result = validate<User>(
        {name: 'Objecto Llamas', attributes: {}},
        {attributes: [isNotEmpty]},
    );
    expect(result.attributes).toBeFalsy();
  });

  it('should pass if values has truthy lengths', () => {
    const result = validate<User>(
        {
          name: 'capabilities',
          capabilities: ['element'],
          attributes: {handsome: 'very'},
        },
        {
          name: [isNotEmpty],
          capabilities: [isNotEmpty],
          attributes: [isNotEmpty],
        },
    );
    expect(result.name).toBeTruthy();
    expect(result.capabilities).toBeTruthy();
    expect(result.attributes).toBeTruthy();
  });
});

describe('isNotUndefined', () => {
  it('should fail if value is undefined', () => {
    const result = validate<User>(
        {name: undefined},
        {name: [isNotUndefined]},
    );
    expect(result.name).toBeFalsy();
  });

  it('should pass if value is defined', () => {
    const result = validate<User>(
        {name: 'Herbert'},
        {name: [isNotUndefined]},
    );
    expect(result.name).toBeTruthy();
  });
});

describe('isRequired', () => {
  it('should fail if value is undefined', () => {
    const result = validate<User>(
        {name: undefined},
        {name: [isRequired]},
    );
    expect(result.name).toBeFalsy();
  });
  it('should fail if value is null', () => {
    const result = validate<User>(
        {name: null},
        {name: [isRequired]},
    );
    expect(result.name).toBeFalsy();
  });
  it('should fail if value is empty string', () => {
    const result = validate<User>(
        {name: ''},
        {name: [isRequired]},
    );
    expect(result.name).toBeFalsy();
  });
  it('should pass if there is a value', () => {
    const result = validate<User>(
        {name: 'John'},
        {name: [isRequired]},
    );
    expect(result.name).toBeTruthy();
  });
});

describe('minLength', () => {
  it('should fail if string is shorter than minimum length', () => {
    const result = validate<User>(
        {name: 'Shawty'},
        {name: [name => minLength(name, 20)]},
    );
    expect(result.name).toBeFalsy();
  });

  it('should fail if string is empty', () => {
    const result = validate<User>(
        {name: undefined},
        {name: [name => minLength(name, 20)]},
    );
    expect(result.name).toBeFalsy();
  });

  it('should fail if array has less items than minimum length', () => {
    const result = validate<User>(
        {name: 'Shawty', capabilities: ['user', 'admin']},
        {capabilities: [capabilities => minLength(capabilities, 3)]},
    );
    expect(result.capabilities).toBeFalsy();
  });

  it('should pass if minimum length is met', () => {
    const result = validate<User>(
        {name: 'Shawty', capabilities: ['user', 'admin']},
        {
          name: [name => minLength(name, 5)],
          capabilities: [capabilities => minLength(capabilities, 1)],
        },
    );
    expect(result.name).toBeTruthy();
    expect(result.capabilities).toBeTruthy();
  });
});

describe('maxLength', () => {
  it('should fail if string is longer than maximum length', () => {
    const result = validate<User>(
        {name: 'Shawty'},
        {name: [name => maxLength(name, 5)]},
    );
    expect(result.name).toBeFalsy();
  });

  it('should fail if string is empty', () => {
    const result = validate<User>(
        {name: undefined},
        {name: [name => maxLength(name, 20)]},
    );
    expect(result.name).toBeFalsy();
  });

  it('should fail if array has more items than maximum length', () => {
    const result = validate<User>(
        {name: 'Shawty', capabilities: ['user', 'admin']},
        {capabilities: [capabilities => maxLength(capabilities, 1)]},
    );
    expect(result.capabilities).toBeFalsy();
  });

  it('should pass if maximum length is met', () => {
    const result = validate<User>(
        {name: 'Shawty', capabilities: ['user', 'admin']},
        {
          name: [name => maxLength(name, 10)],
          capabilities: [capabilities => maxLength(capabilities, 2)],
        },
    );
    expect(result.name).toBeTruthy();
    expect(result.capabilities).toBeTruthy();
  });
});

describe('isValid', () => {
  it('should fail if any of the values are false', () => {
    const result = isValid<User>(
        {
          name: 'capabilities',
          capabilities: [],
          attributes: {handsome: 'very'},
        },
        {
          name: [isNotEmpty],
          capabilities: [isNotEmpty],
          attributes: [isNotEmpty],
        },
    );
    expect(result).toBeFalsy();
  });

  it('should pass if all the values are true', () => {
    const result = isValid<User>(
        {
          name: 'capabilities',
          capabilities: ['element'],
          attributes: {handsome: 'very'},
        },
        {
          name: [isNotEmpty],
          capabilities: [isNotEmpty],
          attributes: [isNotEmpty],
        },
    );
    expect(result).toBeTruthy();
  });
});

describe('isEnumSubset', () => {
  enum EXPECTED_CAPABILITIES {
    ADMIN = 'admin',
  }

  it('should fail if it is not one of the expectations', () => {
    const result = isValid<User>(
        {
          name: 'Cranberry Zombie',
          capabilities: ['blogger'],
        },
        {
          capabilities: [
            capability => isEnumSubset(
                capability,
                EXPECTED_CAPABILITIES,
            ),
          ],
        },
    );
    expect(result).toBeFalsy();
  });

  it('should pass if iterable is a part of the expectation', () => {
    const result = isValid<User>(
        {
          name: 'Cranberry Zombie',
          capabilities: [EXPECTED_CAPABILITIES.ADMIN],
        },
        {
          capabilities: [
            capability => isEnumSubset(
                capability,
                EXPECTED_CAPABILITIES,
            ),
          ],
        },
    );
    expect(result).toBeTruthy();
  });

  it('should pass if single value is a part of the expectation', () => {
    const result = isValid<User>(
        {name: EXPECTED_CAPABILITIES.ADMIN},
        {
          name: [name => isEnumSubset(name, EXPECTED_CAPABILITIES)],
        },
    );
    expect(result).toBeTruthy();
  });
});

interface User {
  name: string;
  age?: number;
  isAdmin?: boolean;
  capabilities?: string[];
  attributes?: { [key: string]: string };
}
