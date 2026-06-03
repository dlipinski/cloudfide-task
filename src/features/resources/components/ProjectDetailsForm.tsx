import { useMemo, useState } from 'react'
import { Button, CheckboxGroup, Input, Select } from '../../../design-system'
import type { ProjectDetails } from '../../../api/types'
import {
  CATEGORY_SELECT_OPTIONS,
  TEAM_MEMBER_OPTIONS,
} from '../../../domain/constants'
import {
  validateBudget,
  validateCategory,
  validateName,
  validateOptions,
} from '../../../domain/validation'
import { Fields, Form, FormActions, FormError } from './FormLayout'

interface ProjectDetailsFormProps {
  initialValues: ProjectDetails
  onSubmit: (values: ProjectDetails) => void
  submitting: boolean
  submitLabel: string
  serverError?: string
}

type Field = 'projectName' | 'budget' | 'category' | 'options'

function getErrors(values: ProjectDetails): Partial<Record<Field, string>> {
  return {
    projectName: validateName(values.projectName),
    budget: validateBudget(values.budget),
    category: validateCategory(values.category),
    options: validateOptions(values.options),
  }
}

/** Project Details module form. */
export function ProjectDetailsForm({
  initialValues,
  onSubmit,
  submitting,
  submitLabel,
  serverError,
}: ProjectDetailsFormProps) {
  const [values, setValues] = useState<ProjectDetails>(initialValues)
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})

  const errors = useMemo(() => getErrors(values), [values])
  const isValid = Object.values(errors).every((error) => !error)

  const markTouched = (field: Field) =>
    setTouched((prev) => ({ ...prev, [field]: true }))

  const showError = (field: Field) => (touched[field] ? errors[field] : undefined)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched({ projectName: true, budget: true, category: true, options: true })
    if (!isValid) return
    onSubmit({
      ...values,
      projectName: values.projectName.trim(),
      budget: values.budget.trim(),
    })
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Fields>
        <Input
          label="Project name"
          value={values.projectName}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, projectName: event.target.value }))
          }
          onBlur={() => markTouched('projectName')}
          error={showError('projectName')}
        />
        <Input
          label="Budget"
          inputMode="numeric"
          value={values.budget}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, budget: event.target.value }))
          }
          onBlur={() => markTouched('budget')}
          error={showError('budget')}
        />
        <Select
          label="Category"
          options={CATEGORY_SELECT_OPTIONS}
          value={values.category}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, category: event.target.value }))
          }
          onBlur={() => markTouched('category')}
          error={showError('category')}
        />
        <CheckboxGroup
          label="Team members"
          options={[...TEAM_MEMBER_OPTIONS]}
          value={values.options}
          onChange={(next) => {
            markTouched('options')
            setValues((prev) => ({ ...prev, options: next }))
          }}
          error={showError('options')}
        />
      </Fields>
      {serverError ? <FormError>{serverError}</FormError> : null}
      <FormActions>
        <Button type="submit" disabled={!isValid || submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </FormActions>
    </Form>
  )
}
