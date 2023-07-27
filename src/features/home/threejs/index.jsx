import React from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css'

const THREEJS = React.memo((props) => {
  const { homeContentData, homeButtonData } = props.homeData
  const navigate = useNavigate()
  const handleClickRouteChange = (id) => {
		console.log(id);
		navigate(`/${id}`, {replace: true})
	}
  return (
    <div className={styles.recommend}>
      <div className={styles.recommendHeader}>
        <span className='recommendHeader-left'>recommend</span>
        <span className='recommendHeader-right'>recommend</span>
      </div>
      <div className={styles.recommendContent}>
        {
          homeContentData &&
            homeContentData.map(item => (
              <div 
                className={styles.recommendContentItem} 
                key={item.id}
              >{item.content}
              </div>
            ))
        }
      </div>
      <div className={styles.buttonGroup}>
        {
          homeButtonData &&
            homeButtonData.map((item) => 
              <button 
                key={item.id}
                className={styles.btn} 
                onClick={() => handleClickRouteChange(item.id)}
              >点击跳转{item.content}界面
              </button>
            ) 
        }
      </div>
    </div>
  )
})

export default THREEJS
