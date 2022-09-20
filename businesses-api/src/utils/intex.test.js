import { isNullOrEmpty } from './index'

describe(isNullOrEmpty, () => {
  it('returns true if passed object is null', () => {
    const data = null

    const result = isNullOrEmpty(data)

    expect(result).toBe(true)
  })

  it('returns true if passed object is undefined', () => {
    const data = undefined

    const result = isNullOrEmpty(data)

    expect(result).toBe(true)
  })

  it('returns true if passed object is empty string', () => {
    const data = ''

    const result = isNullOrEmpty(data)

    expect(result).toBe(true)
  })

  it('returns true if passed object is empty', () => {
    const data = {}

    const result = isNullOrEmpty(data)

    expect(result).toBe(true)
  })
})
