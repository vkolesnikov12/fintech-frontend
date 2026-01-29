import {
	Button,
	Form,
	Input,
	Switch,
	Tabs,
	Typography,
	message,
} from 'antd'
import type { TabsProps } from 'antd'
import { useUpdateUserMutation } from '../../../entities/user/api/user-api'
import type { UpdateUserRequest } from '../../../entities/user/model/types'
import {
	getSessionUser,
	updateSessionUser,
} from '../../../shared/lib/auth-session'
import './profile-settings-page.css'

const { Title, Text } = Typography

interface PersonalFormValues {
	firstName: string
	lastName: string
	email: string
	phone: string
}

interface PasswordFormValues {
	currentPassword: string
	newPassword: string
	confirmPassword: string
}

const sessions = [
	{
		id: 1,
		device: 'MacBook Pro • Chrome',
		location: 'Москва, Россия',
		lastActive: 'Сейчас',
	},
	{
		id: 2,
		device: 'iPhone 15 • Safari',
		location: 'Санкт-Петербург, Россия',
		lastActive: 'Вчера, 22:15',
	},
]

export function ProfileSettingsPage() {
	const [messageApi, contextHolder] = message.useMessage()
	const [updateUser, { isLoading }] = useUpdateUserMutation()
	const user = getSessionUser()

	const handlePersonalSubmit = async (values: PersonalFormValues) => {
		if (!user) {
			messageApi.error('Пользователь не найден')
			return
		}

		const payload: UpdateUserRequest = {
			firstName: values.firstName,
			lastName: values.lastName,
			email: values.email,
			phone: values.phone,
		}

		try {
			await updateUser({
				id: user.id,
				payload,
			}).unwrap()
			updateSessionUser(payload)
			messageApi.success('Данные профиля обновлены')
		} catch {
			messageApi.error('Не удалось обновить профиль')
		}
	}

	const handlePasswordSubmit = (values: PasswordFormValues) => {
		if (values.newPassword !== values.confirmPassword) {
			messageApi.error('Пароли не совпадают')
			return
		}

		messageApi.success('Пароль изменен (mock)')
	}

	const tabItems: TabsProps['items'] = [
		{
			key: 'personal',
			label: 'Личные данные',
			children: (
				<Form
					layout='vertical'
					onFinish={handlePersonalSubmit}
					initialValues={{
						firstName: user?.firstName ?? 'Виталий',
						lastName: user?.lastName ?? 'Иванов',
						email: user?.email ?? 'vitaly@bankfintech.ru',
						phone: user?.phone ?? '+7 (900) 000-00-00',
					}}
					className='profile-settings__form'
				>
					<div className='profile-settings__grid'>
						<Form.Item
							label='Имя'
							name='firstName'
							rules={[
								{ required: true, message: 'Введите имя' },
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label='Фамилия'
							name='lastName'
							rules={[
								{ required: true, message: 'Введите фамилию' },
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label='Email'
							name='email'
							rules={[
								{ required: true, message: 'Введите email' },
								{
									type: 'email',
									message: 'Некорректный email',
								},
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label='Телефон'
							name='phone'
							rules={[
								{ required: true, message: 'Введите телефон' },
							]}
						>
							<Input />
						</Form.Item>
					</div>
					<Form.Item>
						<Button type='primary' htmlType='submit' loading={isLoading}>
							Сохранить изменения
						</Button>
					</Form.Item>
				</Form>
			),
		},
		{
			key: 'security',
			label: 'Безопасность',
			children: (
				<div className='profile-settings__stack'>
					<Form layout='vertical' onFinish={handlePasswordSubmit}>
						<div className='profile-settings__section'>
							<Title level={5}>Смена пароля</Title>
							<div className='profile-settings__grid'>
								<Form.Item
									label='Текущий пароль'
									name='currentPassword'
									rules={[
										{
											required: true,
											message: 'Введите пароль',
										},
									]}
								>
									<Input.Password />
								</Form.Item>
								<Form.Item
									label='Новый пароль'
									name='newPassword'
									rules={[
										{
											required: true,
											message: 'Введите пароль',
										},
									]}
								>
									<Input.Password />
								</Form.Item>
								<Form.Item
									label='Повтор пароля'
									name='confirmPassword'
									rules={[
										{
											required: true,
											message: 'Повторите пароль',
										},
									]}
								>
									<Input.Password />
								</Form.Item>
							</div>
							<Button type='primary' htmlType='submit'>
								Изменить пароль
							</Button>
						</div>
					</Form>

					<div className='profile-settings__section'>
						<Title level={5}>Двухфакторная защита</Title>
						<div className='profile-settings__row'>
							<Text type='secondary'>SMS/Email подтверждение</Text>
							<Switch defaultChecked />
						</div>
						<div className='profile-settings__row'>
							<Text type='secondary'>Подтверждение входа</Text>
							<Switch />
						</div>
					</div>

					<div className='profile-settings__section'>
						<Title level={5}>Сессии</Title>
						<div className='profile-settings__sessions'>
							{sessions.map((session) => (
								<div key={session.id} className='profile-settings__session'>
									<div>
										<div className='profile-settings__session-title'>
											{session.device}
										</div>
										<Text type='secondary'>
											{session.location} • {session.lastActive}
										</Text>
									</div>
									<Button type='link'>Завершить</Button>
								</div>
							))}
						</div>
					</div>
				</div>
			),
		},
		{
			key: 'notifications',
			label: 'Уведомления',
			children: (
				<div className='profile-settings__section'>
					<Title level={5}>Каналы уведомлений</Title>
					<div className='profile-settings__row'>
						<Text type='secondary'>Email уведомления</Text>
						<Switch defaultChecked />
					</div>
					<div className='profile-settings__row'>
						<Text type='secondary'>SMS уведомления</Text>
						<Switch />
					</div>
					<div className='profile-settings__row'>
						<Text type='secondary'>Push уведомления</Text>
						<Switch defaultChecked />
					</div>
				</div>
			),
		},
		{
			key: 'consents',
			label: 'Согласия',
			children: (
				<div className='profile-settings__section'>
					<Title level={5}>Согласия</Title>
					<div className='profile-settings__row'>
						<Text type='secondary'>Обработка персональных данных</Text>
						<Switch defaultChecked />
					</div>
					<div className='profile-settings__row'>
						<Text type='secondary'>Маркетинговые рассылки</Text>
						<Switch />
					</div>
					<div className='profile-settings__row'>
						<Text type='secondary'>Партнерские предложения</Text>
						<Switch />
					</div>
				</div>
			),
		},
	]

	return (
		<div className='profile-settings'>
			{contextHolder}
			<div className='profile-settings__header'>
				<div>
					<Title level={3}>Профиль и настройки</Title>
					<Text type='secondary'>
						Управление профилем, безопасностью и уведомлениями
					</Text>
				</div>
			</div>
			<div className='profile-settings__card'>
				<Tabs items={tabItems} />
			</div>
		</div>
	)
}
