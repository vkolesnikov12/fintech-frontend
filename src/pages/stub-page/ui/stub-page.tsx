import { Typography } from 'antd'
import './stub-page.css'

const { Title, Text } = Typography

interface StubPageProps {
	title: string
	description?: string
}

export function StubPage({ title, description }: StubPageProps) {
	return (
		<div className='stub'>
			<Title level={3}>{title}</Title>
			<Text type='secondary'>
				{description ?? 'Раздел находится в разработке'}
			</Text>
		</div>
	)
}
