import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTableWithCheckbox from '../../components/Table/ReactTableWithCheckbox';
import PostContainer from '../../components/postcontainer/PostContainer';
import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import EditableTableWithCheckbox from '../../components/Table/EditableTableWithCheckbox';
import sendGetBuyersRequest from '../../requests/GetBuyersRequest';
import sendGetMasterBuyerItemsRequest from '../../requests/GetMasterBuyerItems';
import PageContainer from '../../components/page_container/PageContainer';

const BuyerItemPostPage = () => {
    const { state } = useAuth();
    const [page, setPage] = useState(1);
    const [dbData, setDbData] = useState();
    const [data, setData] = useState({ data: [] });
    const [checked, setChecked] = useState([]);
    const [edited, setEdited] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('buyerItemId');

    const columnData = [
        {
            accessor: 'buyerNm',
            Header: '고객사 명',
            editable: false,
            /* type: 'text', */
        },
        {
            accessor: 'itemCd',
            Header: '제품 코드',
            editable: true,
            type: 'text',
        },
        {
            accessor: 'itemNm',
            Header: '제품 명',
            editable: false,
            type: 'cell',
        },
        {
            accessor: 'unitPrice',
            Header: '단가',
            editable: true,
            type: 'text',
        },
        {
            accessor: 'unit',
            Header: '단위',
            editable: false,
            type: 'text',
        },
        {
            accessor: 'startDate',
            Header: '적용 시작일',
            editable: true,
            type: 'date',
        },
        {
            accessor: 'endDate',
            Header: '적용 종료일',
            editable: true,
            type: 'date',
        },
    ]

    const resetData = (value) => {
        console.log('reset data: ', value);
        setData(value);
        setDbData(value);
    }
    useEffect(() => {
        sendGetMasterBuyerItemsRequest(state, page, 10, resetData, sortBy, setIsLoading);
    }, [page, sortBy]);
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div className='app-background'>
                        <div className='manufacturer-list-container'>
                            <div className='manufacturer-tool-container'>
                                <select onChange={(e) => setSortBy(e.target.value)}>
                                    <option disabled='true'>정렬 기준 선택</option>
                                    <option value='buyerItemId'>ID</option>
                                    {/* <option value='buyerId'>등록순</option> */}
                                    <option value='buyer.buyerCd'>고객사별</option>
                                    <option value='unitPrice'>단가순</option>
                                    <option value='startDate'>적용 시작일순</option>
                                    <option value='endDate'>적용 종료일순</option>
                                    <option value='modifiedAt'>최신 수정순</option>
                                </select>
                                <div className='manufacturer-button-container'>
                                    <button className='manufacturer-button'>수정</button>
                                    <button className='manufacturer-button'>삭제</button>
                                </div>
                            </div>
                            <EditableTableWithCheckbox
                                columns={columnData}
                                ogData={dbData}
                                data={data}
                                setData={(data) => setData(data)}
                                checked={checked}
                                setChecked={setChecked}
                                edited={edited}
                                setEdited={setEdited}
                            >
                            </EditableTableWithCheckbox>
                        </div>
                        {isLoading ? <div /> : <PageContainer
                            currentPage={page}
                            setPage={setPage}
                            pageInfo={data.pageInfo}
                            getPage={(page) => {
                                /* sendGetItemsRequest(state, page, setPage, 10, sortBy, resetData, setIsLoading); */
                            }}
                            setChecked={(value) => setChecked(value)}
                            setIsLoading={setIsLoading}
                        ></PageContainer>}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BuyerItemPostPage;