import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  Button,
  Card,
  Drawer,
  IconButton,
  Input,
  Select,
} from '../../../design-system'
import type { ResourceStatus } from '../../../api/types'
import { createResource, deleteResource } from '../../../api/resources'
import { validateName } from '../../../domain/validation'
import { useResources } from '../hooks/useResources'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { PageLayout } from '../components/PageLayout'
import { StatusBadge } from '../components/StatusBadge'
import { StateMessage } from '../components/StateMessage'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Fields, Form, FormActions, FormError } from '../components/FormLayout'

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'completed', label: 'Completed' },
]

const SORT_OPTIONS = [
  { value: 'desc', label: 'Newest first' },
  { value: 'asc', label: 'Oldest first' },
]

const PAGE_SIZE = 10

const Toolbar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: end;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const ResourceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const ResourceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const ResourceMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  a {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.inkStrong};
    text-decoration: none;
    font-size: 1.05rem;
  }

  a:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  span {
    color: ${({ theme }) => theme.colors.inkMuted};
    font-size: 0.85rem;
  }
`

const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Pager = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};

  span {
    color: ${({ theme }) => theme.colors.inkMuted};
    font-size: 0.9rem;
  }
`

/** Resources list page: filter, sort, paginate, create, and delete. */
export function ListPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'' | ResourceStatus>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  const { items, pagination, loading, error, refetch } = useResources({
    page,
    pageSize: PAGE_SIZE,
    status: status || undefined,
    name: name || undefined,
    sortOrder,
  })

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [createTouched, setCreateTouched] = useState(false)
  const create = useAsyncAction(createResource)
  const nameError = validateName(newName)

  const [deleteTarget, setDeleteTarget] = useState<
    { id: number; name: string } | undefined
  >(undefined)
  const remove = useAsyncAction(deleteResource)

  const openCreate = () => {
    setNewName('')
    setCreateTouched(false)
    create.reset()
    setCreateOpen(true)
  }

  const submitCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    setCreateTouched(true)
    if (nameError) return
    try {
      const resource = await create.run(newName.trim())
      setCreateOpen(false)
      navigate(`/resources/${resource.resourceId}`)
    } catch {
      // error surfaced via create.error
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await remove.run(deleteTarget.id)
      setDeleteTarget(undefined)
      refetch()
    } catch {
      // error surfaced via remove.error
    }
  }

  const setFilter = <T,>(setter: (value: T) => void) => (value: T) => {
    setPage(1)
    setter(value)
  }

  return (
    <PageLayout
      title="Resources"
      actions={<Button onClick={openCreate}>New resource</Button>}
    >
      <Toolbar>
        <Input
          label="Search by name"
          placeholder="Search…"
          value={name}
          onChange={(event) => setFilter(setName)(event.target.value)}
        />
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(event) =>
            setFilter<'' | ResourceStatus>(setStatus)(
              event.target.value as '' | ResourceStatus,
            )
          }
        />
        <Select
          label="Sort"
          options={SORT_OPTIONS}
          value={sortOrder}
          onChange={(event) =>
            setFilter<'asc' | 'desc'>(setSortOrder)(
              event.target.value as 'asc' | 'desc',
            )
          }
        />
      </Toolbar>

      {error ? (
        <StateMessage tone="error" title="Could not load resources" description={error}>
          <Button variant="secondary" onClick={refetch}>
            Retry
          </Button>
        </StateMessage>
      ) : loading ? (
        <StateMessage title="Loading resources…" />
      ) : items.length === 0 ? (
        <StateMessage
          title="No resources yet"
          description="Create your first resource to get started."
        >
          <Button onClick={openCreate}>New resource</Button>
        </StateMessage>
      ) : (
        <ResourceList>
          {items.map((resource) => (
            <Card key={resource._id}>
              <ResourceRow>
                <ResourceMeta>
                  <Link to={`/resources/${resource.resourceId}`}>
                    {resource.name}
                  </Link>
                  <span>ID #{resource.resourceId}</span>
                </ResourceMeta>
                <RowActions>
                  <StatusBadge status={resource.status} />
                  <IconButton
                    variant="ghost"
                    aria-label={`Delete ${resource.name}`}
                    onClick={() =>
                      setDeleteTarget({
                        id: resource.resourceId,
                        name: resource.name,
                      })
                    }
                  >
                    🗑
                  </IconButton>
                </RowActions>
              </ResourceRow>
            </Card>
          ))}
        </ResourceList>
      )}

      {pagination && pagination.totalPages > 1 ? (
        <Pager>
          <Button
            variant="secondary"
            disabled={pagination.page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </Pager>
      ) : null}

      <Drawer
        title="Create resource"
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
      >
        <Form onSubmit={submitCreate} noValidate>
          <Fields>
            <Input
              label="Resource name"
              autoFocus
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              onBlur={() => setCreateTouched(true)}
              error={createTouched ? nameError : undefined}
              helperText="Letters, numbers, spaces, and hyphens. Locked after creation."
            />
          </Fields>
          {create.error ? <FormError>{create.error}</FormError> : null}
          <FormActions>
            <Button type="submit" disabled={Boolean(nameError) || create.pending}>
              {create.pending ? 'Creating…' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
          </FormActions>
        </Form>
      </Drawer>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete resource"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        pending={remove.pending}
        error={remove.error}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(undefined)}
      />
    </PageLayout>
  )
}
