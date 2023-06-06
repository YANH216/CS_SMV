import { useState } from 'react'
import { Layout, Menu, theme } from "antd"
import styles from './Home.module.css'

const { Header, Content, Footer } = Layout

export default function Home() {
	const {
		token: { colorBgContainer },
	} = theme.useToken()
	const items = [
		{
			label: '首页',
			key: 0,
		},
		{
			label: '日本动漫',
			key: 1,
		},
		{
			label: '欧美动漫',
			key: 3,
		},
		{
			label: '动漫电影',
			key: 4,
		},
	]
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
						items={items}
					/>
				</Header>
				<Content style={{ padding: '10px' }}>
					<div 
						className={styles.siteLayoutContent}
						style={{ background: colorBgContainer }}
					>
						<div className={styles.recommend}>
							<div className={styles.recommendHeader}>
								<span className='recommendHeader-left'>recommend</span>
								<span className='recommendHeader-right'>recommend</span>
							</div>
							<div className={styles.recommendContent}>
								<div className={styles.recommendContentItem}>image</div>
								<div className={styles.recommendContentItem}>image</div>
								<div className={styles.recommendContentItem}>image</div>
								<div className={styles.recommendContentItem}>image</div>
								<div className={styles.recommendContentItem}>image</div>
								<div className={styles.recommendContentItem}>image</div>
								<div className={styles.recommendContentItem}>image</div>
								<div className={styles.recommendContentItem}>image</div>
								<div className={styles.recommendContentItem}>image</div>
								<div className={styles.recommendContentItem}>image</div>
								<div className={styles.recommendContentItem}>image</div>
							</div>
						</div>
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
