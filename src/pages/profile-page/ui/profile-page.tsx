import {
	Button,
	DatePicker,
	Form,
	Input,
	Typography,
	message,
} from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useUpdateUserMutation } from '../../../entities/user/api/user-api'
import type { UpdateUserRequest } from '../../../entities/user/model/types'
import {
	getSessionUser,
	updateSessionUser,
} from '../../../shared/lib/auth-session'
import './profile-page.css'

const { Title, Text } = Typography

interface ProfileFormValues {
	firstName: string
	lastName: string
	email: string
	phone: string
	birthDate: Dayjs
}

export function ProfilePage() {
	const [messageApi, contextHolder] = message.useMessage()
	const [updateUser, { isLoading }] = useUpdateUserMutation()
	const user = getSessionUser()

	const handleSubmit = async (values: ProfileFormValues) => {
		if (!user) {
			messageApi.error('Пользователь не найден')
			return
		}

		const payload: UpdateUserRequest = {
			firstName: values.firstName,
			lastName: values.lastName,
			email: values.email,
			phone: values.phone,
			birthDate: values.birthDate.format('YYYY-MM-DD'),
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

	return (
		<div className='profile'>
			{contextHolder}
			<div className='profile__header'>
				<Title level={3}>Профиль</Title>
				<Text type='secondary'>
					Просмотр и редактирование данных
				</Text>
			</div>
			<Form
				className='profile__form'
				layout='vertical'
				onFinish={handleSubmit}
				initialValues={{
					firstName: user?.firstName ?? 'Виталий',
					lastName: user?.lastName ?? 'Иванов',
					email: user?.email ?? 'vitaly@bankfintech.ru',
					phone: user?.phone ?? '+7 (900) 000-00-00',
					birthDate: dayjs(user?.birthDate ?? '1992-02-14'),
				}}
			>
				<div className='profile__grid'>
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
					<Form.Item
						label='Дата рождения'
						name='birthDate'
						rules={[
							{ required: true, message: 'Выберите дату' },
						]}
					>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
				</div>
				<Form.Item>
					<Button type='primary' htmlType='submit' loading={isLoading}>
						Сохранить изменения
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}
