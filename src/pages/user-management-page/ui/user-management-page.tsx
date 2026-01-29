import {
	Button,
	Input,
	Modal,
	Select,
	Switch,
	Table,
	Tag,
	Typography,
	message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import './user-management-page.css'

const { Title, Text } = Typography

interface UserRow {
	key: string
	name: string
	email: string
	role: 'CLIENT' | 'MANAGER' | 'ADMIN'
	status: 'ACTIVE' | 'BLOCKED'
}

const users: UserRow[] = [
	{
		key: '1',
		name: 'Виталий Иванов',
		email: 'vitaly@bankfintech.ru',
		role: 'CLIENT',
		status: 'ACTIVE',
	},
	{
		key: '2',
		name: 'Анна Полякова',
		email: 'anna@bankfintech.ru',
		role: 'MANAGER',
		status: 'ACTIVE',
	},
	{
		key: '3',
		name: 'Петр Орлов',
		email: 'petr@bankfintech.ru',
		role: 'ADMIN',
		status: 'BLOCKED',
	},
]

const history = [
	{
		id: 1,
		action: 'Назначена роль MANAGER',
		meta: 'Анна Полякова',
		date: '19.01.2026 12:45',
	},
	{
		id: 2,
		action: 'Сброс пароля',
		meta: 'Петр Орлов',
		date: '18.01.2026 10:20',
	},
]

export function UserManagementPage() {
	const [messageApi, contextHolder] = message.useMessage()
	const [isModalOpen, setIsModalOpen] = useState(false)

	const columns: ColumnsType<UserRow> = [
		{ title: 'Пользователь', dataIndex: 'name', key: 'name' },
		{ title: 'Email', dataIndex: 'email', key: 'email' },
		{
			title: 'Роль',
			dataIndex: 'role',
			key: 'role',
			render: (value: UserRow['role']) => (
				<Tag color={value === 'ADMIN' ? 'purple' : value === 'MANAGER' ? 'blue' : 'green'}>
					{value}
				</Tag>
			),
		},
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
			render: (value: UserRow['status']) => (
				<Tag color={value === 'ACTIVE' ? 'green' : 'red'}>
					{value === 'ACTIVE' ? 'Активен' : 'Заблокирован'}
				</Tag>
			),
		},
		{
			title: 'Активировать',
			key: 'activate',
			render: (_, record) => (
				<Switch
					checked={record.status === 'ACTIVE'}
					onChange={() => messageApi.success('Статус обновлен (mock)')}
				/>
			),
		},
		{
			title: 'Действия',
			key: 'actions',
			render: () => (
				<Button onClick={() => messageApi.success('Сброс пароля (mock)')}>
					Сбросить пароль
				</Button>
			),
		},
	]

	return (
		<div className='user-management'>
			{contextHolder}
			<div className='user-management__header'>
				<div>
					<Title level={3}>Управление пользователями</Title>
					<Text type='secondary'>Учетные записи и роли</Text>
				</div>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
					Добавить пользователя
				</Button>
			</div>

			<div className='user-management__filters'>
				<Select
					placeholder='Роль'
					options={[
						{ value: 'CLIENT', label: 'Клиент' },
						{ value: 'MANAGER', label: 'Менеджер' },
						{ value: 'ADMIN', label: 'Админ' },
					]}
				/>
				<Select
					placeholder='Статус'
					options={[
						{ value: 'ACTIVE', label: 'Активен' },
						{ value: 'BLOCKED', label: 'Заблокирован' },
					]}
				/>
				<Input placeholder='Поиск по имени или email' />
			</div>

			<div className='user-management__grid'>
				<div className='user-management__table'>
					<Table columns={columns} dataSource={users} pagination={false} />
				</div>
				<div className='user-management__side'>
					<div className='user-management__history'>
						<div className='user-management__section-header'>
							<Title level={5}>История действий</Title>
							<Button type='link'>Вся история</Button>
						</div>
						<div className='user-management__history-list'>
							{history.map((item) => (
								<div key={item.id} className='user-management__history-item'>
									<div className='user-management__history-title'>
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

			<Modal
				open={isModalOpen}
				title='Создать пользователя'
				onCancel={() => setIsModalOpen(false)}
				onOk={() => {
					messageApi.success('Пользователь создан (mock)')
					setIsModalOpen(false)
				}}
				okText='Создать'
				cancelText='Отмена'
			>
				<div className='user-management__modal'>
					<Input placeholder='Имя и фамилия' />
					<Input placeholder='Email' />
					<Input placeholder='Телефон' />
					<Select
						placeholder='Роль'
						options={[
							{ value: 'MANAGER', label: 'Менеджер' },
							{ value: 'ADMIN', label: 'Администратор' },
						]}
					/>
					<Button onClick={() => messageApi.success('Приглашение отправлено (mock)')}>
						Отправить приглашение
					</Button>
				</div>
			</Modal>
		</div>
	)
}
