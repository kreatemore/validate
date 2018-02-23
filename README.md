# validate :white_check_mark:
Utility to valide objects in TypeScript

## Example

### Validating an object

```
interface User {
  name: string;
  age?: number;
  isAdmin?: boolean;
  capabilities?: string[];
  attributes?: { [key: string]: string };
}

const user = {name: 'Maximus', capabilities: [], attributes: {handsome: 'very'}};

const validationRules = {
          name: [isNotEmpty, name => minLength(name, 3)],
          capabilities: [isNotEmpty],
          attributes: [isNotEmpty],
        };

const results = validate<User>(user, validationRules);

results -> {name: true, capabilities: false, attributes: true}
```

### Checks if validation rules are conforming to the interface :policeman:

```
const user = {name: 'Maximus'};
const validationRules = {fullName: [isNotUndefined]}

                         ^^^^^
                         'fullName' doesn't exist on type
```

## Available validation methods

* `isNotNull`
  * Checks if the value is `null`
* `isNotUndefined`
  * Checks if the value is `undefined`
* `isRequired`
  * Checks if the value is truthy
* `minLength`
  * Checks if the value's length is above (or equal) the specified minimum treshold. 
  * Usage: `{propertyName: [value => minLength(value, 5)]}`
* `maxLength`
  * Checks if the value's length is below (or equal) the specified maximum treshold. 
  * Usage: `{propertyName: [value => maxLength(value, 5)]}`
* `isNotEmpty`
  * Checks if the string, array, or Object.keys()'s length is truthy
  
## Custom rules :nail_care:

Providing custom validator functions are as easy as :1234:

```
const user = {name: 'Maximus'};
const validationRules = {name: [name => name === 'Maximus', name => name !== 'Minimus']}
```

The custom validator functions should return a boolean, to be usable for validation. If the function is void, it'll return `true` as in "I found this test to be passing :thinking:".

## Contributions

Feel free to open a PR with a brief description about the changes.
Don't forget to cover your changes with (passing) tests! 

To install, clone the repo & `yarn install`.
To run tests, you can just simply type `yarn jest` in your terminal.
