import { useState } from 'react'
import '../App.scss'
import {Modal} from '../components/Modal'
import Login from './Login'
import Register from './Register'

const StartingPage=()=>{
    const [registerOpen,setRegisterOpen]=useState(false)
    const [loginOpen,setLoginOpen]=useState(false)

    return <div className="login_page-container">
        <div className="login-promo">
            <ul>
                <li>Читайте о том, что вам интересно</li>
                <li>Узнавайте, о чем говорят в мире</li>
                <li>Присоединяйтесь к общению</li>
            </ul>
        </div>
        <div className="login-form">
            <h1>Узнайте, что происходит в мире прямо сейчас</h1>
            <h3>Присоединяйтесь к твиттеру</h3>
            <div className="login_register-button button" onClick={()=>setRegisterOpen(true)}>Зарегистрироваться</div>
            <div className="login_login-button button" onClick={()=>setLoginOpen(true)}>Войти</div>
        </div>
        {registerOpen && <Modal title="Регистрация" cancel={()=>setRegisterOpen(false)}>
            <Register/>
        </Modal>}
        {loginOpen && <Modal title="Вход" cancel={()=>setLoginOpen(false)}>
            <Login/>
        </Modal>}
    </div>
}

export default StartingPage