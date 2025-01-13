/**
 * @file Tests for the statistics.js file.
 * @module test/statistics.test.js
 * @author Johan Leitet <johan.leitet@lnu.se>
 * @author Mats Loock <mats.loock@lnu.se>
 * @version 2.0.0
 */

import * as statistics from '../src/statistics.js'

// ------------------------------------------------------------------------------
//  Helpers
// ------------------------------------------------------------------------------

const ERROR_MESSAGE_NOT_AN_ARRAY = 'The passed argument is not an array.'
const ERROR_MESSAGE_NO_ELEMENTS = 'The passed array contains no elements.'
const ERROR_MESSAGE_ONLY_VALID_NUMBERS = 'The passed array may only contain valid numbers.'

const LARGE_ARRAY = Object.freeze(new Array(200_000).fill(42))

const BASE_TEST_CASES = [
  // Positive numbers.
  { input: [4, 2, 6, 1, 3, 7, 5, 3] },
  { input: [4, 8, 2, 3, 5] },
  // Negative numbers.
  { input: [-1, -2, -3, -4, -5] },
  { input: [-10, -20, -30, -40, -50, -60] },
  // Mixed numbers.
  { input: [1, -1, 2, -2, 3, -3, 4] },
  { input: [-5, 5, -10, 10, -15, 15] },
  // Zero values.
  { input: [0, 1, 2, 3, 4, 5] },
  { input: [0, 0, 0, 0, 0] },
  // Positive floating point numbers.
  { input: [1.5, 2.5, 3.5, 4.5, 5.5] },
  { input: [1.2, 3.4, 5.6, 7.8] },
  // Negative floating point numbers.
  { input: [-1.5, -2.5, -3.5, -4.5, -5.5] },
  { input: [-1.2, -3.4, -5.6, -7.8] },
  // One element.
  { input: [42] },
  { input: [-42] },
  { input: [0] },
  { input: [1.2] },
  { input: [-1.2] },
  // Large array.
  { input: LARGE_ARRAY }
]

/**
 * Tests the argument (exceptions and side effects).
 *
 * @param {Function} func - The function to test.
 */
const testArgument = (func) => {
  describe('exceptions', () => {
    test(`passing anything but an array should throw TypeError with the custom message '${ERROR_MESSAGE_NOT_AN_ARRAY}'`, () =>
      testArgumentNotAnArray(func)
    )

    test(`passing an empty array should throw Error with the custom message '${ERROR_MESSAGE_NO_ELEMENTS}'`,
      () => testArgumentNotAnEmptyArray(func))

    test(`passing an array containing a value that is not of the type number should throw TypeError with the custom message '${ERROR_MESSAGE_ONLY_VALID_NUMBERS}'`, () =>
      testArgumentArrayNotJustNumbers(func)
    )

    test(`passing an array containing the value Number.NaN should throw TypeError with the custom message '${ERROR_MESSAGE_ONLY_VALID_NUMBERS}'`, () =>
      testArgumentArrayWithNaN(func)
    )

    test(`passing a large array (${LARGE_ARRAY.length} elements) should not throw an exception`, () => {
      expect(() => { func(LARGE_ARRAY) }).not.toThrowError()
    })
  })

  describe('side effects', () => {
    test('passing [4, 2, 6, 1, 3, 7, 5, 3] should return a value and not modify the argument', () =>
      testNotModifyArgument(func)
    )
  })
}

/**
 * Tests if the specified function handles an argument
 * that is not an array correctly.
 *
 * @param {Function} func - The function to test.
 */
const testArgumentNotAnArray = (func) => {
  expect(() => {
    func(1)
    func('not an array')
    func(false)
    func(undefined)
    func({})
    func(null)
  }).toThrowWithMessage(TypeError, ERROR_MESSAGE_NOT_AN_ARRAY)
}

/**
 * Tests if the specified function handles an argument
 * that is an empty array correctly.
 *
 * @param {Function} func - The function to test.
 */
const testArgumentNotAnEmptyArray = (func) => {
  expect(() => func([])).toThrowWithMessage(Error, ERROR_MESSAGE_NO_ELEMENTS)
}

/**
 * Tests if the specified function handles an argument
 * that is an array containing a value that is not of type number correctly.
 *
 * @param {Function} func - The function to test.
 */
const testArgumentArrayNotJustNumbers = (func) => {
  expect(() => func([1, 2, 3, '4'])).toThrowWithMessage(Error, ERROR_MESSAGE_ONLY_VALID_NUMBERS)
}
/**
 * Tests if the specified function handles an argument
 * that is an array containing the value Number.NaN.
 *
 * @param {Function} func - The function to test.
 */
const testArgumentArrayWithNaN = (func) => {
  expect(() => func([1, 2, 3, Number.NaN])).toThrowWithMessage(Error, ERROR_MESSAGE_ONLY_VALID_NUMBERS)
}

/**
 * Tests if the specified function returns a value
 * without changing the argument.
 *
 * @param {Function} func - The function to test.
 */
const testNotModifyArgument = (func) => {
  const arg = [4, 2, 6, 1, 3, 7, 5, 3]
  const res = func(arg)
  switch (func.name) {
    case 'mode':
      expect(res).toBeArray()
      break

    case 'summary':
      expect(res).toBeObject()
      break

    default:
      expect(res).toBeNumber()
      expect(res).not.toBeNaN()
      break
  }
  expect(arg).toEqual([4, 2, 6, 1, 3, 7, 5, 3])
}

/**
 * Tests if the specified function returns the expected value.
 *
 * @param {Function} func - The function to test.
 * @param {number[]} testCases - The test cases.
 */
function expectToBe (func, testCases) {
  for (const testCase of testCases) {
    const arrStr = testCase.input.length < 10
      ? `[${testCase.input.join(', ')}]`
      : `[${testCase.input.slice(0, 10).join(', ')}, ...<large array>]`

    test(`passing ${arrStr} should return ${Array.isArray(testCase.expected) ? `[${testCase.expected.join(', ')}]` : testCase.expected}`, () => {
      expect(func(testCase.input)).toBe(testCase.expected)
    })
  }
}

// ------------------------------------------------------------------------------
//  average
// ------------------------------------------------------------------------------
describe('average', () => {
  describe('argument', () => testArgument(statistics.average))

  describe('return value', () => {
    const testCases = structuredClone(BASE_TEST_CASES)
    testCases[0].expected = 3.875
    testCases[1].expected = 4.4
    testCases[2].expected = -3
    testCases[3].expected = -35
    testCases[4].expected = 0.5714
    testCases[5].expected = 0
    testCases[6].expected = 2.5
    testCases[7].expected = 0
    testCases[8].expected = 3.5
    testCases[9].expected = 4.5
    testCases[10].expected = -3.5
    testCases[11].expected = -4.5
    testCases[12].expected = 42
    testCases[13].expected = -42
    testCases[14].expected = 0
    testCases[15].expected = 1.2
    testCases[16].expected = -1.2
    testCases[17].expected = 42

    expectToBe(statistics.average, testCases.slice(0, 4))
    test(`passing [${testCases[4].input}] should return ~${testCases[4].expected}`, () => {
      expect(statistics.average(testCases[4].input)).toBeCloseTo(testCases[4].expected)
    })
    expectToBe(statistics.average, testCases.slice(5))
  })
})

// ------------------------------------------------------------------------------
//  maximum
// ------------------------------------------------------------------------------
describe('maximum', () => {
  describe('argument', () => testArgument(statistics.maximum))

  describe('return value', () => {
    const testCases = structuredClone(BASE_TEST_CASES)
    testCases[0].expected = 7
    testCases[1].expected = 8
    testCases[2].expected = -1
    testCases[3].expected = -10
    testCases[4].expected = 4
    testCases[5].expected = 15
    testCases[6].expected = 5
    testCases[7].expected = 0
    testCases[8].expected = 5.5
    testCases[9].expected = 7.8
    testCases[10].expected = -1.5
    testCases[11].expected = -1.2
    testCases[12].expected = 42
    testCases[13].expected = -42
    testCases[14].expected = 0
    testCases[15].expected = 1.2
    testCases[16].expected = -1.2
    testCases[17].expected = 42

    expectToBe(statistics.maximum, testCases)
  })
})

// ------------------------------------------------------------------------------
//  median
// ------------------------------------------------------------------------------
describe('median', () => {
  describe('argument', () => testArgument(statistics.median))

  describe('return value', () => {
    const testCases = structuredClone(BASE_TEST_CASES)
    testCases[0].expected = 3.5
    testCases[1].expected = 4
    testCases[2].expected = -3
    testCases[3].expected = -35
    testCases[4].expected = 1
    testCases[5].expected = 0
    testCases[6].expected = 2.5
    testCases[7].expected = 0
    testCases[8].expected = 3.5
    testCases[9].expected = 4.5
    testCases[10].expected = -3.5
    testCases[11].expected = -4.5
    testCases[12].expected = 42
    testCases[13].expected = -42
    testCases[14].expected = 0
    testCases[15].expected = 1.2
    testCases[16].expected = -1.2
    testCases[17].expected = 42

    expectToBe(statistics.median, testCases)
  })
})

// ------------------------------------------------------------------------------
//  minimum
// ------------------------------------------------------------------------------
describe('minimum', () => {
  describe('argument', () => testArgument(statistics.minimum))

  describe('return value', () => {
    const testCases = structuredClone(BASE_TEST_CASES)
    testCases[0].expected = 1
    testCases[1].expected = 2
    testCases[2].expected = -5
    testCases[3].expected = -60
    testCases[4].expected = -3
    testCases[5].expected = -15
    testCases[6].expected = 0
    testCases[7].expected = 0
    testCases[8].expected = 1.5
    testCases[9].expected = 1.2
    testCases[10].expected = -5.5
    testCases[11].expected = -7.8
    testCases[12].expected = 42
    testCases[13].expected = -42
    testCases[14].expected = 0
    testCases[15].expected = 1.2
    testCases[16].expected = -1.2
    testCases[17].expected = 42

    expectToBe(statistics.minimum, testCases)
  })
})

// ------------------------------------------------------------------------------
//  mode
// ------------------------------------------------------------------------------
describe('mode', () => {
  describe('argument', () => testArgument(statistics.mode))

  describe('return value', () => {
    const testCases = [
      // Positive values, single mode.
      { input: [1, 2, 3, 1, 4], expected: [1] },
      // Negative values, single mode.
      { input: [-3, -1, -3, -2, -10, -1, -3], expected: [-3] },
      // Positive values, multiple modes.
      { input: [9, 1, 4, 3, 4, 9], expected: [4, 9] },
      // Positive values, multiple modes.
      { input: [4, 8, 2, 3, 5, 2, 8, 1, 1, 10, 10], expected: [1, 2, 8, 10] },
      // Mixed values, multiple modes.
      { input: [-2, 5, 1, 1, 5, 5, 2, -2, 2, -2], expected: [-2, 5] },
      // Positive values, single mode.
      { input: [5, 1, 5, 1, 5], expected: [5] },
      // Positive floating point values, single mode.
      { input: [5.3, 5.3, 1.9, 1.9, 5.3], expected: [5.3] },
      // Mixed values, multiple modes.
      { input: [3, 5, 2, -5, 9, 2, -5, 5, 10, 4, 1, 0, -1, 9, 0], expected: [-5, 0, 2, 5, 9] },
      // Positive value, without any mode.
      { input: [42], expected: undefined },
      // All the same positive values, without any mode.
      { input: [1, 1, 1, 1, 1], expected: undefined },
      // Positive values occurs once, without any mode.
      { input: [1, 2, 3, 4, 5], expected: undefined },
      // Positive values occurs three times each, without any mode.
      { input: [5, 1, 1, 5, 5, 1], expected: undefined },
      // Large array.
      { input: Object.freeze(Array.from({ length: 200_000 }, () => 42)), expected: undefined }
    ]

    for (const testCase of testCases) {
      const arrStr = testCase.input.length < 10
        ? `[${testCase.input.join(', ')}]`
        : `[${testCase.input.slice(0, 10).join(', ')}, ...<large array>]`

      test(`passing ${arrStr} should return ${Array.isArray(testCase.expected) ? `[${testCase.expected.join(', ')}]` : testCase.expected}`, () => {
        expect(statistics.mode(testCase.input)).toEqual(testCase.expected)
      })
    }
  })
})

// ------------------------------------------------------------------------------
//  range
// ------------------------------------------------------------------------------
describe('range', () => {
  describe('argument', () => testArgument(statistics.range))

  describe('return value', () => {
    const testCases = structuredClone(BASE_TEST_CASES)
    testCases[0].expected = 6
    testCases[1].expected = 6
    testCases[2].expected = 4
    testCases[3].expected = 50
    testCases[4].expected = 7
    testCases[5].expected = 30
    testCases[6].expected = 5
    testCases[7].expected = 0
    testCases[8].expected = 4
    testCases[9].expected = 6.6
    testCases[10].expected = 4
    testCases[11].expected = 6.6
    testCases[12].expected = 0
    testCases[13].expected = 0
    testCases[14].expected = 0
    testCases[15].expected = 0
    testCases[16].expected = 0
    testCases[17].expected = 0

    expectToBe(statistics.range, testCases)
  })
})

// ------------------------------------------------------------------------------
//  standardDeviation
// ------------------------------------------------------------------------------
describe('standardDeviation', () => {
  describe('argument', () => testArgument(statistics.standardDeviation))

  describe('return value', () => {
    const testCases = structuredClone(BASE_TEST_CASES)
    testCases[0].expected = 1.90
    testCases[1].expected = 2.06
    testCases[2].expected = 1.41
    testCases[3].expected = 17.08
    testCases[4].expected = 2.44
    testCases[5].expected = 10.80
    testCases[6].expected = 1.71
    testCases[7].expected = 0
    testCases[8].expected = 1.41
    testCases[9].expected = 2.46
    testCases[10].expected = 1.41
    testCases[11].expected = 2.46
    testCases[12].expected = 0
    testCases[13].expected = 0
    testCases[14].expected = 0
    testCases[15].expected = 0
    testCases[16].expected = 0
    testCases[17].expected = 0

    for (const testCase of testCases) {
      const arrStr = testCase.input.length < 10
        ? `[${testCase.input.join(', ')}]`
        : `[${testCase.input.slice(0, 10).join(', ')}, ...<large array>]`

      test(`passing ${arrStr} should return ${testCase.expected}`, () => {
        expect(statistics.standardDeviation(testCase.input)).toBeCloseTo(testCase.expected)
      })
    }
  })
})

// ------------------------------------------------------------------------------
//  summary
// ------------------------------------------------------------------------------
describe('summary', () => {
  describe('argument', () => testArgument(statistics.summary))

  describe('return value', () => {
    test('passing [0] should return an object with the properties average, maximum, median, minimum, mode, range, standardDeviation', () => {
      const result = statistics.summary([0])
      expect(Object.keys(result).length).toBe(7)
      expect(result)
        .toHaveProperty('average')
        .toHaveProperty('maximum')
        .toHaveProperty('median')
        .toHaveProperty('minimum')
        .toHaveProperty('mode')
        .toHaveProperty('range')
        .toHaveProperty('standardDeviation')
    })

    test('passing [42] should return {average: 42, maximum: 42, median: 42, minimum: 42, mode: undefined, range: 0, standardDeviation: 0}', () => {
      expect(statistics.summary([42])).toEqual({
        average: 42,
        maximum: 42,
        median: 42,
        minimum: 42,
        mode: undefined,
        range: 0,
        standardDeviation: 0
      })
    })

    const input = [4, 2, 6, 1, 3, 7, 5, 3]
    test(`passing [${input.join(', ')}] should return {average: 3.875, max: 7, median: 3.5, min: 1, mode: [3], range: 6, standardDeviation: 1.8998}`, () => {
      // Get the summary and round standard deviation to 4 decimals.
      const summary = statistics.summary(input)
      summary.standardDeviation =
           Math.round(summary.standardDeviation * 10_000 + Number.EPSILON) / 10_000

      expect(summary).toEqual({
        average: 3.875,
        maximum: 7,
        median: 3.5,
        minimum: 1,
        mode: [3],
        range: 6,
        standardDeviation: 1.8998
      })
    })
  })
})
