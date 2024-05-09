import React from "react";

const Header = () => {
    return (
        <div className="header">
            <a href="https://geekup-todo-web.vercel.app/">
                <img fetchpriority="low" className="logo" src={'https://geekup.vn/Icons/geekup-logo-general.svg'} alt="GEEK Up Logo"/>
            </a>
            <p>Todo App</p>
        </div>
    )
}

export default Header;