import {
	Button,
	Progress,
	Tag,
	Typography,
	message,
} from 'antd'
import {
	BarChartOutlined,
	CheckCircleOutlined,
	TeamOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons'
import {
	useAssignApplicationMutation,
	useLazyGetDailyReportQuery,
	useLazyGetManagerApplicationsQuery,
	useLazyGetTeamActivityQuery,
} from '../../../features/manager/api/manager-api'
import './manager-dashboard-page.css'

const { Title, Text } = Typography

const metrics = [
	{
		id: 1,
		label: 'Новые заявки',
		value: '126',
		delta: '+12%',
		icon: <UnorderedListOutlined />,
	},
	{
		id: 2,
		label: 'Конверсия',
		value: '18.4%',
		delta: '+2.1%',
		icon: <BarChartOutlined />,
	},
	{
		id: 3,
		label: 'Одобрено',
		value: '82',
		delta: '+6%',
		icon: <CheckCircleOutlined />,
	},
	{
		id: 4,
		label: 'Активные менеджеры',
		value: '14',
		delta: '+1',
		icon: <TeamOutlined />,
	},
]

const unassigned = [
	{
		id: 1,
		title: 'Кредит наличными',
		client: 'Иван Петров',
		amount: '240 000 ₽',
		createdAt: 'Сегодня, 10:25',
	},
	{
		id: 2,
		title: 'Ипотека',
		client: 'Мария Смирнова',
		amount: '3 200 000 ₽',
		createdAt: 'Сегодня, 09:45',
	},
	{
		id: 3,
		title: 'Депозит',
		client: 'Алексей Волков',
		amount: '500 000 ₽',
		createdAt: 'Вчера, 18:10',
	},
]

const teamActivity = [
	{
		id: 1,
		name: 'Анна Полякова',
		status: 'В сети',
		completed: 12,
		progress: 80,
	},
	{
		id: 2,
		name: 'Дмитрий Орлов',
		status: 'На проверке',
		completed: 9,
		progress: 65,
	},
	{
		id: 3,
		name: 'Екатерина Никифорова',
		status: 'В сети',
		completed: 15,
		progress: 90,
	},
]

export function ManagerDashboardPage() {
	const [messageApi, contextHolder] = message.useMessage()
	const [getDailyReport] = useLazyGetDailyReportQuery()
	const [getTeamActivity] = useLazyGetTeamActivityQuery()
	const [getManagerApplications] = useLazyGetManagerApplicationsQuery()
	const [assignApplication] = useAssignApplicationMutation()

	const handleDailyReport = () => {
		getDailyReport()
			.unwrap()
			.then(() => messageApi.success('GET /api/v1/reports/daily (mock)'))
			.catch(() => messageApi.error('Не удалось загрузить отчет'))
	}

	const handleAllApplications = () => {
		getManagerApplications({ assigned: false })
			.unwrap()
			.then(() =>
				messageApi.info(
					'GET /api/v1/manager/applications?assigned=false (mock)',
				),
			)
			.catch(() => messageApi.error('Не удалось загрузить заявки'))
	}

	const handleAssign = (applicationId: number) => {
		assignApplication({ id: String(applicationId), managerId: 1 })
			.unwrap()
			.then(() =>
				messageApi.success(
					`PATCH /api/v1/manager/applications/${applicationId}/assign (mock)`,
				),
			)
			.catch(() => messageApi.error('Не удалось назначить заявку'))
	}

	const handleTeamReport = () => {
		getTeamActivity()
			.unwrap()
			.then(() =>
				messageApi.info('GET /api/v1/analytics/team/activity (mock)'),
			)
			.catch(() => messageApi.error('Не удалось загрузить отчет'))
	}

	return (
		<div className='manager-dashboard'>
			{contextHolder}
			<div className='manager-dashboard__header'>
				<div>
					<Title level={3}>Панель менеджера</Title>
					<Text type='secondary'>Метрики и активность команды</Text>
				</div>
				<Button type='primary' onClick={handleDailyReport}>
					Отчет за день
				</Button>
			</div>

			<div className='manager-dashboard__metrics'>
				{metrics.map((metric) => (
					<div key={metric.id} className='manager-dashboard__metric-card'>
						<div className='manager-dashboard__metric-icon'>
							{metric.icon}
						</div>
						<div>
							<Text type='secondary'>{metric.label}</Text>
							<div className='manager-dashboard__metric-value'>
								{metric.value}
							</div>
						</div>
						<Tag color='green' className='manager-dashboard__metric-delta'>
							{metric.delta}
						</Tag>
					</div>
				))}
			</div>

			<div className='manager-dashboard__grid'>
				<div className='manager-dashboard__charts'>
					<div className='manager-dashboard__chart-card'>
						<div className='manager-dashboard__section-header'>
							<Title level={5}>Заявки по дням</Title>
						</div>
						<div className='manager-dashboard__chart-placeholder' />
					</div>
					<div className='manager-dashboard__chart-card'>
						<div className='manager-dashboard__section-header'>
							<Title level={5}>Конверсия</Title>
						</div>
						<div className='manager-dashboard__chart-placeholder manager-dashboard__chart-placeholder--small' />
					</div>
				</div>

				<div className='manager-dashboard__panel'>
					<div className='manager-dashboard__section-header'>
						<Title level={5}>Нераспределенные заявки</Title>
						<Button type='link' onClick={handleAllApplications}>
							Все заявки
						</Button>
					</div>
					<div className='manager-dashboard__list'>
						{unassigned.map((item) => (
							<div key={item.id} className='manager-dashboard__list-item'>
								<div>
									<div className='manager-dashboard__list-title'>
										{item.title}
									</div>
									<Text type='secondary'>
										{item.client} • {item.createdAt}
									</Text>
								</div>
								<div className='manager-dashboard__list-meta'>
									<Text>{item.amount}</Text>
									<Button
										size='small'
										onClick={() => handleAssign(item.id)}
									>
										Назначить
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className='manager-dashboard__panel'>
					<div className='manager-dashboard__section-header'>
						<Title level={5}>Активность команды</Title>
						<Button type='link' onClick={handleTeamReport}>
							Отчет
						</Button>
					</div>
					<div className='manager-dashboard__team'>
						{teamActivity.map((member) => (
							<div key={member.id} className='manager-dashboard__team-item'>
								<div>
									<div className='manager-dashboard__list-title'>
										{member.name}
									</div>
									<Text type='secondary'>{member.status}</Text>
								</div>
								<div className='manager-dashboard__team-meta'>
									<Text>{member.completed} заявок</Text>
									<Progress percent={member.progress} showInfo={false} />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
