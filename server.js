import express from 'express';
import bodyparser from 'body-parser';
import bcrypt from 'bcrypt';

const app=express();

const saltRounds=10;

const database={
    user:[
        {
            name:'yash',
            id:'01',
            email:'yashhanda500@gmail.com',
            password:bcrypt.hashSync('yashhhh', saltRounds),
            enteries:0,
            joined:new Date()
        },
        {
            name:'rahul',
            id:'02',
            email:'rahul500@gmail.com',
            password:bcrypt.hashSync('rahulllllll', saltRounds),
            enteries:0,
            joined:new Date()
        }
    ]
}
app.use(bodyparser.json());3


app.get('/',(req,res)=>{
    res.send('working file!!!');
});



app.post('/signin',(req,res)=>{
    // res.json('signing in');
    // bcrypt.compareSync(myPlaintextPassword, hash);
    if(req.body.email===database.user[0].email &&
bcrypt.compareSync(req.body.password, database.user[0].password))
        res.json('found');
        else
        res.json('not found');
});

app.post('/register',(req,res)=>{
    let a=req.body;
    const hash = bcrypt.hashSync(a.password, saltRounds);
    database.user.push({
        name:a.name,
        id:database.user.length+1,
        email:a.email,
        password:hash,
        enteries:0,
        joined:new Date()
    });
    // res.json('added to database');
    res.json(database.user[database.user.length-1]);
});

app.get('/signin/:id',(req,res)=>{
    let {id}=req.params;
        let flag=false;
        database.user.map((use,idx)=>{
            if(use.id==id){
                flag=true;
            return res.json(use);
            }
        });
        if(!flag)
        res.json('not found');
});

app.put('/image',(req,res)=>{
    let {id}=req.body;
    let flag=false;
    database.user.map((use,idx)=>{
        if(use.id==id){
            flag=true;
            use.enteries++;
        return res.json(use);
        }
    });
    if(!flag)
    res.json('not found');
});

app.listen(3000,()=>{
    console.log('running');
}); 