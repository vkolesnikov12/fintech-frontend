import { Layout, Typography } from 'antd'
import './App.css'

function App() {
	return (
		<Layout className='app'>
			<Layout.Content className='app__content'>
				<Typography.Title level={2}>
					Bank Fintech Frontend
				</Typography.Title>
				<Typography.Paragraph>
					Стартовая настройка: интерфейсы, store и API слой
					готовы.
				</Typography.Paragraph>
			</Layout.Content>
		</Layout>
	)
}

export default App
