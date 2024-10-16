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



