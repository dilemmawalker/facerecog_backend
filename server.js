import express from 'express';
import bodyparser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import kne from 'knex';
var db = kne({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'simplefolio'
    }
  });

  db.select('*').from('users').then(data=>{
      console.log(data);
  });

const app=express();
app.use(cors())

const saltRounds=10;

// const database={
//     user:[
//         {
//             name:'yash',
//             id:'01',
//             email:'yashhanda500@gmail.com',
//             password:bcrypt.hashSync('yashhhh', saltRounds),
//             enteries:0,
//             joined:new Date()
//         },
//         {
//             name:'rahul',
//             id:'02',
//             email:'rahul500@gmail.com',
//             password:bcrypt.hashSync('rahulllllll', saltRounds),
//             enteries:0,
//             joined:new Date()
//         }
//     ]
// }
app.use(bodyparser.json());


app.get('/',(req,res)=>{
    res.send('it is working');    
});


app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
      .where('email', '=', req.body.email)
      .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        console.log(isValid);
        if (isValid) {
          return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(users => {
                console.log(users)
              res.json(users[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
          res.status(400).json('wrong password/email')
        }
      })
      .catch(err => res.status(400).json('wrong credentials'))
  })

app.post('/register',(req,res)=>{
   
  
    // res.json('added to database');
    let a=req.body;
    const hash = bcrypt.hashSync(a.password, saltRounds);

    if(!a.email || !a.password || !a.name)
    return res.json('incorrect form submission');

  db.transaction(trx=>{
      trx.insert({
          hash:hash, email:a.email
      })
      .into('login')
      .returning('email')
      .then(loginemail=>{
          return trx('users')
          .returning('*')
          .insert({
              email:loginemail[0],         //loginemail[0]
              name:a.name,
              joined: new Date()
          })
          .then(user=>{
              res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
   .catch(err=>res.status(400).json('unable to register')) 
});

app.get('/profile/:id',(req,res)=>{
    let {id}=req.params;
        const aa=db.select('*').from('users').where({
            id:id
        })
        .then(user=>{
            res.json(user[0]);
        })
});

app.put('/image',(req,res)=>{
    let {id}=req.body;
  db('users').where({id:id})
  .increment('enteries',1)
  .returning('enteries')
  .then(enteries=>{
      res.json(enteries[0])
  })
});

app.listen(process.env.PORT || 3000,()=>{
    console.log('running');
});