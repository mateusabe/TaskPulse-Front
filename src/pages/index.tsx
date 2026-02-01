import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Task } from '../types/Task'
import { TaskList } from '../components/TaskList'
import { Card, Input, Select, Space, Typography } from 'antd'
import { TaskForm } from '../components/TaskForm'
import styles from './styles.module.css'
import { NotificationsBell } from '../components/NotificationBell'

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [loadingTasks, setLoadingTasks] = useState(true)

  useEffect(() => {
  async function loadTasks() {
    try {
      setLoadingTasks(true)
      const response = await api.get<Task[]>('/tasks')
      setTasks(response.data)
    } finally {
      setLoadingTasks(false)
    }
  }

  loadTasks()
}, [])

  async function createTask(formData: FormData) {
    await api.post('/tasks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    // Recarrega as tarefas após criar
    const response = await api.get<Task[]>('/tasks')
    setTasks(response.data)
  }

  function handleComplete(taskId: string) {
    api.put(`/tasks/${taskId}/complete`).then(() => {
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, isCompleted: true }
            : task
        )
      )
    })
  }

  async function handleDownload(taskId: string) {
    try {
      const response = await api.get(
        `/tasks/${taskId}/attachment`,
        { responseType: 'blob' }
      )

      // 🔥 pega o nome exatamente como veio do backend
      const disposition = response.headers['content-disposition']
      let fileName = 'arquivo'

      if (disposition) {
        const match =
          disposition.match(/filename\*=UTF-8''(.+)/) ||
          disposition.match(/filename="?([^"]+)"?/)

        if (match?.[1]) {
          fileName = decodeURIComponent(match[1])
        }
      }

      const url = window.URL.createObjectURL(response.data)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)

      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchText.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && task.isCompleted) ||
      (statusFilter === 'pending' && !task.isCompleted)

    return matchesSearch && matchesStatus
  })

  return (
    <div className={styles.container}>
      <div className={styles.containerContent}
      >
        

        {/* Header fixo */}
        <Card 
          bordered={false}
          bodyStyle={{
            background: '#141414',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '12px',
          }}
          style={{
            position: 'sticky',
            top: '24px',
            zIndex: 10,
          }}
        >
          <Typography.Title 
            level={2} 
            style={{ 
              margin: 0,
              fontSize: '28px',
              fontWeight: 600,
            }}
          >
            Task Pulse
          </Typography.Title>

          <NotificationsBell />
        </Card>

        {/* Form - agora não empurra nada */}
        <TaskForm onCreate={createTask} />

        {/* Filtros */}
        <Card
          style={{
            background: '#141414',
            borderRadius: '12px',
          }}
        >
          <Space 
            style={{ 
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
            }} 
            size="middle"
          >
            <Input
              placeholder="Buscar tarefa pelo título"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              size="large"
              style={{
                minWidth: '300px',
                flex: 1,
                borderRadius: '8px',
              }}
            />

            <Select
              value={statusFilter}
              onChange={value => setStatusFilter(value)}
              size="large"
              style={{ 
                width: 200,
                borderRadius: '8px',
              }}
            >
              <Select.Option value="all">Todas</Select.Option>
              <Select.Option value="pending">Pendentes</Select.Option>
              <Select.Option value="completed">Concluídas</Select.Option>
            </Select>
          </Space>
        </Card>

        {/* Lista de tarefas */}
        <Card
          loading={loadingTasks}
          style={{
            background: '#141414',
            borderRadius: '12px',
          }}
        >
          {!loadingTasks && (
            <TaskList
              tasks={filteredTasks}
              onComplete={handleComplete}
              onDownload={handleDownload} 
            />
          )}
        </Card>
      </div>
    </div>
  )
}

export default Tasks