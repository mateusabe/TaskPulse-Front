import { Task } from "../types/Task"
import { formatDate } from "../utils/date"
import { Table, Input, Select, Tag, Button, Card, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface TaskListProps {
  tasks: Task[]
  onComplete: (taskId: string) => void
  onDownload: (taskId: string) => void
}

export function TaskList({ tasks, onComplete, onDownload }: TaskListProps) {
  if (tasks.length === 0) {
    return <p>Nenhuma tarefa encontrada.</p>
  }

  const columns: ColumnsType<Task> = [
  {
    title: 'Tarefa',
    dataIndex: 'title',
    key: 'title',
    render: text => <strong>{text}</strong>,
  },
  {
    title: 'SLA',
    key: 'sla',
    render: (_, task) => {
      const expired = new Date(task.dueAt) < new Date() && !task.isCompleted

      return expired ? (
        <Tag color="red">Expirado</Tag>
      ) : (
        <Tag color="green">Dentro do prazo</Tag>
      )
    },
  },
  {
    title: 'Status',
    dataIndex: 'isCompleted',
    key: 'status',
    render: completed =>
      completed ? (
        <Tag color="blue">Concluída</Tag>
      ) : (
        <Tag color="orange">Pendente</Tag>
      ),
  },
  {
    title: 'Start',
    dataIndex: 'createdAt',
    key: 'start',
    render: text => <span>{formatDate(text)}</span>,
  },
  {
    title: 'Limite',
    dataIndex: 'dueAt',
    key: 'dueAt',
    render: text => <span>{formatDate(text)}</span>,
  },
  {
    title: 'Arquivo',
    dataIndex: 'attachmentPath',
    key: 'attachmentPath',
    render: (_, task) => 
      task.attachmentPath ? (
      <Button
            type="primary"
            onClick={() => onDownload(task.id)}
          >
            Baixar
          </Button>) 
          : <span>-</span>,
  },
  {
    title: 'Ações',
    key: 'actions',
    render: (_, task) =>
      !task.isCompleted && (
        <Button
          type="primary"
          onClick={() => onComplete(task.id)}
        >
          Concluir
        </Button>
      ),
  },
]

  return (
    <Table
      columns={columns}
      dataSource={tasks}
      rowKey="id"
      pagination={{ pageSize: 5 }}
    />
  )
}