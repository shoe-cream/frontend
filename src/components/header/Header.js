import { useNavigate } from "react-router-dom";
import './Header.css';
import { useAuth } from "../../auth/AuthContext";
import { useEffect, useState } from "react";
import sendGetMyInfoRequest from "../../requests/GetMyInfoRequest";
import sendLogoutRequest from '../../requests/LogoutRequest';
import { Search } from 'lucide-react';  // Lucide 아이콘 import

const Header = ()=> {
    const { state, logout } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [myData, setMyData] = useState({data:{}});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        sendGetMyInfoRequest(state, setMyData, setIsLoading);
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // ==========여기서 검색 기능을 추가=============
        console.log('Search:', searchTerm);
    };

    return (
        <div className="header-container">
            <img className="header-logo" src="logo/text-logo.png" onClick={() => navigate((state.isAuthenticated ? "/dashboard" : '/'))}></img>
            
            {/* ============검색창 추가 ============*/}
            <form onSubmit={handleSearchSubmit} className="header-search-form">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="header-search-input"
                />
                <button type="submit" className="header-search-button">
                <Search size={15} /> 
                </button>
            </form>

            <div className="header-userinfo-container">
                {state.isAuthenticated ? <div className="header-welcome-text">{myData.data.name} 님</div> : 
                <button className="header-login-button" onClick={() => navigate('/login')}>로그인</button>}
                {state.isAuthenticated ? <img src="icons/profile-icon.png" className="header-profile-icon"
                onClick={() => navigate('/mypage')}></img> : <div></div>}
                {state.isAuthenticated ? 
                <img src="icons/logout-icon.png" className="header-logout-icon"
                onClick={() => sendLogoutRequest(state, logout, navigate)}
                ></img> : <div></div>}
            </div>
        </div>
    );
}

export default Header;
