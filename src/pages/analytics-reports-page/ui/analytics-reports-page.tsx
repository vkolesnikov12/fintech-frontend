import {
	Button,
	Card,
	Select,
	Space,
	Table,
	Tag,
	Typography,
	message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
	DownloadOutlined,
	FileExcelOutlined,
	FilePdfOutlined,
	SettingOutlined,
} from '@ant-design/icons'
import './analytics-reports-page.css'

const { Title, Text } = Typography

const widgets = [
	{ id: 1, title: 'Продажи', value: '3 240 000 ₽', trend: '+12%' },
	{ id: 2, title: 'Риски', value: '1.8%', trend: '-0.3%' },
	{ id: 3, title: 'Операции', value: '12 450', trend: '+4%' },
]

const reports = [
	{
		key: '1',
		name: 'Отчет по продажам',
		type: 'SALES',
		status: 'READY',
		createdAt: '19.01.2026',
	},
	{
		key: '2',
		name: 'Отчет по рискам',
		type: 'RISK',
		status: 'READY',
		createdAt: '18.01.2026',
	},
	{
		key: '3',
		name: 'Операционные метрики',
		type: 'OPERATIONS',
		status: 'PROCESSING',
		createdAt: '18.01.2026',
	},
]

export function AnalyticsReportsPage() {
	const [messageApi, contextHolder] = message.useMessage()

	const columns: ColumnsType<typeof reports[number]> = [
		{ title: 'Отчет', dataIndex: 'name', key: 'name' },
		{ title: 'Тип', dataIndex: 'type', key: 'type' },
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
			render: (value: string) => (
				<Tag color={value === 'READY' ? 'green' : 'orange'}>
					{value === 'READY' ? 'Готов' : 'В обработке'}
				</Tag>
			),
		},
		{ title: 'Дата', dataIndex: 'createdAt', key: 'createdAt' },
		{
			title: 'Экспорт',
			key: 'export',
			render: () => (
				<Space>
					<Button icon={<FilePdfOutlined />} />
					<Button icon={<FileExcelOutlined />} />
				</Space>
			),
		},
	]

	return (
		<div className='analytics-reports'>
			{contextHolder}
			<div className='analytics-reports__header'>
				<div>
					<Title level={3}>Аналитика и отчеты</Title>
					<Text type='secondary'>
						Бизнес-аналитика и генерация отчетов
					</Text>
				</div>
				<Button
					type='primary'
					onClick={() => messageApi.success('Отчет создан (mock)')}
				>
					Сформировать отчет
				</Button>
			</div>

			<div className='analytics-reports__widgets'>
				{widgets.map((widget) => (
					<Card key={widget.id} className='analytics-reports__widget'>
						<Text type='secondary'>{widget.title}</Text>
						<div className='analytics-reports__widget-value'>
							{widget.value}
						</div>
						<Tag color={widget.trend.startsWith('+') ? 'green' : 'red'}>
							{widget.trend}
						</Tag>
					</Card>
				))}
			</div>

			<div className='analytics-reports__grid'>
				<Card className='analytics-reports__panel'>
					<div className='analytics-reports__panel-header'>
						<Title level={5}>Интерактивные дашборды</Title>
						<Button icon={<SettingOutlined />}>Настроить</Button>
					</div>
					<div className='analytics-reports__chart' />
				</Card>
				<Card className='analytics-reports__panel'>
					<div className='analytics-reports__panel-header'>
						<Title level={5}>Готовые отчеты</Title>
						<Space>
							<Select
								defaultValue='sales'
								options={[
									{ value: 'sales', label: 'Продажи' },
									{ value: 'risk', label: 'Риски' },
									{ value: 'ops', label: 'Операции' },
								]}
							/>
							<Button icon={<DownloadOutlined />}>
								Скачать
							</Button>
						</Space>
					</div>
					<div className='analytics-reports__chart analytics-reports__chart--small' />
				</Card>
			</div>

			<div className='analytics-reports__table'>
				<Table columns={columns} dataSource={reports} pagination={false} />
			</div>
		</div>
	)
}
