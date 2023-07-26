import { useState, useEffect, lazy, Suspense } from 'react'
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom'
import { Layout, Menu } from "antd"
import { reqHomeContentData } from '../../http'
import Chat from './chat/Chat'
import styles from './Home.module.css'
import Loading from '../dialog/Dialog'

const THREEJS = lazy(() => import('./threejs'))
const { Header, Content, Footer } = Layout

export default function Home() {
	const navigate = useNavigate()

	const [homeData, setHomeData] = useState({})
	const [currentSelect, setCurrentSelect] = useState('')

	const getHomeContent = async () => {
		const res = await reqHomeContentData()
		// 此处省略判断返回数据是否有效
		setHomeData(res)
	}

	const handleNavChange = (e) => {
		console.log('click', e.key);
		navigate('/home/chat')
	}

	useEffect(() => {
		getHomeContent()
	}, [])

  return (
    <div className={styles.home}>
			<Layout className='layout'>
				<Header style={{
					display: 'flex', 
					alignItems: 'center', 
					width: '80%',
					margin: 'auto'
				}}>
					<span className="logo">image</span>
					<Menu 
						theme='light'
						mode='horizontal'
						defaultSelectedKeys={['1']}
						items={homeData.navigationBar}
						onClick={handleNavChange}
					/>
				</Header>
				<Content style={{ padding: '10px' }}>
					<Routes>
						<Route index element={<Navigate to="threejs"/>}/>
						<Route 
							path='threejs' 
							element={
								<Suspense fallback={<Loading content='Loading'/>}>
									<THREEJS homeData={homeData}/>
								</Suspense>	
							}
						/>
						<Route path='chat' element={<Chat/>}/>
					</Routes>
				</Content>
				<Footer 
					style={{
						textAlign: 'center',
					}}
				>
					create by YH
					2023
				</Footer>
			</Layout>
    </div>
  )
}
