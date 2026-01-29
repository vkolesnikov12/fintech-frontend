import {
	AppstoreOutlined,
	AppstoreAddOutlined,
	CreditCardOutlined,
	CustomerServiceOutlined,
	FileTextOutlined,
	FormOutlined,
	LineChartOutlined,
	MoneyCollectOutlined,
	SettingOutlined,
	SwapOutlined,
	TeamOutlined,
	UserOutlined,
	WalletOutlined,
	FileSearchOutlined,
	AlertOutlined,
	CalendarOutlined,
	BarChartOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Typography } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import type { UserRole } from '../../../entities/user/model/types'
import { getUserRole } from '../../../shared/lib/auth-session'
import './sidebar.css'

const { Sider } = Layout
const { Text } = Typography

interface NavigationItem {
	key: string
	label: string
	icon: React.ReactNode
	path: string
}

const baseItems: NavigationItem[] = [
	{
		key: 'home',
		label: 'Главная',
		icon: <AppstoreOutlined />,
		path: '/app',
	},
	{
		key: 'accounts',
		label: 'Мои счета',
		icon: <WalletOutlined />,
		path: '/app/accounts',
	},
	{
		key: 'transfers',
		label: 'Переводы',
		icon: <SwapOutlined />,
		path: '/app/transfers',
	},
	{
		key: 'cards',
		label: 'Карты',
		icon: <CreditCardOutlined />,
		path: '/app/cards',
	},
	{
		key: 'documents',
		label: 'Документы',
		icon: <FileTextOutlined />,
		path: '/app/documents',
	},
	{
		key: 'applications',
		label: 'Мои заявки',
		icon: <FormOutlined />,
		path: '/app/applications',
	},
	{
		key: 'loan-payments',
		label: 'Платежи по кредиту',
		icon: <MoneyCollectOutlined />,
		path: '/app/loan-payments',
	},
]

const managerItems: NavigationItem[] = [
	{
		key: 'manager-dashboard',
		label: 'Панель менеджера',
		icon: <LineChartOutlined />,
		path: '/app/manager-dashboard',
	},
	{
		key: 'application-pipeline',
		label: 'Воронка заявок',
		icon: <AppstoreAddOutlined />,
		path: '/app/application-pipeline',
	},
	{
		key: 'document-flow',
		label: 'Документооборот',
		icon: <FileSearchOutlined />,
		path: '/app/document-flow',
	},
	{
		key: 'system-monitoring',
		label: 'Мониторинг системы',
		icon: <AlertOutlined />,
		path: '/app/system-monitoring',
	},
	{
		key: 'job-management',
		label: 'Управление задачами',
		icon: <CalendarOutlined />,
		path: '/app/job-management',
	},
	{
		key: 'system-configuration',
		label: 'Конфигурация системы',
		icon: <SettingOutlined />,
		path: '/app/system-configuration',
	},
	{
		key: 'analytics-reports',
		label: 'Аналитика и отчеты',
		icon: <BarChartOutlined />,
		path: '/app/analytics-reports',
	},
	{
		key: 'users',
		label: 'Пользователи',
		icon: <TeamOutlined />,
		path: '/app/users',
	},
	{
		key: 'products',
		label: 'Продукты',
		icon: <CreditCardOutlined />,
		path: '/app/products',
	},
]

const systemItems: NavigationItem[] = [
	{
		key: 'profile-settings',
		label: 'Профиль и настройки',
		icon: <UserOutlined />,
		path: '/app/profile-settings',
	},
	{
		key: 'settings',
		label: 'Настройки',
		icon: <SettingOutlined />,
		path: '/app/settings',
	},
	{
		key: 'support',
		label: 'Поддержка',
		icon: <CustomerServiceOutlined />,
		path: '/app/support',
	},
]

const getRoleItems = (role: UserRole | null) => {
	if (role === 'MANAGER' || role === 'ADMIN') {
		return managerItems
	}

	return []
}

export function Sidebar() {
	const location = useLocation()
	const role = getUserRole()
	const roleItems = getRoleItems(role)

	const findKey = (items: NavigationItem[]) =>
		items.find((item) => location.pathname === item.path)?.key

	const selectedKey =
		findKey(baseItems) ??
		findKey(roleItems) ??
		findKey(systemItems) ??
		'home'

	return (
		<Sider className='sidebar' width={240}>
			<div className='sidebar__brand'>
				<div className='sidebar__logo'>🏦</div>
				<div>
					<Text className='sidebar__title'>BankFinTech</Text>
					<Text className='sidebar__subtitle'>Персональный банк</Text>
				</div>
			</div>
			<Menu
				className='sidebar__menu'
				mode='inline'
				selectedKeys={[selectedKey]}
			>
				{baseItems.map((item) => (
					<Menu.Item key={item.key} icon={item.icon}>
						<Link to={item.path}>{item.label}</Link>
					</Menu.Item>
				))}
				{roleItems.length > 0 && (
					<Menu.ItemGroup key='manager' title='Управление'>
						{roleItems.map((item) => (
							<Menu.Item key={item.key} icon={item.icon}>
								<Link to={item.path}>{item.label}</Link>
							</Menu.Item>
						))}
					</Menu.ItemGroup>
				)}
				<Menu.ItemGroup key='system' title='Система'>
					{systemItems.map((item) => (
						<Menu.Item key={item.key} icon={item.icon}>
							<Link to={item.path}>{item.label}</Link>
						</Menu.Item>
					))}
				</Menu.ItemGroup>
			</Menu>
		</Sider>
	)
}
