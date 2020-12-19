import express from 'express';
import bodyparser from 'body-parser';

const app=express();

app.get('/',(req,res)=>{
    res.send('working file!!!');
});

app.listen(3000,()=>{
    console.log('running');
}); 