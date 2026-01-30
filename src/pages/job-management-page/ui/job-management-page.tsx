import {
	Button,
	Input,
	Modal,
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
import { useMemo, useState } from 'react'
import {
	useCancelJobMutation,
	useExecuteJobMutation,
	useLazyGetJobsQuery,
	useLazyGetJobTypesQuery,
	useScheduleJobMutation,
} from '../../../features/jobs/api/job-api'
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
	const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined)
	const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
	const [isScheduleOpen, setIsScheduleOpen] = useState(false)
	const [scheduleType, setScheduleType] = useState<string | undefined>(undefined)
	const [scheduleCron, setScheduleCron] = useState('')
	const [loadJobs] = useLazyGetJobsQuery()
	const [loadJobTypes] = useLazyGetJobTypesQuery()
	const [scheduleJob] = useScheduleJobMutation()
	const [executeJob] = useExecuteJobMutation()
	const [cancelJob] = useCancelJobMutation()

	const filteredJobs = useMemo(() => {
		return jobs.filter((job) => {
			if (typeFilter && job.type !== typeFilter) {
				return false
			}

			if (statusFilter && job.status !== statusFilter) {
				return false
			}

			return true
		})
	}, [statusFilter, typeFilter])

	const handleFiltersApply = () => {
		loadJobs({
			type: typeFilter,
			status: statusFilter,
		})
			.unwrap()
			.then(() => messageApi.success('GET /api/v1/jobs (mock)'))
			.catch(() => messageApi.error('Не удалось загрузить задачи'))
	}

	const handleScheduleOpen = () => {
		loadJobTypes()
			.unwrap()
			.then(() => messageApi.info('GET /api/v1/jobs/types (mock)'))
			.catch(() => messageApi.error('Не удалось загрузить типы задач'))
		setIsScheduleOpen(true)
	}

	const handleScheduleSave = () => {
		if (!scheduleType || !scheduleCron.trim()) {
			messageApi.info('Заполните тип задачи и расписание')
			return
		}

		scheduleJob({ jobType: scheduleType, cron: scheduleCron.trim() })
			.unwrap()
			.then(() => {
				messageApi.success('POST /api/v1/jobs/schedule (mock)')
				setIsScheduleOpen(false)
			})
			.catch(() => messageApi.error('Не удалось сохранить расписание'))
	}

	const handleExecute = (type: string) => {
		executeJob({ jobType: type })
			.unwrap()
			.then(() => messageApi.success('POST /api/v1/jobs/execute (mock)'))
			.catch(() => messageApi.error('Не удалось запустить задачу'))
	}

	const handleCancel = (id: string) => {
		cancelJob({ id })
			.unwrap()
			.then(() => messageApi.success(`POST /api/v1/jobs/${id}/cancel (mock)`))
			.catch(() => messageApi.error('Не удалось отменить задачу'))
	}

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
			render: (_, record) => (
				<div className='job-management__actions'>
					<Button
						icon={<PlayCircleOutlined />}
						onClick={() => handleExecute(record.type)}
					>
						Запуск
					</Button>
					<Button
						icon={<StopOutlined />}
						onClick={() => handleCancel(record.key)}
					>
						Отмена
					</Button>
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
					onClick={handleScheduleOpen}
				>
					Настроить расписание
				</Button>
			</div>

			<div className='job-management__filters'>
				<Select
					placeholder='Тип задачи'
					value={typeFilter}
					onChange={(value) => setTypeFilter(value)}
					allowClear
					options={[
						{ value: 'SYNC', label: 'SYNC' },
						{ value: 'LIMITS', label: 'LIMITS' },
						{ value: 'CLEANUP', label: 'CLEANUP' },
					]}
				/>
				<Select
					placeholder='Статус'
					value={statusFilter}
					onChange={(value) => setStatusFilter(value)}
					allowClear
					options={[
						{ value: 'ACTIVE', label: 'Активна' },
						{ value: 'PAUSED', label: 'Пауза' },
					]}
				/>
				<Button onClick={handleFiltersApply}>Фильтр</Button>
			</div>

			<div className='job-management__grid'>
				<div className='job-management__table'>
					<Table columns={columns} dataSource={filteredJobs} pagination={false} />
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
			<Modal
				open={isScheduleOpen}
				title='Настроить расписание'
				onCancel={() => setIsScheduleOpen(false)}
				onOk={handleScheduleSave}
				okText='Сохранить'
				cancelText='Отмена'
			>
				<div className='job-management__modal'>
					<Select
						placeholder='Тип задачи'
						value={scheduleType}
						onChange={(value) => setScheduleType(value)}
						options={[
							{ value: 'SYNC', label: 'SYNC' },
							{ value: 'LIMITS', label: 'LIMITS' },
							{ value: 'CLEANUP', label: 'CLEANUP' },
						]}
					/>
					<Input
						placeholder='Cron выражение'
						value={scheduleCron}
						onChange={(event) => setScheduleCron(event.target.value)}
					/>
				</div>
			</Modal>
		</div>
	)
}
