export interface Task {
  id: string
  title: string
  slaHours: number
  dueAt: string
  createdAt: string
  isCompleted: boolean
  attachmentPath?: string
  completedAt?: string
}