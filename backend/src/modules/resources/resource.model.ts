import mongoose, { type Document, type Model, Schema } from 'mongoose'
import type { ResourceStatus } from './resource.dto'

export interface ResourceDocument extends Document {
  resourceId: number
  name: string
  status: ResourceStatus
  basicInfo: {
    resourceName: string
    owner: string
    email: string
    description: string
    priority: string
  }
  projectDetails: {
    projectName: string
    budget: string
    category: string
    options: string[]
  }
}

const BasicInfoSchema = new Schema(
  {
    resourceName: { type: String, default: '' },
    owner: { type: String, default: '' },
    email: { type: String, default: '' },
    description: { type: String, default: '' },
    priority: { type: String, default: '' },
  },
  { _id: false },
)

const ProjectDetailsSchema = new Schema(
  {
    projectName: { type: String, default: '' },
    budget: { type: String, default: '' },
    category: { type: String, default: '' },
    options: { type: [String], default: [] },
  },
  { _id: false },
)

const ResourceSchema = new Schema<ResourceDocument>(
  {
    resourceId: { type: Number, unique: true, index: true },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'completed'],
      default: 'draft',
    },
    basicInfo: { type: BasicInfoSchema, default: () => ({}) },
    projectDetails: { type: ProjectDetailsSchema, default: () => ({}) },
  },
  { timestamps: true },
)

export const ResourceModel: Model<ResourceDocument> =
  mongoose.models.Resource ?? mongoose.model('Resource', ResourceSchema)
