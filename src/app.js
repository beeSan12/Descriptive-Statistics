/**
 * @file The starting point of the application.
 * @module src/app.js
 * @author Johan Leitet <johan.leitet@lnu.se>
 * @author Mats Loock <mats.loock@lnu.se>
 * @version 2.0.0
 */

import * as statistics from './statistics.js'

const array = [5, 1, 1, 1, 3, -2, 2, 5, 7, 4, 5, 16]
const largeArray = Array.from({ length: 200_000 }, () => Math.floor(Math.random() * 400_000) - 200_000)

console.log('\nMedelvärde (average)')
console.log('====================')
try {
  console.log(statistics.average(array))
  console.log(statistics.average(largeArray))
} catch (err) {
  console.error('\x1b[31mERROR:', err.message, '\x1b[0m')
}

console.log('\nMaxvärde (maximum)')
console.log('==================')
try {
  console.log(statistics.maximum(array))
  console.log(statistics.maximum(largeArray))
} catch (err) {
  console.error('\x1b[31mERROR:', err.message, '\x1b[0m')
}

console.log('\nMedian (median)')
console.log('===============')
try {
  console.log(statistics.median(array))
  console.log(statistics.median(largeArray))
} catch (err) {
  console.error('\x1b[31mERROR:', err.message, '\x1b[0m')
}

console.log('\nMinvärde (minimum)')
console.log('==================')
try {
  console.log(statistics.minimum(array))
  console.log(statistics.minimum(largeArray))
} catch (err) {
  console.error('\x1b[31mERROR:', err.message, '\x1b[0m')
}

console.log('\nTypvärde (mode)')
console.log('===============')
try {
  console.log(statistics.mode(array))
  console.log(statistics.mode([1]))
  console.log(statistics.mode([1, 1, 1]))
  console.log(statistics.mode([1, 2, 1, 2]))
  console.log(statistics.mode(largeArray))
} catch (err) {
  console.error('\x1b[31mERROR:', err.message, '\x1b[0m')
}

console.log('\nVariationsbredd (range)')
console.log('=======================')
try {
  console.log(statistics.range(array))
  console.log(statistics.range(largeArray))
} catch (err) {
  console.error('\x1b[31mERROR:', err.message, '\x1b[0m')
}

console.log('\nStandardavvikelse (standardDeviation)')
console.log('=====================================')
try {
  console.log(statistics.standardDeviation(array))
  console.log(statistics.standardDeviation(largeArray))
} catch (err) {
  console.error('\x1b[31mERROR:', err.message, '\x1b[0m')
}

console.log('\nSammanfattning (summary)')
console.log('========================')
try {
  console.log(statistics.summary(array))
  console.log(statistics.summary(largeArray))
} catch (err) {
  console.error('\x1b[31mERROR:', err.message, '\x1b[0m')
}
