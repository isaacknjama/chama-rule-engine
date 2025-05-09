import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send(`Welcome home!`);
})

app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
    
})