type TMaskOptions = {
  translation: {[key in '9' | 'A' | 'S' | '*']: (v: string) => string};
  invalidValues: Array<string | null | undefined>;
};

const defaultOptions: TMaskOptions = {
  translation: {
    '9': function (val) {
      return val.replace(/[^0-9]+/g, '');
    },
    A: function (val) {
      return val.replace(/[^a-zA-Z]+/g, '');
    },
    S: function (val) {
      return val.replace(/[^a-zA-Z0-9]+/g, '');
    },
    '*': function (val) {
      return val;
    },
  },
  invalidValues: [null, undefined, ''],
};

export class Mask {
  private options: TMaskOptions & {pattern: string};

  private handlers: Array<((v: string) => string) | string>;

  constructor(pattern: string, options: TMaskOptions = defaultOptions) {
    const opt = options || {};
    this.options = {
      translation: Object.assign(defaultOptions.translation, opt.translation),
      invalidValues: Object.assign(
        defaultOptions.invalidValues,
        opt.invalidValues,
      ),
      pattern: pattern,
    };

    this.handlers = [];

    for (let i = 0; i < pattern.length; i++) {
      const element: string = pattern[i];
      let result: (typeof this.handlers)[0];

      if (
        element === '9' ||
        element === 'A' ||
        element === 'S' ||
        element === '*'
      ) {
        result = this.options.translation[element];
      } else {
        result = element;
      }
      this.handlers.push(result);
    }
  }

  mask(value: string): string {
    var result = '';

    var val = String(value);

    if (val.length === 0) {
      return '';
    }

    var maskSize = this.handlers.length;
    var maskResolved = 0;

    var valueResolved = 0;

    while (maskResolved < maskSize) {
      var hand = this.handlers[maskResolved];
      var char = val[valueResolved];

      if (char === undefined) {
        break;
      }

      if (char === hand) {
        result += char;
        maskResolved++;
        valueResolved++;
        continue;
      }

      if (this.isString(hand)) {
        result += hand;
        maskResolved++;
        continue;
      }

      var parsed = hand(char);

      if (this.options.invalidValues.indexOf(parsed) < 0) {
        result += parsed;
        valueResolved++;
      } else {
        break;
      }

      maskResolved++;
    }

    return result;
  }

  private isString(value: any): value is string {
    return typeof value === 'string';
  }
}
