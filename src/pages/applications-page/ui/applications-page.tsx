import {
	Button,
	Input,
	Modal,
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
import { useMemo, useState } from 'react'
import { mockProducts } from '../../../shared/lib/mock-products'
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
	const [statusFilter, setStatusFilter] = useState<string | undefined>(
		undefined,
	)
	const [productFilter, setProductFilter] = useState<string | undefined>(
		undefined,
	)
	const [searchQuery, setSearchQuery] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)

	const filteredApplications = useMemo(() => {
		const query = searchQuery.trim().toLowerCase()

		return applications.filter((item) => {
			if (statusFilter && item.status !== statusFilter) {
				return false
			}

			if (
				productFilter &&
				!item.title.toLowerCase().includes(productFilter)
			) {
				return false
			}

			if (!query) {
				return true
			}

			return item.title.toLowerCase().includes(query)
		})
	}, [productFilter, searchQuery, statusFilter])

	const handleUpload = () => {
		messageApi.success('POST /api/v1/documents/upload (mock)')
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
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => setIsModalOpen(true)}
				>
					Подать новую
				</Button>
			</div>

			<div className='applications__filters'>
				<Select
					placeholder='Статус'
					value={statusFilter}
					onChange={(value) => setStatusFilter(value)}
					allowClear
					options={[
						{ value: 'NEW', label: 'Новая' },
						{ value: 'PROCESSING', label: 'В обработке' },
						{ value: 'APPROVED', label: 'Одобрена' },
						{ value: 'REJECTED', label: 'Отклонена' },
					]}
				/>
				<Select
					placeholder='Продукт'
					value={productFilter}
					onChange={(value) => setProductFilter(value)}
					allowClear
					options={[
						{ value: 'кредит', label: 'Кредит' },
						{ value: 'депозит', label: 'Депозит' },
						{ value: 'ипотека', label: 'Ипотека' },
					]}
				/>
				<Input
					placeholder='Поиск по заявкам'
					value={searchQuery}
					onChange={(event) => setSearchQuery(event.target.value)}
				/>
			</div>

			<div className='applications__grid'>
				{filteredApplications.map((item) => (
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
							<Button
								type='link'
								onClick={() =>
									messageApi.success(
										`PATCH /api/v1/applications/${item.id}/cancel (mock)`,
									)
								}
							>
								Отменить
							</Button>
						</div>
					</div>
				))}
			</div>
			<Modal
				open={isModalOpen}
				title='Новая заявка'
				onCancel={() => setIsModalOpen(false)}
				onOk={() => {
					messageApi.success('POST /api/v1/applications (mock)')
					setIsModalOpen(false)
				}}
				okText='Подать'
				cancelText='Отмена'
			>
				<div className='applications__modal'>
					<Select
						placeholder='Продукт'
						options={mockProducts.map((product) => ({
							value: product.id,
							label: product.name,
						}))}
					/>
					<Input placeholder='Сумма' />
					<Input placeholder='Срок (мес)' />
					<Select
						placeholder='Валюта'
						options={[
							{ value: 'RUB', label: 'RUB' },
							{ value: 'USD', label: 'USD' },
							{ value: 'EUR', label: 'EUR' },
						]}
					/>
				</div>
			</Modal>
		</div>
	)
}
