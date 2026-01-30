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
import { useMemo, useState } from 'react'
import {
	useLazyGetUserAuditQuery,
	useLazySearchUsersQuery,
	useRegisterEmployeeMutation,
	useResetPasswordMutation,
	useUpdateUserStatusMutation,
} from '../../../features/users/api/user-management-api'
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
	const [roleFilter, setRoleFilter] = useState<UserRow['role'] | undefined>(
		undefined,
	)
	const [statusFilter, setStatusFilter] = useState<UserRow['status'] | undefined>(
		undefined,
	)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
	const [modalName, setModalName] = useState('')
	const [modalEmail, setModalEmail] = useState('')
	const [modalPhone, setModalPhone] = useState('')
	const [modalRole, setModalRole] = useState<'MANAGER' | 'ADMIN' | undefined>(
		undefined,
	)
	const [searchUsers] = useLazySearchUsersQuery()
	const [updateStatus] = useUpdateUserStatusMutation()
	const [resetPassword] = useResetPasswordMutation()
	const [registerEmployee] = useRegisterEmployeeMutation()
	const [getAudit] = useLazyGetUserAuditQuery()

	const filteredUsers = useMemo(() => {
		const query = searchQuery.trim().toLowerCase()

		return users.filter((user) => {
			if (roleFilter && user.role !== roleFilter) {
				return false
			}

			if (statusFilter && user.status !== statusFilter) {
				return false
			}

			if (!query) {
				return true
			}

			return (
				user.name.toLowerCase().includes(query) ||
				user.email.toLowerCase().includes(query)
			)
		})
	}, [roleFilter, searchQuery, statusFilter])

	const handleFilterApply = () => {
		searchUsers({
			role: roleFilter,
			status: statusFilter,
			query: searchQuery.trim() || undefined,
		})
			.unwrap()
			.then(() => messageApi.success('GET /api/v1/users/search (mock)'))
			.catch(() => messageApi.error('Не удалось загрузить пользователей'))
	}

	const handleHistory = () => {
		const targetId = selectedUserId ?? users[0]?.key
		if (!targetId) {
			messageApi.info('Нет пользователей для истории')
			return
		}

		getAudit({ id: targetId })
			.unwrap()
			.then(() => messageApi.info(`GET /api/v1/users/${targetId}/audit (mock)`))
			.catch(() => messageApi.error('Не удалось загрузить историю'))
	}

	const handleStatusChange = (record: UserRow, checked: boolean) => {
		const status = checked ? 'ACTIVE' : 'BLOCKED'
		updateStatus({ id: record.key, status })
			.unwrap()
			.then(() => messageApi.success(`PATCH /api/v1/users/${record.key}/status (mock)`))
			.catch(() => messageApi.error('Не удалось обновить статус'))
	}

	const handleResetPassword = (record: UserRow) => {
		resetPassword({ login: record.email })
			.unwrap()
			.then(() => messageApi.success('POST /api/v1/auth/password/reset-request (mock)'))
			.catch(() => messageApi.error('Не удалось отправить сброс пароля'))
	}

	const handleCreateUser = () => {
		if (!modalName.trim() || !modalEmail.trim() || !modalRole) {
			messageApi.info('Заполните имя, email и роль')
			return
		}

		registerEmployee({
			username: modalName.trim(),
			email: modalEmail.trim(),
			phone: modalPhone.trim(),
			role: modalRole,
		})
			.unwrap()
			.then(() => {
				messageApi.success('POST /api/v1/auth/register (mock)')
				setIsModalOpen(false)
			})
			.catch(() => messageApi.error('Не удалось создать пользователя'))
	}

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
					onChange={(checked) => handleStatusChange(record, checked)}
				/>
			),
		},
		{
			title: 'Действия',
			key: 'actions',
			render: (_, record) => (
				<Button onClick={() => handleResetPassword(record)}>
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
					value={roleFilter}
					onChange={(value) => setRoleFilter(value)}
					allowClear
					options={[
						{ value: 'CLIENT', label: 'Клиент' },
						{ value: 'MANAGER', label: 'Менеджер' },
						{ value: 'ADMIN', label: 'Админ' },
					]}
				/>
				<Select
					placeholder='Статус'
					value={statusFilter}
					onChange={(value) => setStatusFilter(value)}
					allowClear
					options={[
						{ value: 'ACTIVE', label: 'Активен' },
						{ value: 'BLOCKED', label: 'Заблокирован' },
					]}
				/>
				<Input
					placeholder='Поиск по имени или email'
					value={searchQuery}
					onChange={(event) => setSearchQuery(event.target.value)}
				/>
				<Button onClick={handleFilterApply}>Поиск</Button>
			</div>

			<div className='user-management__grid'>
				<div className='user-management__table'>
					<Table
						columns={columns}
						dataSource={filteredUsers}
						pagination={false}
						onRow={(record) => ({
							onClick: () => setSelectedUserId(record.key),
						})}
					/>
				</div>
				<div className='user-management__side'>
					<div className='user-management__history'>
						<div className='user-management__section-header'>
							<Title level={5}>История действий</Title>
							<Button type='link' onClick={handleHistory}>
								Вся история
							</Button>
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
				onOk={handleCreateUser}
				okText='Создать'
				cancelText='Отмена'
			>
				<div className='user-management__modal'>
					<Input
						placeholder='Имя и фамилия'
						value={modalName}
						onChange={(event) => setModalName(event.target.value)}
					/>
					<Input
						placeholder='Email'
						value={modalEmail}
						onChange={(event) => setModalEmail(event.target.value)}
					/>
					<Input
						placeholder='Телефон'
						value={modalPhone}
						onChange={(event) => setModalPhone(event.target.value)}
					/>
					<Select
						placeholder='Роль'
						value={modalRole}
						onChange={(value) =>
							setModalRole(value as 'MANAGER' | 'ADMIN')
						}
						options={[
							{ value: 'MANAGER', label: 'Менеджер' },
							{ value: 'ADMIN', label: 'Администратор' },
						]}
					/>
					<Button onClick={handleCreateUser}>
						Отправить приглашение
					</Button>
				</div>
			</Modal>
		</div>
	)
}
