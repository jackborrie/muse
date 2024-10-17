import Axios from 'axios-observable';
import {map} from 'rxjs';



export function getAllBooks (koboId: string) {
    return Axios.get(`http://localhost:5158/api/kobo/${koboId}/books`)
        .pipe (
            map ((response) => {
                return response['data'];
            })
        );
}
export function sendMessage (koboId: string, message: any) {
    console.log(message)
    return Axios.post(`http://localhost:5158/api/kobo/${koboId}/message`, message)
        .pipe (
            map ((response) => {
                return response['data'];
            })
        );
}



