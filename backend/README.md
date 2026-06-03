# Backend API Documentation

Express + TypeScript + MongoDB backend for the resource workflow.

## Base URL

- `http://localhost:5001`
- Swagger UI: `http://localhost:5001/docs`

## Domain rules

- Resource status values are only:
  - `draft`
  - `completed`
- Status transition is allowed only through:
  - `PATCH /api/resources/{id}/provisioning`
  - only when both modules are complete (Basic Info + Project Details)
- Module PATCH endpoints are draft-only:
  - `PATCH /api/resources/{id}/basic-info`
  - `PATCH /api/resources/{id}/project-details`
- Completed-resource updates should be persisted using:
  - `PUT /api/resources/{id}`
  - this endpoint is not allowed for `draft` resources

## ID format

All `/{id}` resource endpoints accept:
- numeric `resourceId` (for example `1`)
- Mongo ObjectId

If the id format is invalid, the API returns `400`.
If resource does not exist, API returns `404`.

## Endpoints

### 1) `GET /api/resources`

Returns resources using backend-driven filtering, sorting, and pagination.

Use cases:
- resources list page
- status overview

Query params:
- `page` (optional, default `1`)
- `pageSize` (optional, default `10`, max `100`)
- `status` (optional: `draft` or `completed`)
- `name` (optional, case-insensitive partial match)
- `sortOrder` (optional: `desc` newest first, `asc` oldest first)

Response:
- `200` object:
  - `items: Resource[]`
  - `pagination: { page, pageSize, totalItems, totalPages }`
- `400` invalid query parameter value

### 2) `POST /api/resources`

Creates a new resource.

Business behavior:
- `status` is initialized to `draft`
- `resourceId` is auto-incremented
- `basicInfo` and `projectDetails` are initialized with empty defaults

Request body:
- `{ "resourceName": string }`

Responses:
- `201` created resource
- `400` validation error (for example missing/empty `resourceName`)

### 3) `GET /api/resources/{id}`

Returns a single resource by numeric `resourceId` or Mongo ObjectId.

Responses:
- `200` resource
- `400` invalid id format
- `404` not found

### 4) `PATCH /api/resources/{id}/basic-info`

Updates Basic Info module for a draft resource.

Business behavior:
- Allowed only when status is `draft`
- If `basicInfo.resourceName` is provided, top-level `name` is synchronized

Responses:
- `200` updated resource
- `400` invalid id format or completed-resource module PATCH is not allowed
- `404` not found

### 5) `PATCH /api/resources/{id}/project-details`

Updates Project Details module for a draft resource.

Business behavior:
- Allowed only when status is `draft`
- Allowed only after Basic Info is fully completed

Responses:
- `200` updated resource
- `400` invalid id format, Basic Info not completed, or completed-resource module PATCH is not allowed
- `404` not found

### 6) `PATCH /api/resources/{id}/provisioning`

Marks a resource as completed.

Business behavior:
- The only endpoint that changes status
- Allowed transition: `draft -> completed`
- If already completed, reprovisioning is rejected
- Provisioning is allowed only when both modules are complete

Responses:
- `200` provisioning response
- `400` invalid id format, reprovisioning completed resource, or incomplete modules
- `404` not found

### 7) `PUT /api/resources/{id}`

Replaces full resource business data.

Updatable fields:
- `name`
- `basicInfo`
- `projectDetails`

Business behavior:
- Allowed only for `completed` resources
- Draft resources are rejected with `400`
- Status is preserved and cannot be changed by PUT
- Status transition must go through provisioning endpoint
- If `basicInfo.resourceName` is provided, top-level `name` is synchronized

Responses:
- `200` updated resource
- `400` invalid id format or resource is still draft
- `404` not found

### 8) `DELETE /api/resources/{id}`

Deletes a single resource.

Responses:
- `200` deleted resource
- `400` invalid id format
- `404` not found

### 9) `DELETE /api/admin/database`

Clears all resource data.

Purpose:
- local development reset
- test environment cleanup

Response:
- `200` `{ "message": "Database cleared successfully" }`

## Error shape

For handled business errors, API returns:

```json
{
  "message": "...",
  "details": {}
}
```

Common status codes:
- `400` invalid input / invalid id
- `404` resource not found
- `500` unexpected internal error
