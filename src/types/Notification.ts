export interface Notification {
  id: string
  message: string
  createdAt: string
  isRead: boolean
  taskId: string
  taskTitle: string
  readAt?: string
}