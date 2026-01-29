import {
	Button,
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
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import { CreateProductModal } from '../../../features/product/ui/create-product-modal'
import './product-management-page.css'

const { Title, Text } = Typography

interface ProductRow {
	key: string
	name: string
	code: string
	type: 'CREDIT' | 'DEPOSIT' | 'INVESTMENT'
	rate: string
	currency: string
	status: 'ACTIVE' | 'INACTIVE'
	updatedAt: string
}

const products: ProductRow[] = [
	{
		key: '1',
		name: 'Кредит наличными',
		code: 'CRD-001',
		type: 'CREDIT',
		rate: '12.5%',
		currency: 'RUB',
		status: 'ACTIVE',
		updatedAt: '19.01.2026',
	},
	{
		key: '2',
		name: 'Депозит «Надежный»',
		code: 'DEP-008',
		type: 'DEPOSIT',
		rate: '8.2%',
		currency: 'RUB',
		status: 'ACTIVE',
		updatedAt: '15.01.2026',
	},
	{
		key: '3',
		name: 'Инвестиционный пакет',
		code: 'INV-010',
		type: 'INVESTMENT',
		rate: '10.1%',
		currency: 'USD',
		status: 'INACTIVE',
		updatedAt: '10.01.2026',
	},
]

const auditHistory = [
	{
		id: 1,
		action: 'Обновлена ставка',
		meta: 'CRD-001 • 12.5%',
		date: '19.01.2026 12:45',
	},
	{
		id: 2,
		action: 'Изменен статус',
		meta: 'INV-010 • INACTIVE',
		date: '10.01.2026 09:20',
	},
]

export function ProductManagementPage() {
	const [messageApi, contextHolder] = message.useMessage()
	const [isCreateOpen, setIsCreateOpen] = useState(false)

	const columns: ColumnsType<ProductRow> = [
		{ title: 'Продукт', dataIndex: 'name', key: 'name' },
		{ title: 'Код', dataIndex: 'code', key: 'code' },
		{
			title: 'Тип',
			dataIndex: 'type',
			key: 'type',
			render: (value: ProductRow['type']) => (
				<Tag color={value === 'CREDIT' ? 'blue' : value === 'DEPOSIT' ? 'green' : 'purple'}>
					{value}
				</Tag>
			),
		},
		{ title: 'Ставка', dataIndex: 'rate', key: 'rate' },
		{ title: 'Валюта', dataIndex: 'currency', key: 'currency' },
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
			render: (value: ProductRow['status']) => (
				<Tag color={value === 'ACTIVE' ? 'green' : 'red'}>
					{value === 'ACTIVE' ? 'Активен' : 'Неактивен'}
				</Tag>
			),
		},
		{ title: 'Обновлено', dataIndex: 'updatedAt', key: 'updatedAt' },
		{
			title: 'Действия',
			key: 'actions',
			render: () => (
				<Space>
					<Button icon={<EditOutlined />}>Редактировать</Button>
					<Button danger icon={<DeleteOutlined />}>
						Удалить
					</Button>
				</Space>
			),
		},
	]

	return (
		<div className='product-management'>
			{contextHolder}
			<div className='product-management__header'>
				<div>
					<Title level={3}>Управление продуктами</Title>
					<Text type='secondary'>Создание и редактирование продуктов</Text>
				</div>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsCreateOpen(true)}>
					Добавить продукт
				</Button>
			</div>

			<div className='product-management__filters'>
				<Select
					placeholder='Тип'
					options={[
						{ value: 'CREDIT', label: 'Кредит' },
						{ value: 'DEPOSIT', label: 'Депозит' },
						{ value: 'INVESTMENT', label: 'Инвестиции' },
					]}
				/>
				<Select
					placeholder='Статус'
					options={[
						{ value: 'ACTIVE', label: 'Активен' },
						{ value: 'INACTIVE', label: 'Неактивен' },
					]}
				/>
				<Input placeholder='Поиск по названию' />
			</div>

			<div className='product-management__grid'>
				<div className='product-management__table'>
					<Table columns={columns} dataSource={products} pagination={false} />
				</div>
				<div className='product-management__side'>
					<div className='product-management__audit'>
						<div className='product-management__section-header'>
							<Title level={5}>История изменений</Title>
							<Button type='link'>Вся история</Button>
						</div>
						<div className='product-management__audit-list'>
							{auditHistory.map((item) => (
								<div key={item.id} className='product-management__audit-item'>
									<div className='product-management__audit-title'>
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

			<CreateProductModal
				open={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
			/>
		</div>
	)
}
