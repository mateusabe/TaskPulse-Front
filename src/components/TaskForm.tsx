import {
  Button,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
  Modal,
} from 'antd'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'

interface TaskFormProps {
  onCreate: (data: FormData) => Promise<void>
}

export function TaskForm({ onCreate }: TaskFormProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('slaHours', values.slaHours)

      if (file) {
        formData.append('file', file)
      }

      await onCreate(formData)

      message.success('Tarefa criada com sucesso!')
      form.resetFields()
      setFile(null)
      setOpen(false)
    } catch {
      message.error('Erro ao criar tarefa')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setFile(null)
    setOpen(false)
  }

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
        block
        size="large"
        style={{
          height: '56px',
          fontSize: '16px',
          fontWeight: 500,
          borderRadius: '8px',
          marginTop: '20px',
        }}
      >
        Nova tarefa
      </Button>

      <Modal
        title={<span style={{ fontSize: '18px', fontWeight: 600 }}>Criar nova tarefa</span>}
        open={open}
        onCancel={handleCancel}
        footer={null}
        width={600}
        styles={{
          body: { paddingTop: '24px' },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label={<span style={{ fontSize: '14px', fontWeight: 500 }}>Título</span>}
            name="title"
            rules={[{ required: true, message: 'O título é obrigatório' }]}
          >
            <Input
              placeholder="Ex: Analisar contrato"
              size="large"
              autoFocus
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: '14px', fontWeight: 500 }}>SLA (em horas)</span>}
            name="slaHours"
            rules={[{ required: true, message: 'O SLA é obrigatório' }]}
          >
            <InputNumber
              min={1}
              placeholder="24"
              size="large"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: '14px', fontWeight: 500 }}>Arquivo (opcional)</span>}
          >
            <Upload
              beforeUpload={(file) => {
                setFile(file)
                message.success(`${file.name} selecionado`)
                return false
              }}
              onRemove={() => setFile(null)}
              maxCount={1}
              fileList={file ? [{ uid: '1', name: file.name, status: 'done' }] : []}
            >
              <Button icon={<UploadOutlined />} size="large">
                Selecionar arquivo
              </Button>
            </Upload>
          </Form.Item>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <Button onClick={handleCancel} size="large" block style={{ height: '48px' }}>
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
              style={{ height: '48px', fontWeight: 500 }}
            >
              Criar tarefa
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}