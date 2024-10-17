import * as express               from "express";
import * as bodyParser            from 'body-parser';
import {getAllBooks, sendMessage} from './backend';

const app = express()
const port = 3000;

let bodyParse = bodyParser.json();

app.get('/:id', async (req, res) => {
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

app.post('/:id/message', bodyParse, async (req, res) => {
    const id = req.params['id'];
    console.log(req.body)
    sendMessage(id, req.body)
        .subscribe(data => {
            res.send(data);
        }, (error) => {
            res.send(error);
        })
})

app.listen(port, () => {
    console.log('Kobo middleware listening on: http://localhost:3000');
})