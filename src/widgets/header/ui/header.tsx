import {
	BellOutlined,
	PlusOutlined,
} from '@ant-design/icons'
import { Button, Typography } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { useState } from 'react'
import { CreateProductModal } from '../../../features/product/ui/create-product-modal'
import { getSessionUser } from '../../../shared/lib/auth-session'
import './header.css'

dayjs.locale('ru')

const { Title, Text } = Typography

export function Header() {
	const user = getSessionUser()
	const userName = user?.firstName ?? 'Виталий'
	const todayLabel = dayjs().format('ddd, D MMMM')
	const [isCreateOpen, setIsCreateOpen] = useState(false)

	const handleOpenCreate = () => {
		setIsCreateOpen(true)
	}

	const handleCloseCreate = () => {
		setIsCreateOpen(false)
	}

	return (
		<>
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
					<Button
						className='app-header__icon-btn'
						icon={<BellOutlined />}
					/>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={handleOpenCreate}
					>
						Добавить продукт
					</Button>
				</div>
			</header>
			<CreateProductModal
				open={isCreateOpen}
				onClose={handleCloseCreate}
			/>
		</>
	)
}
