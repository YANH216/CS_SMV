import { useState, useEffect, lazy, Suspense } from 'react'
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom'
import { Layout, Menu, theme } from "antd"
import { reqHomeContentData } from '../../http'
import Chat from './chat/Chat'
import styles from './Home.module.css'
import Loading from '../dialog/Dialog'

const THREEJS = lazy(() => import('./threejs'))
const { Header, Content, Footer } = Layout

export default function Home() {
	// 保存navigationbar所选的key
	const data = sessionStorage.getItem('currentSelect')

	const navigate = useNavigate()

	const [homeData, setHomeData] = useState({})
	const [currentSelect, setCurrentSelect] = useState(data?data:'01')

	// 导航栏选项
	const items = homeData.navigationBar

	const {
		token: { colorBgContainer },
	} = theme.useToken()

	const getHomeContent = async () => {
		const res = await reqHomeContentData()
		// 此处省略判断返回数据是否有效
		setHomeData(res)
	}

	const handleNavChange = (e) => {
		// console.log('click', e);
		// 筛选出所点击元素key对应的属性
		// 由于被筛数据是对象数组，返回的依旧是对象数组
		// 故用shift()弹出数组首位元素
		const item = (homeData.navigationBar.filter((i) => i.key === e.key)).shift()
		// console.log(item);

		setCurrentSelect(e.key)

		sessionStorage.setItem('currentSelect', e.key)

		// 跳转路由对应页面
		navigate(`/home${item.path}`)

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
						defaultSelectedKeys={[currentSelect]}
						items={items}
						onClick={handleNavChange}
					/>
				</Header>
				<Content style={{ padding: '10px' }}>
					<div 
						className={styles.siteLayoutContent}
						style={{ background: colorBgContainer }}
					>
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
					</div>
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
