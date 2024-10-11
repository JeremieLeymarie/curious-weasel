import { describe, test, expect } from 'vitest'
import { capFL } from '../string'

describe('capFL', () => {
  test('empty string', () => {
    expect(capFL('')).toEqual('')
  })

  test('all CAPS', () => {
    expect(capFL('BABABA')).toEqual('BABABA')
  })

  test('all lowercase', () => {
    expect(capFL('bababa')).toEqual('Bababa')
  })

  test('only one char', () => {
    expect(capFL('b')).toEqual('B')
  })

  test('only two chars', () => {
    expect(capFL('ba')).toEqual('Ba')
  })

  test('already capFLd', () => {
    expect(capFL('Bababa')).toEqual('Bababa')
  })

  test('weird case', () => {
    expect(capFL('bABabA')).toEqual('BABabA')
  })
})
