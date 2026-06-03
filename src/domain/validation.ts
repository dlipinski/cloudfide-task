import { CATEGORY_OPTIONS, PRIORITY_OPTIONS, TEAM_MEMBER_OPTIONS } from './constants'

// Regexes mirror backend/src/modules/resources/resource.service.ts exactly.
const NAME_REGEX = /^[A-Za-z0-9 -]+$/
const OWNER_REGEX = /^[A-Za-z ]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INTEGER_REGEX = /^\d+$/

/** Validators return an error message, or undefined when the value is valid. */
export function validateName(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Name is required'
  if (trimmed.length > 255) return 'Name must be at most 255 characters long'
  if (!NAME_REGEX.test(trimmed))
    return 'Only letters, numbers, spaces, and hyphens are allowed'
  return undefined
}

export function validateOwner(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Owner is required'
  if (trimmed.length > 255) return 'Owner must be at most 255 characters long'
  if (!OWNER_REGEX.test(trimmed)) return 'Only letters and spaces are allowed'
  return undefined
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Email is required'
  if (!EMAIL_REGEX.test(trimmed)) return 'Enter a valid email address'
  return undefined
}

export function validateDescription(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Description is required'
  if (trimmed.length > 1000) return 'Description must be at most 1000 characters long'
  return undefined
}

export function validatePriority(value: string): string | undefined {
  if (!PRIORITY_OPTIONS.includes(value as (typeof PRIORITY_OPTIONS)[number]))
    return 'Select a priority'
  return undefined
}

export function validateBudget(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Budget is required'
  if (!INTEGER_REGEX.test(trimmed)) return 'Budget must contain only digits'
  return undefined
}

export function validateCategory(value: string): string | undefined {
  if (!CATEGORY_OPTIONS.includes(value as (typeof CATEGORY_OPTIONS)[number]))
    return 'Select a category'
  return undefined
}

export function validateOptions(values: string[]): string | undefined {
  if (values.length === 0) return 'Select at least one team member'
  const invalid = values.find(
    (value) => !TEAM_MEMBER_OPTIONS.includes(value as (typeof TEAM_MEMBER_OPTIONS)[number]),
  )
  if (invalid) return `Unsupported team member option: ${invalid}`
  return undefined
}
