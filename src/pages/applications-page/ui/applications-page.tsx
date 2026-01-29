import {
	Button,
	Input,
	Progress,
	Select,
	Tag,
	Typography,
	Upload,
	message,
} from 'antd'
import {
	UploadOutlined,
	PlusOutlined,
} from '@ant-design/icons'
import './applications-page.css'

const { Title, Text } = Typography

const applications = [
	{
		id: 1,
		title: 'Кредит наличными',
		status: 'PROCESSING',
		progress: 60,
		amount: '250 000 ₽',
		createdAt: '18.01.2026',
	},
	{
		id: 2,
		title: 'Депозит «Надежный»',
		status: 'APPROVED',
		progress: 100,
		amount: '500 000 ₽',
		createdAt: '12.01.2026',
	},
	{
		id: 3,
		title: 'Ипотека',
		status: 'NEW',
		progress: 20,
		amount: '3 000 000 ₽',
		createdAt: '10.01.2026',
	},
]

export function ApplicationsPage() {
	const [messageApi, contextHolder] = message.useMessage()

	const handleUpload = () => {
		messageApi.success('Документ загружен (mock)')
		return false
	}

	return (
		<div className='applications'>
			{contextHolder}
			<div className='applications__header'>
				<div>
					<Title level={3}>Мои заявки</Title>
					<Text type='secondary'>
						Просмотр статуса заявок и загрузка документов
					</Text>
				</div>
				<Button type='primary' icon={<PlusOutlined />}>
					Подать новую
				</Button>
			</div>

			<div className='applications__filters'>
				<Select
					placeholder='Статус'
					options={[
						{ value: 'NEW', label: 'Новая' },
						{ value: 'PROCESSING', label: 'В обработке' },
						{ value: 'APPROVED', label: 'Одобрена' },
						{ value: 'REJECTED', label: 'Отклонена' },
					]}
				/>
				<Select
					placeholder='Продукт'
					options={[
						{ value: 'credit', label: 'Кредит' },
						{ value: 'deposit', label: 'Депозит' },
						{ value: 'mortgage', label: 'Ипотека' },
					]}
				/>
				<Input placeholder='Поиск по заявкам' />
			</div>

			<div className='applications__grid'>
				{applications.map((item) => (
					<div key={item.id} className='applications__card'>
						<div className='applications__card-header'>
							<div>
								<div className='applications__title'>{item.title}</div>
								<Text type='secondary'>Создано {item.createdAt}</Text>
							</div>
							<Tag
								color={
									item.status === 'APPROVED'
										? 'green'
										: item.status === 'REJECTED'
											? 'red'
											: item.status === 'PROCESSING'
												? 'orange'
												: 'blue'
								}
							>
								{item.status === 'APPROVED'
									? 'Одобрена'
									: item.status === 'REJECTED'
										? 'Отклонена'
										: item.status === 'PROCESSING'
											? 'В обработке'
											: 'Новая'}
							</Tag>
						</div>
						<div className='applications__amount'>{item.amount}</div>
						<Progress percent={item.progress} showInfo={false} />
						<div className='applications__actions'>
							<Upload showUploadList={false} beforeUpload={handleUpload}>
								<Button icon={<UploadOutlined />}>
									Загрузить документ
								</Button>
							</Upload>
							<Button type='link'>Отменить</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
