import { BellOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { Link } from 'react-router-dom'
import { getSessionUser } from '../../../shared/lib/auth-session'
import './header.css'

dayjs.locale('ru')

const { Title, Text } = Typography

export function Header() {
	const user = getSessionUser()
	const userName = user?.firstName ?? 'Виталий'
	const todayLabel = dayjs().format('ddd, D MMMM')

	return (
		<header className='app-header'>
			<div>
				<Title level={3} className='app-header__title'>
					Добро пожаловать, {userName}
				</Title>
				<Text type='secondary' className='app-header__subtitle'>
					{todayLabel}
				</Text>
			</div>
			<div className='app-header__actions'>
				<Link to='/app/notifications'>
					<Button className='app-header__icon-btn' icon={<BellOutlined />} />
				</Link>
			</div>
		</header>
	)
}
