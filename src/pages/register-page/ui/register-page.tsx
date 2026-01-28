import {
	LockOutlined,
	MailOutlined,
	PhoneOutlined,
	UserOutlined,
} from '@ant-design/icons'
import {
	Button,
	DatePicker,
	Divider,
	Form,
	Input,
	Typography,
	message,
} from 'antd'
import type { Dayjs } from 'dayjs'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../../../features/auth/api/auth-api'
import '../../../shared/ui/auth/auth-page.css'

const { Title, Text } = Typography

interface RegisterFormValues {
	username: string
	email: string
	phone: string
	password: string
	firstName: string
	lastName: string
	birthDate: Dayjs
}

export function RegisterPage() {
	const [register, { isLoading }] = useRegisterMutation()
	const [messageApi, contextHolder] = message.useMessage()
	const navigate = useNavigate()

	const handleSubmit = async (values: RegisterFormValues) => {
		try {
			await register({
				username: values.username,
				email: values.email,
				phone: values.phone,
				password: values.password,
				firstName: values.firstName,
				lastName: values.lastName,
				birthDate: values.birthDate.format('YYYY-MM-DD'),
			}).unwrap()
			messageApi.success('Регистрация завершена успешно')
			navigate('/app')
		} catch {
			messageApi.error('Не удалось зарегистрироваться')
		}
	}

	return (
		<div className='auth-page'>
			{contextHolder}
			<div className='auth-card'>
				<div className='auth-card__left'>
					<div className='auth-card__brand'>
						<span className='auth-card__brand-logo'>BF</span>
						<span>BankFinTech</span>
					</div>
					<div className='auth-card__left-content'>
						<div className='auth-card__left-title'>
							Создайте аккаунт
						</div>
						<div className='auth-card__left-subtitle'>
							Получите доступ к финансовым возможностям
						</div>
						<div className='auth-card__badge'>Secure ID</div>
					</div>
				</div>
				<div className='auth-card__right'>
					<Title level={3}>Регистрация</Title>
					<Text type='secondary'>
						Заполните данные для создания аккаунта
					</Text>
					<Form
						className='auth-form'
						layout='vertical'
						onFinish={handleSubmit}
					>
						<Form.Item
							label='Имя'
							name='firstName'
							rules={[
								{ required: true, message: 'Введите имя' },
							]}
						>
							<Input prefix={<UserOutlined />} placeholder='Иван' />
						</Form.Item>
						<Form.Item
							label='Фамилия'
							name='lastName'
							rules={[
								{ required: true, message: 'Введите фамилию' },
							]}
						>
							<Input prefix={<UserOutlined />} placeholder='Иванов' />
						</Form.Item>
						<Form.Item
							label='Имя пользователя'
							name='username'
							rules={[
								{ required: true, message: 'Введите логин' },
							]}
						>
							<Input prefix={<UserOutlined />} placeholder='bank.user' />
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
							<Input
								prefix={<MailOutlined />}
								placeholder='mail@bank.com'
							/>
						</Form.Item>
						<Form.Item
							label='Телефон'
							name='phone'
							rules={[
								{ required: true, message: 'Введите телефон' },
							]}
						>
							<Input
								prefix={<PhoneOutlined />}
								placeholder='+7 (900) 000-00-00'
							/>
						</Form.Item>
						<Form.Item
							label='Дата рождения'
							name='birthDate'
							rules={[
								{
									required: true,
									message: 'Выберите дату рождения',
								},
							]}
						>
							<DatePicker
								placeholder='Выберите дату'
								style={{ width: '100%' }}
							/>
						</Form.Item>
						<Form.Item
							label='Пароль'
							name='password'
							rules={[
								{ required: true, message: 'Введите пароль' },
							]}
						>
							<Input.Password
								prefix={<LockOutlined />}
								placeholder='Введите пароль'
							/>
						</Form.Item>
						<Form.Item>
							<Button
								type='primary'
								htmlType='submit'
								loading={isLoading}
								block
							>
								Зарегистрироваться
							</Button>
						</Form.Item>
						<Divider className='auth-form__divider' />
						<div className='auth-footer'>
							Уже есть аккаунт?{' '}
							<Link className='auth-form__link' to='/login'>
								Войти
							</Link>
						</div>
					</Form>
				</div>
			</div>
		</div>
	)
}
