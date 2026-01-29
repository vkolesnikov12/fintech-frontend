import { Button, Tag, Typography } from 'antd'
import './notifications-page.css'

const { Title, Text } = Typography

const notifications = [
	{
		id: 1,
		title: 'Доступно новое заявление',
		text: 'Выписка за декабрь 2025 года готова к загрузке.',
		time: 'Сегодня, 9:00',
		status: 'info',
	},
	{
		id: 2,
		title: 'Пароль изменён',
		text: 'Пароль вашей учетной записи обновлен с нового устройства.',
		time: 'Вчера',
		status: 'success',
	},
	{
		id: 3,
		title: 'Плановое обслуживание',
		text: 'Обслуживание системы в воскресенье в 02:00.',
		time: '10 января',
		status: 'neutral',
	},
	{
		id: 4,
		title: 'Новая акция',
		text: 'Доступно специальное предложение для клиентов.',
		time: '08 января',
		status: 'info',
	},
]

export function NotificationsPage() {
	return (
		<div className='notifications'>
			<div className='notifications__header'>
				<div>
					<Title level={3}>Уведомления</Title>
					<Text type='secondary'>Все уведомления по вашему аккаунту</Text>
				</div>
				<Button>Отметить все прочитанными</Button>
			</div>

			<div className='notifications__list'>
				{notifications.map((item) => (
					<div key={item.id} className='notifications__item'>
						<Tag
							color={
								item.status === 'success'
									? 'green'
									: item.status === 'info'
										? 'blue'
										: 'default'
							}
						>
							{item.status}
						</Tag>
						<div className='notifications__content'>
							<div className='notifications__title'>{item.title}</div>
							<Text type='secondary'>{item.text}</Text>
							<div className='notifications__time'>{item.time}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
