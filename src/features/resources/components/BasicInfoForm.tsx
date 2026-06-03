import { useMemo, useState } from 'react'
import { Button, Input, Select } from '../../../design-system'
import type { BasicInfo } from '../../../api/types'
import { PRIORITY_SELECT_OPTIONS } from '../../../domain/constants'
import {
  validateDescription,
  validateEmail,
  validateOwner,
  validatePriority,
} from '../../../domain/validation'
import { Fields, Form, FormActions, FormError } from './FormLayout'

interface BasicInfoFormProps {
  initialValues: BasicInfo
  onSubmit: (values: BasicInfo) => void
  submitting: boolean
  submitLabel: string
  serverError?: string
}

type Field = 'owner' | 'email' | 'description' | 'priority'

function getErrors(values: BasicInfo): Partial<Record<Field, string>> {
  return {
    owner: validateOwner(values.owner),
    email: validateEmail(values.email),
    description: validateDescription(values.description),
    priority: validatePriority(values.priority),
  }
}

/** Basic Info module form. The resource name is locked after creation. */
export function BasicInfoForm({
  initialValues,
  onSubmit,
  submitting,
  submitLabel,
  serverError,
}: BasicInfoFormProps) {
  const [values, setValues] = useState<BasicInfo>(initialValues)
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})

  const errors = useMemo(() => getErrors(values), [values])
  const isValid = Object.values(errors).every((error) => !error)

  const setField = (field: Field, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }))

  const markTouched = (field: Field) =>
    setTouched((prev) => ({ ...prev, [field]: true }))

  const showError = (field: Field) => (touched[field] ? errors[field] : undefined)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched({ owner: true, email: true, description: true, priority: true })
    if (!isValid) return
    onSubmit({
      ...values,
      owner: values.owner.trim(),
      email: values.email.trim(),
      description: values.description.trim(),
    })
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Fields>
        <Input
          label="Resource name"
          value={values.resourceName}
          state="locked"
          helperText="Name is locked after creation"
          readOnly
        />
        <Input
          label="Owner"
          value={values.owner}
          onChange={(event) => setField('owner', event.target.value)}
          onBlur={() => markTouched('owner')}
          error={showError('owner')}
        />
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(event) => setField('email', event.target.value)}
          onBlur={() => markTouched('email')}
          error={showError('email')}
        />
        <Input
          label="Description"
          multiline
          value={values.description}
          onChange={(event) => setField('description', event.target.value)}
          onBlur={() => markTouched('description')}
          error={showError('description')}
        />
        <Select
          label="Priority"
          options={PRIORITY_SELECT_OPTIONS}
          value={values.priority}
          onChange={(event) => setField('priority', event.target.value)}
          onBlur={() => markTouched('priority')}
          error={showError('priority')}
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
