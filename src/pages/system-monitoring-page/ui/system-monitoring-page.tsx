import {
	Card,
	Progress,
	Table,
	Tag,
	Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import './system-monitoring-page.css'

const { Title, Text } = Typography

const services = [
	{ id: 1, name: 'Auth Service', status: 'UP' },
	{ id: 2, name: 'Product Service', status: 'UP' },
	{ id: 3, name: 'Application Service', status: 'WARN' },
	{ id: 4, name: 'Notification Service', status: 'DOWN' },
]

const metrics = [
	{ id: 1, label: 'CPU', value: 62 },
	{ id: 2, label: 'Memory', value: 71 },
	{ id: 3, label: 'DB', value: 48 },
]

const alerts = [
	{
		id: 1,
		title: 'Высокая нагрузка CPU',
		level: 'HIGH',
		time: 'Сегодня, 12:30',
	},
	{
		id: 2,
		title: 'Ошибка доставки уведомлений',
		level: 'MEDIUM',
		time: 'Сегодня, 11:15',
	},
]

const logs = [
	{
		key: '1',
		service: 'Notification Service',
		message: 'Timeout при отправке email',
		time: '12:21',
		level: 'ERROR',
	},
	{
		key: '2',
		service: 'Application Service',
		message: 'Slow query detected',
		time: '11:58',
		level: 'WARN',
	},
]

export function SystemMonitoringPage() {
	const columns: ColumnsType<typeof logs[number]> = [
		{ title: 'Сервис', dataIndex: 'service', key: 'service' },
		{ title: 'Сообщение', dataIndex: 'message', key: 'message' },
		{ title: 'Время', dataIndex: 'time', key: 'time' },
		{
			title: 'Уровень',
			dataIndex: 'level',
			key: 'level',
			render: (value: string) => (
				<Tag color={value === 'ERROR' ? 'red' : 'orange'}>{value}</Tag>
			),
		},
	]

	return (
		<div className='system-monitoring'>
			<div className='system-monitoring__header'>
				<Title level={3}>Мониторинг системы</Title>
				<Text type='secondary'>Здоровье сервисов и метрики</Text>
			</div>

			<div className='system-monitoring__services'>
				{services.map((service) => (
					<Card key={service.id} className='system-monitoring__service-card'>
						<Text>{service.name}</Text>
						<Tag
							color={
								service.status === 'UP'
									? 'green'
									: service.status === 'WARN'
										? 'orange'
										: 'red'
							}
						>
							{service.status}
						</Tag>
					</Card>
				))}
			</div>

			<div className='system-monitoring__metrics'>
				{metrics.map((metric) => (
					<Card key={metric.id} className='system-monitoring__metric-card'>
						<Text>{metric.label}</Text>
						<Progress percent={metric.value} showInfo />
					</Card>
				))}
			</div>

			<div className='system-monitoring__grid'>
				<div className='system-monitoring__panel'>
					<Title level={5}>Графики нагрузки</Title>
					<div className='system-monitoring__chart' />
				</div>
				<div className='system-monitoring__panel'>
					<Title level={5}>Алерты и инциденты</Title>
					<div className='system-monitoring__alerts'>
						{alerts.map((alert) => (
							<div key={alert.id} className='system-monitoring__alert'>
								<Text strong>{alert.title}</Text>
								<Text type='secondary'>{alert.time}</Text>
								<Tag color={alert.level === 'HIGH' ? 'red' : 'orange'}>
									{alert.level}
								</Tag>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className='system-monitoring__panel'>
				<Title level={5}>Логи последних ошибок</Title>
				<Table columns={columns} dataSource={logs} pagination={false} />
			</div>
		</div>
	)
}
