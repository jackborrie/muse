import * as express from "express";
import {getAllBooks} from './backend';

const app = express()
const port = 3000;

app.get ('/:id', async (req, res) => {
    const id = req.params['id'];
    getAllBooks(id)
        .subscribe(data => {
            let s = '';
            
            for (let d of data) {
                s += ', ' + d.title;
            }
            
            res.send(s);
        }, (error) => {
            console.log(error);
        })
});

app.listen(port, () => {
    console.log('Kobo middleware listening on: http://localhost:3000');
})