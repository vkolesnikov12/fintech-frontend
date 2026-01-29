import {
	Button,
	Input,
	Select,
	Table,
	Tag,
	Typography,
	Upload,
	message,
} from 'antd'
import { useMemo, useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import {
	DeleteOutlined,
	DownloadOutlined,
	UploadOutlined,
} from '@ant-design/icons'
import './documents-page.css'

const { Title, Text } = Typography

interface DocumentRow {
	key: string
	name: string
	type: string
	status: 'READY' | 'PROCESSING' | 'FAILED'
	date: string
}

const documents: DocumentRow[] = [
	{
		key: '1',
		name: 'Выписка по счету',
		type: 'Выписка',
		status: 'READY',
		date: '19.01.2026',
	},
	{
		key: '2',
		name: 'Справка о доходах',
		type: 'Справка',
		status: 'PROCESSING',
		date: '18.01.2026',
	},
	{
		key: '3',
		name: 'Договор обслуживания',
		type: 'Договор',
		status: 'READY',
		date: '10.01.2026',
	},
	{
		key: '4',
		name: 'Справка для визы',
		type: 'Справка',
		status: 'FAILED',
		date: '05.01.2026',
	},
]

export function DocumentsPage() {
	const [messageApi, contextHolder] = message.useMessage()
	const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined)
	const [statusFilter, setStatusFilter] = useState<string | undefined>(
		undefined,
	)
	const [searchQuery, setSearchQuery] = useState('')

	const filteredDocuments = useMemo(() => {
		const query = searchQuery.trim().toLowerCase()

		return documents.filter((doc) => {
			if (typeFilter && doc.type !== typeFilter) {
				return false
			}

			if (statusFilter && doc.status !== statusFilter) {
				return false
			}

			if (!query) {
				return true
			}

			return doc.name.toLowerCase().includes(query)
		})
	}, [searchQuery, statusFilter, typeFilter])

	const columns: ColumnsType<DocumentRow> = [
		{
			title: 'Документ',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
			render: (value: DocumentRow['status']) => {
				const color =
					value === 'READY' ? 'green' : value === 'FAILED' ? 'red' : 'orange'

				const label =
					value === 'READY'
						? 'Готов'
						: value === 'FAILED'
							? 'Ошибка'
							: 'В обработке'

				return <Tag color={color}>{label}</Tag>
			},
		},
		{
			title: 'Дата',
			dataIndex: 'date',
			key: 'date',
		},
		{
			title: 'Действие',
			key: 'action',
			render: (_, record) => (
				<div className='documents__actions'>
					<Button
						type='link'
						icon={<DownloadOutlined />}
						onClick={() =>
							messageApi.success(
								`GET /api/v1/documents/${record.key}/download (mock)`,
							)
						}
					>
						Скачать
					</Button>
					<Button
						type='link'
						danger
						icon={<DeleteOutlined />}
						onClick={() =>
							messageApi.success(
								`DELETE /api/v1/documents/${record.key} (mock)`,
							)
						}
					>
						Удалить
					</Button>
				</div>
			),
		},
	]

	return (
		<div className='documents'>
			{contextHolder}
			<div className='documents__header'>
				<div>
					<Title level={3}>Документы</Title>
					<Text type='secondary'>
						Выписки, справки и договоры
					</Text>
				</div>
				<Upload
					showUploadList={false}
					beforeUpload={() => {
					messageApi.success('POST /api/v1/documents/upload (mock)')
						return false
					}}
				>
					<Button type='primary' icon={<UploadOutlined />}>
						Загрузить
					</Button>
				</Upload>
			</div>

			<div className='documents__filters'>
				<Input
					placeholder='Поиск по названию'
					value={searchQuery}
					onChange={(event) => setSearchQuery(event.target.value)}
				/>
				<Select
					placeholder='Тип'
					value={typeFilter}
					onChange={(value) => setTypeFilter(value)}
					allowClear
					options={[
						{ value: 'Выписка', label: 'Выписка' },
						{ value: 'Справка', label: 'Справка' },
						{ value: 'Договор', label: 'Договор' },
					]}
				/>
				<Select
					placeholder='Статус'
					value={statusFilter}
					onChange={(value) => setStatusFilter(value)}
					allowClear
					options={[
						{ value: 'READY', label: 'Готов' },
						{ value: 'PROCESSING', label: 'В обработке' },
						{ value: 'FAILED', label: 'Ошибка' },
					]}
				/>
			</div>

			<div className='documents__table'>
				<Table
					columns={columns}
					dataSource={filteredDocuments}
					pagination={false}
				/>
			</div>
		</div>
	)
}
