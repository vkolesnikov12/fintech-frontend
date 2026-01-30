import {
	Button,
	Card,
	Input,
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
import { useMemo, useState } from 'react'
import {
	useLazyGetAnalyticsDashboardQuery,
	useLazyGetAnalyticsWidgetsQuery,
} from '../../../features/analytics/api/analytics-api'
import {
	type ReportFormat,
	useGenerateReportMutation,
	useLazyDownloadReportQuery,
	useLazyGetReportsQuery,
	useScheduleReportMutation,
} from '../../../features/reports/api/reports-api'
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
	const [reportType, setReportType] = useState<'SALES' | 'RISK' | 'OPERATIONS' | undefined>(
		undefined,
	)
	const [reportStatus, setReportStatus] = useState<'READY' | 'PROCESSING' | undefined>(
		undefined,
	)
	const [searchQuery, setSearchQuery] = useState('')
	const [period, setPeriod] = useState('MONTH')
	const [loadReports] = useLazyGetReportsQuery()
	const [generateReport] = useGenerateReportMutation()
	const [downloadReport] = useLazyDownloadReportQuery()
	const [scheduleReport] = useScheduleReportMutation()
	const [loadWidgets] = useLazyGetAnalyticsWidgetsQuery()
	const [loadDashboard] = useLazyGetAnalyticsDashboardQuery()

	const filteredReports = useMemo(() => {
		const query = searchQuery.trim().toLowerCase()

		return reports.filter((item) => {
			if (reportType && item.type !== reportType) {
				return false
			}

			if (reportStatus && item.status !== reportStatus) {
				return false
			}

			if (!query) {
				return true
			}

			return item.name.toLowerCase().includes(query)
		})
	}, [reportStatus, reportType, searchQuery])

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
			render: (_, record) => (
				<Space>
					<Button
						icon={<FilePdfOutlined />}
						onClick={() => handleDownload(record.key, 'PDF')}
					/>
					<Button
						icon={<FileExcelOutlined />}
						onClick={() => handleDownload(record.key, 'XLSX')}
					/>
				</Space>
			),
		},
	]

	const handleGenerate = () => {
		generateReport({
			type: reportType ?? 'SALES',
			period,
		})
			.unwrap()
			.then(() => messageApi.success('POST /api/v1/reports/generate (mock)'))
			.catch(() => messageApi.error('Не удалось сформировать отчет'))
	}

	const handleDownload = (id: string, format: ReportFormat) => {
		downloadReport({ id, format })
			.unwrap()
			.then(() =>
				messageApi.success(
					`GET /api/v1/reports/${id}/download?format=${format} (mock)`,
				),
			)
			.catch(() => messageApi.error('Не удалось скачать отчет'))
	}

	const handleFilterApply = () => {
		loadReports({
			type: reportType,
			status: reportStatus,
			search: searchQuery.trim() || undefined,
		})
			.unwrap()
			.then(() => messageApi.success('GET /api/v1/reports (mock)'))
			.catch(() => messageApi.error('Не удалось загрузить отчеты'))
	}

	const handleSchedule = () => {
		scheduleReport({
			type: reportType ?? 'SALES',
			cron: '0 9 * * 1',
		})
			.unwrap()
			.then(() => messageApi.success('POST /api/v1/reports/scheduled (mock)'))
			.catch(() => messageApi.error('Не удалось настроить расписание'))
	}

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
					onClick={handleGenerate}
				>
					Сформировать отчет
				</Button>
			</div>

			<div className='analytics-reports__widgets'>
				{widgets.map((widget) => (
					<Card
						key={widget.id}
						className='analytics-reports__widget'
						onClick={() =>
							loadWidgets({ period: period as 'MONTH' | 'DAY' | 'WEEK' | 'YEAR' })
								.unwrap()
								.then(() =>
									messageApi.success('GET /api/v1/analytics/widgets (mock)'),
								)
								.catch(() => messageApi.error('Не удалось загрузить виджеты'))
						}
					>
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
						<Button
							icon={<SettingOutlined />}
							onClick={() =>
								loadDashboard({ type: reportType })
									.unwrap()
									.then(() =>
										messageApi.success(
											'GET /api/v1/analytics/dashboard (mock)',
										),
									)
									.catch(() =>
										messageApi.error('Не удалось загрузить дашборд'),
									)
							}
						>
							Настроить
						</Button>
					</div>
					<div className='analytics-reports__chart' />
				</Card>
				<Card className='analytics-reports__panel'>
					<div className='analytics-reports__panel-header'>
						<Title level={5}>Готовые отчеты</Title>
						<Space>
							<Select
								value={reportType ?? 'SALES'}
								onChange={(value) =>
									setReportType(value as 'SALES' | 'RISK' | 'OPERATIONS')
								}
								options={[
									{ value: 'SALES', label: 'Продажи' },
									{ value: 'RISK', label: 'Риски' },
									{ value: 'OPERATIONS', label: 'Операции' },
								]}
							/>
							<Button
								icon={<DownloadOutlined />}
								onClick={() => handleDownload('latest', 'PDF')}
							>
								Скачать
							</Button>
						</Space>
					</div>
					<div className='analytics-reports__chart analytics-reports__chart--small' />
				</Card>
			</div>

			<div className='analytics-reports__filters'>
				<Select
					placeholder='Тип отчета'
					value={reportType}
					onChange={(value) =>
						setReportType(value as 'SALES' | 'RISK' | 'OPERATIONS')
					}
					allowClear
					options={[
						{ value: 'SALES', label: 'Продажи' },
						{ value: 'RISK', label: 'Риски' },
						{ value: 'OPERATIONS', label: 'Операции' },
					]}
				/>
				<Select
					placeholder='Статус'
					value={reportStatus}
					onChange={(value) =>
						setReportStatus(value as 'READY' | 'PROCESSING')
					}
					allowClear
					options={[
						{ value: 'READY', label: 'Готов' },
						{ value: 'PROCESSING', label: 'В обработке' },
					]}
				/>
				<Select
					placeholder='Период'
					value={period}
					onChange={(value) => setPeriod(value)}
					options={[
						{ value: 'DAY', label: 'День' },
						{ value: 'WEEK', label: 'Неделя' },
						{ value: 'MONTH', label: 'Месяц' },
						{ value: 'YEAR', label: 'Год' },
					]}
				/>
				<Input
					placeholder='Поиск по отчетам'
					value={searchQuery}
					onChange={(event) => setSearchQuery(event.target.value)}
				/>
				<Button onClick={handleFilterApply}>Фильтр</Button>
				<Button onClick={handleSchedule}>Экспорт по расписанию</Button>
			</div>

			<div className='analytics-reports__table'>
				<Table columns={columns} dataSource={filteredReports} pagination={false} />
			</div>
		</div>
	)
}
