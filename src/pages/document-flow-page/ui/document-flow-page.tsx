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
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
	useLazyDownloadDocumentQuery,
	useLazySearchDocumentsQuery,
	useSendNotificationMutation,
	useUpdateDocumentStatusMutation,
} from '../../../features/document-flow/api/document-flow-api'
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
	const [searchClient, setSearchClient] = useState('')
	const [searchApplication, setSearchApplication] = useState('')
	const [selectedDocument, setSelectedDocument] = useState<DocumentRow | null>(
		null,
	)
	const [searchDocuments] = useLazySearchDocumentsQuery()
	const [downloadDocument] = useLazyDownloadDocumentQuery()
	const [updateDocumentStatus] = useUpdateDocumentStatusMutation()
	const [sendNotification] = useSendNotificationMutation()

	const filteredDocuments = useMemo(() => {
		const clientQuery = searchClient.trim().toLowerCase()
		const appQuery = searchApplication.trim().toLowerCase()

		return documents.filter((item) => {
			if (clientQuery && !item.client.toLowerCase().includes(clientQuery)) {
				return false
			}

			if (appQuery && !item.application.toLowerCase().includes(appQuery)) {
				return false
			}

			return true
		})
	}, [searchApplication, searchClient])

	const handleSearch = () => {
		searchDocuments({
			status: 'UPLOADED',
			client: searchClient.trim() || undefined,
			application: searchApplication.trim() || undefined,
		})
			.unwrap()
			.then(() => {
				messageApi.success('GET /api/v1/documents/search (mock)')
			})
			.catch(() => {
				messageApi.error('Не удалось загрузить документы')
			})
	}

	const handleHistory = () => {
		searchDocuments({ status: 'UPLOADED' })
			.unwrap()
			.then(() => {
				messageApi.info('GET /api/v1/documents/search?status=UPLOADED (mock)')
			})
			.catch(() => {
				messageApi.error('Не удалось загрузить историю')
			})
	}

	const handlePreview = (record: DocumentRow) => {
		setSelectedDocument(record)
		downloadDocument({ id: record.key })
			.unwrap()
			.then(() => {
				messageApi.success(`GET /api/v1/documents/${record.key}/download (mock)`)
			})
			.catch(() => {
				messageApi.error('Не удалось загрузить документ')
			})
	}

	const handleDocumentAction = (status: 'APPROVED' | 'REJECTED' | 'REQUESTED') => {
		if (!selectedDocument) {
			messageApi.info('Выберите документ для действия')
			return
		}

		updateDocumentStatus({ id: selectedDocument.key, status })
			.unwrap()
			.then(() =>
				sendNotification({
					applicationId: Number(selectedDocument.application.replace('#', '')),
					message: `Статус документа: ${status}`,
				}).unwrap(),
			)
			.then(() => {
				messageApi.success(
					`PATCH /api/v1/documents/${selectedDocument.key}/status (mock)`,
				)
			})
			.catch(() => {
				messageApi.error('Не удалось обновить статус документа')
			})
	}

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
			render: (_, record) => (
				<div className='document-flow__actions'>
					<Button icon={<EyeOutlined />} onClick={() => handlePreview(record)}>
						Просмотр
					</Button>
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
					<Button
						icon={<CheckCircleOutlined />}
						onClick={() => handleDocumentAction('APPROVED')}
					>
						Принять
					</Button>
					<Button
						icon={<CloseCircleOutlined />}
						onClick={() => handleDocumentAction('REJECTED')}
					>
						Отклонить
					</Button>
					<Button
						icon={<SendOutlined />}
						onClick={() => handleDocumentAction('REQUESTED')}
					>
						Запросить
					</Button>
				</div>
			</div>

			<div className='document-flow__filters'>
				<Input
					placeholder='Поиск по клиенту'
					value={searchClient}
					onChange={(event) => setSearchClient(event.target.value)}
				/>
				<Input
					placeholder='Поиск по заявке'
					value={searchApplication}
					onChange={(event) => setSearchApplication(event.target.value)}
				/>
				<Button onClick={handleSearch}>Поиск</Button>
			</div>

			<div className='document-flow__grid'>
				<div className='document-flow__table'>
					<Table
						columns={columns}
						dataSource={filteredDocuments}
						pagination={false}
					/>
				</div>
				<div className='document-flow__side'>
					<div className='document-flow__preview'>
						<div className='document-flow__section-header'>
							<Title level={5}>Предпросмотр</Title>
						</div>
						<div className='document-flow__preview-box'>
							{selectedDocument ? (
								<div className='document-flow__preview-content'>
									<Text>{selectedDocument.document}</Text>
									<Text type='secondary'>
										{selectedDocument.client} • {selectedDocument.application}
									</Text>
									<Link
										to={`/app/applications/${selectedDocument.application.replace('#', '')}`}
									>
										<Button size='small'>Открыть заявку</Button>
									</Link>
								</div>
							) : (
								<Text type='secondary'>
									Выберите документ для просмотра
								</Text>
							)}
						</div>
					</div>
					<div className='document-flow__history'>
						<div className='document-flow__section-header'>
							<Title level={5}>История проверок</Title>
							<Button type='link' onClick={handleHistory}>
								Вся история
							</Button>
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
