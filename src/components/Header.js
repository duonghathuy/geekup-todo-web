import React from "react";
import { useState } from "react";

const Header = () => {
    return (
        <div className="header">
            <a href="https://geekup-todo-web.vercel.app/">
                <img className="logo" src={'https://geekup.vn/Icons/geekup-logo-general.svg'} alt="logo"/>
            </a>
            <p>Todo App</p>
        </div>
    )
}

export default Header;