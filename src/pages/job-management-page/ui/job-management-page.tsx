import {
	Button,
	Select,
	Table,
	Tag,
	Typography,
	message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
	ClockCircleOutlined,
	PlayCircleOutlined,
	StopOutlined,
} from '@ant-design/icons'
import './job-management-page.css'

const { Title, Text } = Typography

interface JobRow {
	key: string
	name: string
	type: string
	schedule: string
	status: 'ACTIVE' | 'PAUSED'
	lastRun: string
}

const jobs: JobRow[] = [
	{
		key: '1',
		name: 'Ночная синхронизация',
		type: 'SYNC',
		schedule: '0 0 * * *',
		status: 'ACTIVE',
		lastRun: '19.01.2026 02:00',
	},
	{
		key: '2',
		name: 'Пересчет лимитов',
		type: 'LIMITS',
		schedule: '0 */6 * * *',
		status: 'ACTIVE',
		lastRun: '19.01.2026 12:00',
	},
	{
		key: '3',
		name: 'Очистка логов',
		type: 'CLEANUP',
		schedule: '0 3 * * 0',
		status: 'PAUSED',
		lastRun: '12.01.2026 03:00',
	},
]

const executions = [
	{
		id: 1,
		name: 'Ночная синхронизация',
		status: 'SUCCESS',
		time: '19.01.2026 02:00',
	},
	{
		id: 2,
		name: 'Пересчет лимитов',
		status: 'FAILED',
		time: '18.01.2026 18:00',
	},
]

const logs = [
	{
		id: 1,
		message: 'Job SYNC выполнен за 1200ms',
		time: '19.01.2026 02:00:15',
	},
	{
		id: 2,
		message: 'Job LIMITS завершился с ошибкой timeout',
		time: '18.01.2026 18:00:43',
	},
]

export function JobManagementPage() {
	const [messageApi, contextHolder] = message.useMessage()

	const columns: ColumnsType<JobRow> = [
		{ title: 'Задача', dataIndex: 'name', key: 'name' },
		{ title: 'Тип', dataIndex: 'type', key: 'type' },
		{ title: 'Расписание', dataIndex: 'schedule', key: 'schedule' },
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
			render: (value: JobRow['status']) => (
				<Tag color={value === 'ACTIVE' ? 'green' : 'orange'}>
					{value === 'ACTIVE' ? 'Активна' : 'Пауза'}
				</Tag>
			),
		},
		{ title: 'Последний запуск', dataIndex: 'lastRun', key: 'lastRun' },
		{
			title: 'Действия',
			key: 'actions',
			render: () => (
				<div className='job-management__actions'>
					<Button icon={<PlayCircleOutlined />}>Запуск</Button>
					<Button icon={<StopOutlined />}>Отмена</Button>
				</div>
			),
		},
	]

	return (
		<div className='job-management'>
			{contextHolder}
			<div className='job-management__header'>
				<div>
					<Title level={3}>Управление задачами</Title>
					<Text type='secondary'>Фоновые задачи и расписания</Text>
				</div>
				<Button
					type='primary'
					icon={<ClockCircleOutlined />}
					onClick={() => messageApi.success('Расписание сохранено (mock)')}
				>
					Настроить расписание
				</Button>
			</div>

			<div className='job-management__filters'>
				<Select
					placeholder='Тип задачи'
					options={[
						{ value: 'SYNC', label: 'SYNC' },
						{ value: 'LIMITS', label: 'LIMITS' },
						{ value: 'CLEANUP', label: 'CLEANUP' },
					]}
				/>
				<Select
					placeholder='Статус'
					options={[
						{ value: 'ACTIVE', label: 'Активна' },
						{ value: 'PAUSED', label: 'Пауза' },
					]}
				/>
			</div>

			<div className='job-management__grid'>
				<div className='job-management__table'>
					<Table columns={columns} dataSource={jobs} pagination={false} />
				</div>
				<div className='job-management__side'>
					<div className='job-management__panel'>
						<Title level={5}>История выполнения</Title>
						<div className='job-management__history'>
							{executions.map((item) => (
								<div key={item.id} className='job-management__history-item'>
									<div>
										<div className='job-management__history-title'>
											{item.name}
										</div>
										<Text type='secondary'>{item.time}</Text>
									</div>
									<Tag
										color={item.status === 'SUCCESS' ? 'green' : 'red'}
									>
										{item.status}
									</Tag>
								</div>
							))}
						</div>
					</div>
					<div className='job-management__panel'>
						<Title level={5}>Логи выполнения</Title>
						<div className='job-management__logs'>
							{logs.map((item) => (
								<div key={item.id} className='job-management__log-item'>
									<Text>{item.message}</Text>
									<Text type='secondary'>{item.time}</Text>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
