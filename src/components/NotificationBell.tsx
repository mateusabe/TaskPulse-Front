import {
  Badge,
  Dropdown,
  List,
  Typography,
  Space,
  Empty,
  Spin,
} from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Notification } from '../types/Notification'


export function NotificationsBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  const unreadCount = notifications.filter(n => !n.isRead).length

  async function markAsRead(id: string) {
    await api.put(`/notification/${id}/read`)

    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    )
  }

  async function loadNotifications() {
    const response = await api.get<Notification[]>('/notification')

    const previousIds = notifications.map(n => n.id)
    const newUnread = response.data.filter(
      n => !n.isRead && !previousIds.includes(n.id)
    )

    // newUnread.forEach(n => {
    //   notifyBrowser('Nova notificação', n.message)
    // })

    setNotifications(response.data)
  }

  useEffect(() => {
    loadNotifications()

    const interval = setInterval(() => {
      loadNotifications()
    }, 10000) // a cada 10 segundos

    return () => clearInterval(interval)
  }, [])

  const handleOpen = async () => {
    await loadNotifications()
  }

  const menuContent = (
    <div style={{ width: 320 }}>
      {loading ? (
        <Spin style={{ display: 'block', margin: '20px auto' }} />
      ) : notifications.length === 0 ? (
        <Empty description="Nenhuma notificação" />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={notifications}
          renderItem={item => (
            <List.Item
              onClick={() => {
                if (!item.isRead) {
                  markAsRead(item.id)
                }
              }}
              style={{
                cursor: 'pointer',
                background: item.isRead ? '#1f1f1f' : '#333333',
                borderRadius: 6,
                padding: '12px',
              }}
            >
              <Space direction="vertical" size={0}>
                <Typography.Text strong={!item.isRead}>
                  {item.message}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {item.taskTitle}
                </Typography.Text>
                {item.isRead && (
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    Lido
                  </Typography.Text>
                )}                
              </Space>
            </List.Item>
          )}
        />

      )}
    </div>
  )

  return (
    <Dropdown
      popupRender={() => menuContent}
      trigger={['click']}
      onOpenChange={(open) => {
        if (open) handleOpen()
      }}
    >
      <Badge count={unreadCount} offset={[-2, 2]}>
        <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  )
}
