import {
	Button,
	Input,
	Table,
	Tag,
	Typography,
	message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	EyeOutlined,
	SendOutlined,
} from '@ant-design/icons'
import './document-flow-page.css'

const { Title, Text } = Typography

interface DocumentRow {
	key: string
	client: string
	application: string
	document: string
	status: 'UPLOADED' | 'APPROVED' | 'REJECTED'
	uploadedAt: string
}

const documents: DocumentRow[] = [
	{
		key: '1',
		client: 'Иван Петров',
		application: '#1284',
		document: 'Паспорт',
		status: 'UPLOADED',
		uploadedAt: '19.01.2026 11:10',
	},
	{
		key: '2',
		client: 'Мария Смирнова',
		application: '#1281',
		document: 'Справка 2‑НДФЛ',
		status: 'UPLOADED',
		uploadedAt: '19.01.2026 10:30',
	},
	{
		key: '3',
		client: 'Алексей Волков',
		application: '#1275',
		document: 'Договор',
		status: 'UPLOADED',
		uploadedAt: '18.01.2026 15:20',
	},
]

const reviewHistory = [
	{
		id: 1,
		action: 'Документ принят',
		meta: 'Паспорт • #1284',
		date: '19.01.2026 12:10',
	},
	{
		id: 2,
		action: 'Запрошены документы',
		meta: 'Справка 2‑НДФЛ • #1279',
		date: '18.01.2026 16:40',
	},
]

export function DocumentFlowPage() {
	const [messageApi, contextHolder] = message.useMessage()

	const columns: ColumnsType<DocumentRow> = [
		{ title: 'Клиент', dataIndex: 'client', key: 'client' },
		{ title: 'Заявка', dataIndex: 'application', key: 'application' },
		{ title: 'Документ', dataIndex: 'document', key: 'document' },
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
			render: () => <Tag color='orange'>UPLOADED</Tag>,
		},
		{ title: 'Дата', dataIndex: 'uploadedAt', key: 'uploadedAt' },
		{
			title: 'Действие',
			key: 'action',
			render: () => (
				<div className='document-flow__actions'>
					<Button icon={<EyeOutlined />}>Просмотр</Button>
				</div>
			),
		},
	]

	return (
		<div className='document-flow'>
			{contextHolder}
			<div className='document-flow__header'>
				<div>
					<Title level={3}>Документооборот</Title>
					<Text type='secondary'>Проверка загруженных документов</Text>
				</div>
				<div className='document-flow__header-actions'>
					<Button icon={<CheckCircleOutlined />}>
						Принять
					</Button>
					<Button icon={<CloseCircleOutlined />}>
						Отклонить
					</Button>
					<Button icon={<SendOutlined />}>
						Запросить
					</Button>
				</div>
			</div>

			<div className='document-flow__filters'>
				<Input placeholder='Поиск по клиенту' />
				<Input placeholder='Поиск по заявке' />
			</div>

			<div className='document-flow__grid'>
				<div className='document-flow__table'>
					<Table columns={columns} dataSource={documents} pagination={false} />
				</div>
				<div className='document-flow__side'>
					<div className='document-flow__preview'>
						<div className='document-flow__section-header'>
							<Title level={5}>Предпросмотр</Title>
						</div>
						<div className='document-flow__preview-box'>
							<Text type='secondary'>
								Выберите документ для просмотра
							</Text>
						</div>
					</div>
					<div className='document-flow__history'>
						<div className='document-flow__section-header'>
							<Title level={5}>История проверок</Title>
							<Button type='link'>Вся история</Button>
						</div>
						<div className='document-flow__history-list'>
							{reviewHistory.map((item) => (
								<div key={item.id} className='document-flow__history-item'>
									<div className='document-flow__history-title'>
										{item.action}
									</div>
									<Text type='secondary'>{item.meta}</Text>
									<Text type='secondary'>{item.date}</Text>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
