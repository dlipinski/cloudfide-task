import type { SelectOption } from '../design-system'

export const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const

export const CATEGORY_OPTIONS = ['internal', 'external', 'vendor'] as const

export const TEAM_MEMBER_OPTIONS = [
  'FE devs',
  'BE devs',
  'Designer',
  'Data Eng',
  'Product Owner',
] as const

const PLACEHOLDER: SelectOption = { value: '', label: 'Select…' }

function toSelectOptions(values: readonly string[]): SelectOption[] {
  return [PLACEHOLDER, ...values.map((value) => ({ value, label: value }))]
}

export const PRIORITY_SELECT_OPTIONS = toSelectOptions(PRIORITY_OPTIONS)

export const CATEGORY_SELECT_OPTIONS = toSelectOptions(CATEGORY_OPTIONS)
