import Header from "../../components/header/Header";
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTableWithCheckbox from "../../components/Table/ReactTableWithCheckbox";
import { columnData, data } from "../../data/ManufacturerData";
import PostContainer from "../../components/postcontainer/PostContainer";
import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import EditableTableWithCheckbox from "../../components/Table/EditableTableWithCheckbox";
import PageContainer from "../../components/page_container/PageContainer";
import sendGetBuyersRequest from "../../requests/GetBuyersRequest";
import PostModal from "../../components/modal/PostModal";
import sendPatchMultiBuyerRequest from "../../requests/PatchMultiBuyerRequest";
import sendDeleteBuyersRequest from "../../requests/DeleteBuyersRequest";
import { type } from "@testing-library/user-event/dist/type";
import sendPostBuyersRequest from "../../requests/PostBuyersRequest";
import Swal from "sweetalert2";
import { Plus, Edit, Trash2 } from 'lucide-react';
import './BuyerPostPage.css';
import SearchWindow from "../../components/search/SearchWindow";
import sendGetAllBuyersRequest from "../../requests/GetAllBuyersRequest";
import ConfirmAlert from "../../components/alert/ConfirmAlert";

const BuyerPostPage = () => {
  const { state } = useAuth();
  const [dbData, setDbData] = useState();
  const [data, setData] = useState({ data: [] });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);

  const [checked, setChecked] = useState([]);
  const [isPostMode, setIsPostMode] = useState(false);
  const [edited, setEdited] = useState([]);
  const [sortBy, setSortBy] = useState('buyerCd');

  const [allData, setAllData] = useState({ data: [] });
  const [searchCondition, setSearchCondition] = useState('');

  const columnData = [
    {
      accessor: 'buyerNm',
      Header: '고객사 명',
    },
    {
      accessor: 'buyerCd',
      Header: '고객사 코드',
    },
    {
      accessor: 'email',
      Header: '이메일',
      type: 'text',
    },
    {
      accessor: 'tel',
      Header: '전화번호',
      type: 'text',
    },
    {
      accessor: 'address',
      Header: '주소',
      type: 'text',
    },
    {
      accessor: 'businessType',
      Header: '사업 분류',
    },
  ]

  const columnPostData = [
    {
      accessor: 'buyerNm',
      Header: '고객사 명',

    },
    {
      accessor: 'email',
      Header: '이메일',
      type: 'text',
    },
    {
      accessor: 'tel',
      Header: '전화번호',
      type: 'text',
    },
    {
      accessor: 'address',
      Header: '주소',
      type: 'text',
    },
    {
      accessor: 'businessType',
      Header: '사업 분류',
      type: 'dropdown',
      options: ['개인', '기업'],
    },
  ]

  const resetData = (value) => {
    console.log('reset data: ', value);
    setData(value);
    setDbData(value);
  }
  useEffect(() => {
    sendGetBuyersRequest({ state: state, page: page, setPage: setPage, size: 10, sortBy: sortBy, buyerNm: searchCondition, setData: resetData, setIsLoading: setIsLoading });
    sendGetAllBuyersRequest(state, setAllData, setIsLoading2);
  }, [page, sortBy]);

  return (
    <div>
      <Header></Header>
      <div className='app-container'>
        <Sidebar></Sidebar>
        <div className="app-content-container">
          <div className="app-background">
            <h2 className="app-label">고객사 관리</h2>
            <div className='manufacturer-list-container'>
              <div className='manufacturer-tool-container'>
                <select onChange={(e) => setSortBy(e.target.value)}>
                  <option disabled selected>정렬 기준 선택</option>
                  <option value='buyerCd'>고객사 코드</option>
                  <option value='buyerNm'>고객사 명</option>
                  <option value='buyerId'>등록순</option>
                  <option value='address'>주소</option>
                  <option value='businessType'>사업 분류</option>
                </select>
                <div />
                <div className='manufacturer-button-container'>
                  <SearchWindow
                    placeholder='고객사 이름으로 검색'
                    suggestions={
                      allData.data.map(data => ({
                        key: data.buyerNm,
                        onSearch: () => {
                          const buyerNm = data.buyerNm.replace(/\s+/g, '');
                          console.log('data: ', data);
                          console.log('buyerNm: ', data.buyerNm);
                          sendGetBuyersRequest(
                            { state: state, page: page, setPage: setPage, size: 10, sortBy: sortBy, buyerNm: buyerNm, setData: resetData, setIsLoading: setIsLoading }
                          )
                        }
                      }))
                    }
                    defaultSearch={() => sendGetBuyersRequest(
                      { state: state, page: page, setPage: setPage, size: 10, sortBy: sortBy, setData: resetData, setIsLoading: setIsLoading })}
                    setSearchCondition={setSearchCondition}
                  />
                  <button className='manufacturer-button' onClick={() => setIsPostMode(true)}><Plus size={16} /> 추가</button>
                  <button className='manufacturer-button' onClick={() => {
                    if (checked.length === 0) {
                      Swal.fire({ text: "하나 이상의 데이터를 선택해주세요" });
                      return;
                    }
                    console.log('checked: ', checked);
                    console.log('edited: ', edited);
                    /* const checkedAndEdited = checked.filter(element => edited.includes(element)); */
                    const checkedAndEdited = Object.keys(edited)
                      .filter(key => checked.includes(Number(key)))
                      .reduce((acc, key) => {
                        acc[key] = edited[key];
                        return acc;
                      }, {});
                    console.log('checkedAndEdited', checkedAndEdited);

                    if (Object.keys(checkedAndEdited).length === 0) {
                      Swal.fire({ text: '변경된 데이터가 없습니다' });
                      setChecked([]);
                      return;
                    }

                    let requestBody = [];
                    Object.keys(checkedAndEdited).forEach(key => {
                      const index = Number(key); // key는 문자열이므로 숫자로 변환
                      const buyerId = data.data[index].buyerId; // data.data 배열에서 해당 인덱스의 원래 데이터를 가져옴
                      const updatedData = checkedAndEdited[key]; // 수정된 데이터를 가져옴

                      // 원래 데이터에 수정된 데이터를 덮어씌움 (업데이트된 필드만 반영)
                      requestBody.push({
                        buyerId,
                        ...updatedData
                      });
                    });
                    console.log('requestBody: ', requestBody);
                    sendPatchMultiBuyerRequest(state, requestBody, () => {
                      sendGetBuyersRequest({ state: state, page: page, setPage: setPage, size: 10, sortBy: sortBy, buyerNm: searchCondition, setData: resetData, setIsLoading: setIsLoading });
                      setChecked([]);
                    });
                  }}><Edit size={16} /> 수정</button>
                  <button className='manufacturer-button'
                    onClick={() => {
                      if (checked.length === 0) {
                        Swal.fire({ text: "하나 이상의 데이터를 선택해주세요" });
                        return;
                      }

                      ConfirmAlert({
                        dataLength: checked.length,
                        onConfirm: () => {
                          console.log('checked: ', checked);
                          const checkedData = checked.map(item => data.data[item].buyerId);
                          console.log('checkedData: ', checkedData);
                          sendDeleteBuyersRequest(state, checkedData, setChecked, () => {
                            sendGetBuyersRequest({ state: state, page: page, setPage: setPage, size: 10, sortBy: sortBy, buyerNm: searchCondition, setData: resetData, setIsLoading: setIsLoading });
                            setChecked([]);
                          });
                        },
                      })
                    }}><Trash2 size={16} /> 삭제</button>
                </div>
              </div>
              {(isLoading || isLoading2) ? <div /> : <EditableTableWithCheckbox
                columns={columnData}
                ogData={dbData}
                data={data}
                setData={(data) => setData(data)}
                checked={checked}
                setChecked={setChecked}
                edited={edited}
                setEdited={setEdited}
              >
              </EditableTableWithCheckbox>}
            </div>
            {(isLoading || isLoading2) ? <div /> : <PageContainer
              currentPage={page}
              setPage={setPage}
              pageInfo={data.pageInfo}
              getPage={(page) => {
                /* sendGetItemsRequest(state, page, setPage, 10, sortBy, resetData, setIsLoading); */
              }}
              setChecked={(value) => setChecked(value)}
              setIsLoading={setIsLoading}
            ></PageContainer>}
            {isPostMode ? <PostModal
              state={state}
              setOpened={setIsPostMode}
              columnData={columnPostData}
              postRequest={(checkedData, setOpened, setParentData) => {
                sendPostBuyersRequest(state, checkedData, () => {
                  setChecked([]);
                  setOpened(false);
                  sendGetBuyersRequest({ state: state, page: page, setPage: setPage, size: 10, sortBy: sortBy, setData: (value) => setParentData(value) });
                });
              }}
              page={page}
              setPage={setPage}
              sortBy={sortBy}
              setParentData={(value) => resetData(value)}
            ></PostModal> : <div />}
          </div>
        </div>
      </div>
    </div>
  );
}
export default BuyerPostPage;