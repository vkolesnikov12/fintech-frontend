import {
	Button,
	Select,
	Table,
	Tag,
	Typography,
	Upload,
	message,
} from 'antd'
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
			render: () => (
				<div className='documents__actions'>
					<Button type='link' icon={<DownloadOutlined />}>
						Скачать
					</Button>
					<Button type='link' danger icon={<DeleteOutlined />}>
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
						messageApi.success('Файл загружен (mock)')
						return false
					}}
				>
					<Button type='primary' icon={<UploadOutlined />}>
						Загрузить
					</Button>
				</Upload>
			</div>

			<div className='documents__filters'>
				<Select
					placeholder='Тип'
					options={[
						{ value: 'statement', label: 'Выписка' },
						{ value: 'certificate', label: 'Справка' },
						{ value: 'agreement', label: 'Договор' },
					]}
				/>
				<Select
					placeholder='Статус'
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
					dataSource={documents}
					pagination={false}
				/>
			</div>
		</div>
	)
}
