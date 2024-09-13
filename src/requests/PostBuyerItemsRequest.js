import axios from "axios";
import Swal from "sweetalert2";

const sendPostBuyerItemsRequest = async(state, requestBody, executeAfter) => {
    try{
        const response = await axios.post('http://localhost:8080/buyer-items',
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': state.token
                }   
            }
        );
        if(response.status === 200 || response.status === 201){
            console.log('바이어 아이템 등록 성공', response);
            if(executeAfter !== undefined){
                executeAfter();
            }
        }else{
            console.log('바이어 아이템 등록 실패: ', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch(error){
        console.error('바이어 아이템 등록 실패(에러 발생): ', error);
        Swal.fire({text: `요청 실패(${error.status})`});
    }
}
export default sendPostBuyerItemsRequest;