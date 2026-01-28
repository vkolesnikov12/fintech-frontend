import {
	ArrowRightOutlined,
	CreditCardOutlined,
	LockOutlined,
	SafetyCertificateOutlined,
	UserOutlined,
} from '@ant-design/icons'
import {
	Button,
	Checkbox,
	Divider,
	Form,
	Input,
	Typography,
	message,
} from 'antd'
import { Link } from 'react-router-dom'
import { useLoginMutation } from '../../../features/auth/api/auth-api'
import '../../../shared/ui/auth/auth-page.css'

const { Title, Text } = Typography

interface LoginFormValues {
	login: string
	password: string
	remember: boolean
}

export function LoginPage() {
	const [login, { isLoading }] = useLoginMutation()
	const [messageApi, contextHolder] = message.useMessage()

	const handleSubmit = async (values: LoginFormValues) => {
		try {
			await login({
				login: values.login,
				password: values.password,
			}).unwrap()
			messageApi.success('Вы успешно вошли в систему')
		} catch {
			messageApi.error('Не удалось войти. Проверьте данные')
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
							Безопасный и надежный банк для вашего финансового роста
						</div>
						<div className='auth-card__badge'>
							<SafetyCertificateOutlined />
							<span className='auth-card__badge-text'>
								Bank-Grade Security (AES-256)
							</span>
						</div>
					</div>
				</div>
				<div className='auth-card__right'>
					<Title level={3}>Добро пожаловать</Title>
					<Text type='secondary'>
						Пожалуйста, введите данные для авторизации
					</Text>
					<Form
						className='auth-form'
						layout='vertical'
						initialValues={{ remember: true }}
						onFinish={handleSubmit}
					>
						<Form.Item
							label='Email или телефон'
							name='login'
							rules={[
								{
									required: true,
									message: 'Введите email, телефон или логин',
								},
							]}
						>
							<Input
								prefix={<UserOutlined />}
								placeholder='Введите данные'
							/>
						</Form.Item>
						<Form.Item
							label='Пароль'
							name='password'
							rules={[
								{
									required: true,
									message: 'Введите пароль',
								},
							]}
						>
							<Input.Password
								prefix={<LockOutlined />}
								placeholder='Введите пароль'
							/>
						</Form.Item>
						<div className='auth-form__row'>
							<Form.Item name='remember' valuePropName='checked'>
								<Checkbox>Запомнить</Checkbox>
							</Form.Item>
							<Link className='auth-form__link' to='/register'>
								Забыли пароль?
							</Link>
						</div>
						<Form.Item>
							<Button
								type='primary'
								htmlType='submit'
								loading={isLoading}
								block
							>
								Войти <ArrowRightOutlined />
							</Button>
						</Form.Item>
						<Divider className='auth-form__divider'>
							или войти через
						</Divider>
						<div className='auth-form__providers'>
							<Button disabled icon={<CreditCardOutlined />}>
								Номер карты
							</Button>
							<Button disabled icon={<SafetyCertificateOutlined />}>
								Госуслуги
							</Button>
						</div>
					</Form>
					<div className='auth-footer'>
						Нет аккаунта?{' '}
						<Link className='auth-form__link' to='/register'>
							Зарегистрируйтесь
						</Link>
					</div>
					<div className='auth-footer__secure'>
						<SafetyCertificateOutlined />
						<span>Защищенное соединение • SSL Secure</span>
					</div>
				</div>
			</div>
		</div>
	)
}
