/**
 * @file Module for obtaining statistical analysis about a set of data.
 * @module src/statistics
 * @author Johan Leitet <johan.leitet@lnu.se>
 * @author Mats Loock <mats.loock@lnu.se>
 * @author // Beatriz Sanssi <bs222eh@student.lnu.se>
 * @version 2.0.0
 */

// ------------------------------------------------------------------------------
//  Type definitions
// ------------------------------------------------------------------------------

/**
 * Represents statistical summary.
 *
 * @typedef {object} StatisticalSummary
 * @property {number} average - The average value.
 * @property {number} maximum - The maximum value.
 * @property {number} median - The median value.
 * @property {number} minimum - The minimum value.
 * @property {number[]|undefined} mode - The mode value.
 * @property {number} range - The range value.
 * @property {number} standardDeviation - The standard deviation value.
 */

// ------------------------------------------------------------------------------
//  Public interface
// ------------------------------------------------------------------------------

// TODO: Write your code here.

/**
 * Validates an array of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @throws {TypeError} The passed argument is not an array.
 * @throws {Error} The passed array contains no elements.
 * @throws {TypeError} The passed array may only contain valid numbers.
 */
function validateArray (numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError('The passed argument is not an array.')
  } else if (numbers.length === 0) {
    throw new Error('The passed array contains no elements.')
  } else if (numbers.some(element => typeof element !== 'number' || isNaN(element))) {
    throw new TypeError('The passed array may only contain valid numbers.')
  }
}

/**
 * Sorts an array of numbers in ascending order.
 *
 * @param {number[]} numbers - The array of numbers to sort.
 * @returns {number[]} The sorted array of numbers.
 */
function toSort (numbers) {
  return numbers.toSorted((a, b) => a - b)
}

/**
 * Returns the average value from a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @returns {number} The average value.
 */
// Validate the array.
export function average (numbers) {
  validateArray(numbers)

  // Calculate and return average value.
  const sum = numbers.reduce((sum, number) => sum + number, 0)

  return sum / numbers.length
}

/**
 * Returns the maximum value from a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @returns {number} The maximum value.
 */
// Validate the array
export function maximum (numbers) {
  validateArray(numbers) // Check if the array is valid.

  // Calculate and return maximum value.
  const maximumValue = numbers.reduce((maximum, currentValue) => Math.max(maximum, currentValue), numbers[0])

  return maximumValue
}

/**
 * Returns the median value from a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @returns {number} The maximum value.
 */
// Validate the array
export function median (numbers) {
  validateArray(numbers) // Check if the array is valid.
  toSort(numbers) // Sort the array.

  // Calculate and return median value.
  const sortedValues = toSort(numbers)
  const middle = Math.floor(sortedValues.length / 2)

  if (sortedValues.length % 2 === 0) {
    // If the array has an even length, average the two middle values.
    const median = (sortedValues[middle - 1] + sortedValues[middle]) / 2

    return median
  } else {
    // If the array has an odd length, return the middle value.
    return sortedValues[middle]
  }
}

/**
 * Returns the minimum value from a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @returns {number} The maximum value.
 */
// Validate the array.
export function minimum (numbers) {
  validateArray(numbers) // Check if the array is valid.

  // Calculate and return minimum value.
  const minimumValue = numbers.reduce((minimum, currentValue) => Math.min(minimum, currentValue), numbers[0])

  return minimumValue
}

/**
 * Returns the mode value from a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @returns {number} The maximum value.
 */
// Validate the array.
export function mode (numbers) {
  validateArray(numbers)

  // Create a map to count the occurrences of each number.
  const frequencyValues = new Map()
  for (const number of numbers) {
    frequencyValues.set(number, (frequencyValues.get(number) || 0) + 1)
  }

  // Convert the frequency map to an array of key-value pairs, then sort it.
  const sortedFrequency = [...frequencyValues.entries()].sort((a, b) => {
    // Sort by frequency, descending.
    const frequencyComparison = b[1] - a[1]

    if (frequencyComparison !== 0) {
      return frequencyComparison
    }

    // If frequencies are the same, sort by value.
    return a[0] - b[0]
  })
  const maxFrequency = sortedFrequency[0][1]

  // if frequencies of values are less than 2 return undefined.
  const uniqueFrequencies = [...frequencyValues.values()]

  if (uniqueFrequencies.length <= 2 && numbers.length % 2 === 0) {
    return undefined
  } else if (maxFrequency < 2 && numbers.length % 2 === 0) {
    return undefined
  } else if (uniqueFrequencies.length === 1) {
    return undefined
  } else if (frequencyValues.values === 1) {
    return undefined
  } else if (maxFrequency === 1) {
    return undefined
  }

  // Filter out values with the maximum frequency.
  const modeValues = sortedFrequency.filter(([, frequency]) => frequency === maxFrequency).map(([number]) => number)

  return modeValues.sort((a, b) => a - b)
}

/**
 * Returns the range value from a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @returns {number} The maximum value.
 */
// Validate the array.
export function range (numbers) {
  validateArray(numbers)

  // Calculate and return range value.
  return maximum(numbers) - minimum(numbers)
}

/**
 * Returns the standard deviation value from a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @returns {number} The maximum value.
 */
// Validate the array.
export function standardDeviation (numbers) {
  validateArray(numbers)

  // Calculate and return the standard deviation value.
  const mean = average(numbers)
  const squaredDifferences = numbers.map((num) => Math.pow(num - mean, 2))
  const variance = squaredDifferences.reduce((sum, number) => sum + number, 0) / numbers.length

  return Math.sqrt(variance)
}

/**
 * Returns the statistical summary from a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @returns {number} The maximum value.
 */
// Validate the array.
export function summary (numbers) {
  validateArray(numbers)

  // Calculate and return the statistical summary.
  return {
    median: median(numbers),
    maximum: maximum(numbers),
    average: average(numbers),
    minimum: minimum(numbers),
    mode: mode(numbers),
    range: range(numbers),
    standardDeviation: standardDeviation(numbers)
  }
}
