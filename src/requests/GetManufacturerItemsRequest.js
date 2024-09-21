import axios from 'axios';
import Swal from 'sweetalert2';

const sendGetManufacturerItemsRequest = async ({state, page, size, setData, sort, mfNm, itemNm, setIsLoading }) => {
    try {
        /* console.log('state:', state.token); */
        const response = await axios.get(`http://localhost:8080/manufacture-items`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${state.token}`
            }   
            ,params: {
                page: page,
                size: size,
                sort: sort,
                mfNm: mfNm,
                itemNm: itemNm,
            }
        });

        if (response.status === 200) {
            console.log('제조사 아이템 정보 GET요청 성공: ', response.data);
            setData(response.data);
            if(setIsLoading !== undefined){
                setIsLoading(false);
            }
        } else {
            console.log('제조사 아이템 정보 GET요청 성공: ', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch (error) {
        console.error('제조사 아이템 정보 GET요청 성공 (에러 발생):', error);
        Swal.fire({text: `요청 실패(${error.status})`});
    }
};

export default sendGetManufacturerItemsRequest;
