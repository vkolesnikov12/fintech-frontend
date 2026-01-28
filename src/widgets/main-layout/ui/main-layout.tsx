import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { Header } from '../../header/ui/header'
import { Sidebar } from '../../sidebar/ui/sidebar'
import './main-layout.css'

const { Content } = Layout

export function MainLayout() {
	return (
		<Layout className='main-layout'>
			<Sidebar />
			<Layout className='main-layout__body'>
				<Header />
				<Content className='main-layout__content'>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	)
}
