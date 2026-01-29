import {
	Button,
	Input,
	Select,
	Table,
	Tag,
	Typography,
	message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
	DeleteOutlined,
	EditOutlined,
	ReloadOutlined,
} from '@ant-design/icons'
import './system-configuration-page.css'

const { Title, Text } = Typography

interface ConfigRow {
	key: string
	category: 'SYSTEM' | 'BUSINESS' | 'INTEGRATION'
	value: string
	updatedAt: string
}

const configs: ConfigRow[] = [
	{
		key: 'system.session.timeout',
		category: 'SYSTEM',
		value: '30m',
		updatedAt: '19.01.2026 12:00',
	},
	{
		key: 'business.loan.maxRate',
		category: 'BUSINESS',
		value: '18%',
		updatedAt: '18.01.2026 09:20',
	},
	{
		key: 'integration.sms.provider',
		category: 'INTEGRATION',
		value: 'Twilio',
		updatedAt: '17.01.2026 16:30',
	},
]

const history = [
	{
		id: 1,
		action: 'Изменено значение',
		meta: 'system.session.timeout → 30m',
		date: '19.01.2026 12:00',
	},
	{
		id: 2,
		action: 'Добавлен ключ',
		meta: 'business.loan.maxRate → 18%',
		date: '18.01.2026 09:20',
	},
]

export function SystemConfigurationPage() {
	const [messageApi, contextHolder] = message.useMessage()

	const columns: ColumnsType<ConfigRow> = [
		{ title: 'Ключ', dataIndex: 'key', key: 'key' },
		{
			title: 'Категория',
			dataIndex: 'category',
			key: 'category',
			render: (value: ConfigRow['category']) => (
				<Tag
					color={
						value === 'SYSTEM'
							? 'blue'
							: value === 'BUSINESS'
								? 'green'
								: 'purple'
					}
				>
					{value}
				</Tag>
			),
		},
		{ title: 'Значение', dataIndex: 'value', key: 'value' },
		{ title: 'Обновлено', dataIndex: 'updatedAt', key: 'updatedAt' },
		{
			title: 'Действия',
			key: 'actions',
			render: () => (
				<div className='system-configuration__actions'>
					<Button icon={<EditOutlined />}>Редактировать</Button>
					<Button danger icon={<DeleteOutlined />}>
						Удалить
					</Button>
				</div>
			),
		},
	]

	return (
		<div className='system-configuration'>
			{contextHolder}
			<div className='system-configuration__header'>
				<div>
					<Title level={3}>Конфигурация системы</Title>
					<Text type='secondary'>Управление настройками системы</Text>
				</div>
				<Button
					type='primary'
					icon={<ReloadOutlined />}
					onClick={() => messageApi.success('Конфигурация обновлена (mock)')}
				>
					Обновить
				</Button>
			</div>

			<div className='system-configuration__filters'>
				<Select
					placeholder='Раздел'
					options={[
						{ value: 'SYSTEM', label: 'Системные' },
						{ value: 'BUSINESS', label: 'Бизнес-правила' },
						{ value: 'INTEGRATION', label: 'Интеграции' },
					]}
				/>
				<Input placeholder='Поиск по ключу' />
			</div>

			<div className='system-configuration__grid'>
				<div className='system-configuration__table'>
					<Table columns={columns} dataSource={configs} pagination={false} />
				</div>
				<div className='system-configuration__side'>
					<div className='system-configuration__history'>
						<div className='system-configuration__section-header'>
							<Title level={5}>История изменений</Title>
							<Button type='link'>Вся история</Button>
						</div>
						<div className='system-configuration__history-list'>
							{history.map((item) => (
								<div key={item.id} className='system-configuration__history-item'>
									<div className='system-configuration__history-title'>
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
