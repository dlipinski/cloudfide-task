import { describe, expect, it } from 'vitest'
import {
  validateBudget,
  validateCategory,
  validateDescription,
  validateEmail,
  validateName,
  validateOptions,
  validateOwner,
  validatePriority,
} from './validation'

describe('validateName', () => {
  it('rejects an empty value', () => {
    expect(validateName('  ')).toBe('Name is required')
  })

  it('accepts letters, numbers, spaces, and hyphens', () => {
    expect(validateName('Resource 1 - alpha')).toBeUndefined()
  })

  it('rejects other characters', () => {
    expect(validateName('Resource!')).toBe(
      'Only letters, numbers, spaces, and hyphens are allowed',
    )
  })

  it('rejects values longer than 255 characters', () => {
    expect(validateName('a'.repeat(256))).toBe(
      'Name must be at most 255 characters long',
    )
  })

  it('trims before validating', () => {
    expect(validateName('  Resource  ')).toBeUndefined()
  })
})

describe('validateOwner', () => {
  it('rejects an empty value', () => {
    expect(validateOwner('')).toBe('Owner is required')
  })

  it('accepts letters and spaces', () => {
    expect(validateOwner('Ada Lovelace')).toBeUndefined()
  })

  it('rejects digits and hyphens', () => {
    expect(validateOwner('Ada-1')).toBe('Only letters and spaces are allowed')
  })

  it('rejects values longer than 255 characters', () => {
    expect(validateOwner('a'.repeat(256))).toBe(
      'Owner must be at most 255 characters long',
    )
  })
})

describe('validateEmail', () => {
  it('rejects an empty value', () => {
    expect(validateEmail('')).toBe('Email is required')
  })

  it('accepts a well-formed address', () => {
    expect(validateEmail('ada@example.com')).toBeUndefined()
  })

  it.each(['ada.example.com', 'ada@example', 'ada @example.com'])(
    'rejects %s',
    (value) => {
      expect(validateEmail(value)).toBe('Enter a valid email address')
    },
  )
})

describe('validateDescription', () => {
  it('rejects an empty value', () => {
    expect(validateDescription('   ')).toBe('Description is required')
  })

  it('accepts a normal description', () => {
    expect(validateDescription('A useful resource')).toBeUndefined()
  })

  it('rejects values longer than 1000 characters', () => {
    expect(validateDescription('a'.repeat(1001))).toBe(
      'Description must be at most 1000 characters long',
    )
  })
})

describe('validatePriority', () => {
  it.each(['low', 'medium', 'high'])('accepts %s', (value) => {
    expect(validatePriority(value)).toBeUndefined()
  })

  it('rejects an unknown value', () => {
    expect(validatePriority('urgent')).toBe('Select a priority')
  })
})

describe('validateCategory', () => {
  it.each(['internal', 'external', 'vendor'])('accepts %s', (value) => {
    expect(validateCategory(value)).toBeUndefined()
  })

  it('rejects an unknown value', () => {
    expect(validateCategory('partner')).toBe('Select a category')
  })
})

describe('validateBudget', () => {
  it('rejects an empty value', () => {
    expect(validateBudget('  ')).toBe('Budget is required')
  })

  it('accepts a string of digits', () => {
    expect(validateBudget('1000')).toBeUndefined()
  })

  it.each(['12.5', '-5', '1 000', 'abc'])('rejects %s', (value) => {
    expect(validateBudget(value)).toBe('Budget must contain only digits')
  })
})

describe('validateOptions', () => {
  it('rejects an empty selection', () => {
    expect(validateOptions([])).toBe('Select at least one team member')
  })

  it('accepts a set of supported members', () => {
    expect(validateOptions(['FE devs', 'Product Owner'])).toBeUndefined()
  })

  it('names an unsupported member', () => {
    expect(validateOptions(['FE devs', 'QA'])).toBe(
      'Unsupported team member option: QA',
    )
  })
})
