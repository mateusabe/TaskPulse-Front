import { ConfigProvider, theme } from 'antd'
import Tasks from './pages'

export function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Tasks />
    </ConfigProvider>
  )
}
