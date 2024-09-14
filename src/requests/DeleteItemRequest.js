import axios from 'axios';
import Swal from 'sweetalert2';

const sendDeleteItemRequest = async (state, pageInfo, checkedItems, setChecked, executeAfter) => {
    try {
        console.log('checkedItems in request: ', checkedItems);
        /* const selected = checkedItems.map(item => item + (pageInfo.page - 1) * pageInfo.size);
        console.log('selected: ', selected); */
        const response = await axios.delete(`http://localhost:8080/items`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.token}`
                },
                data: {
                    itemId: checkedItems
                },
            }
        );

        if (response.status === 204) {
            console.log('제품 삭제 성공: ', response.data);
            setChecked([]);
            if(executeAfter !== undefined){
                executeAfter();
            }
        } else {
            console.log('제품 삭제 실패: ', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch (error) {
        console.error('제품 삭제 실패(에러 발생):', error);
        Swal.fire({text: `요청 실패(${error.status})`});
    }
};

export default sendDeleteItemRequest;
