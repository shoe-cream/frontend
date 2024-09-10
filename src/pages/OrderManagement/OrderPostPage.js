import React, { useState } from 'react';
import './OrderPostPage.css';
import OrderActions from '../../components/OrderPost/OrderActions';
import OrderFilter from '../../components/OrderPost/OrderFilter';
import OrderTable from '../../components/OrderPost/OrderTable';
import ProductSearch from "../../components/OrderPost/ProductSearch";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";

const OrderPostPage = () => {
    const [orderData, setOrderData] = useState([]);
    const [registrationDate, setRegistrationDate] = useState('');  // 등록일자 상태 추가

    const handleAddOrder = (newOrder) => {
        setOrderData(prevData => [...prevData, newOrder]);
    };

    const handleDateChange = (date) => {
        setRegistrationDate(date);
    };

    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container'>
                    <div className='order-registration'>
                        <OrderFilter onDateChange={handleDateChange} />
                        <ProductSearch onAddOrder={handleAddOrder} registrationDate={registrationDate} />
                        <OrderActions />
                        <OrderTable data={orderData} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderPostPage;
