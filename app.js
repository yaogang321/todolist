const express = require('express')
const fs = require('fs')
const app = express()
const port = 3500
app.use(express.json())

app.get('/todo', (req, res) => fs.readFile('./data.json','utf-8',(err, data)=>{
    if (err) {
        res.status(500).send()
    }
    else{
        res.json(JSON.parse(data))
    }
}))

asyncReadFile =function(path)
{
    return new Promise(
        function(resolve,reject){
            fs.readFile(path,'utf-8',function(err,data){
                if(err){
                    reject(err)
                }
                resolve(data)
            })
        }
        ).catch(err=>{
            return err
        })
    }
const asyncWriteFile =function (string,path){
    return new Promise(function(resolve,reject){
        fs.writeFile(path,string,function(err,data){
            if(err){
                reject(err)
            }
            resolve(data)
        })
    }).catch(err=>{
        return err
    })

}
const createTodo = async (req,res) =>{
    const newTodo =req.body
    const file = await asyncReadFile('./data.json') 
    const todo = JSON.parse(file)
    if(todo.filter(v=>v.words===newTodo.words).length!=0){
        res.status(400).send
    }
    else{
        todo.push(newTodo)
        await asyncReadFile('./data.json',JSON.stringify(todo))
        await asyncWriteFile(JSON.stringify(todo),'./data.json')
        res.status(201).send(todo)
    }

}

app.post('/todo', createTodo)
app.delete('/del/:id',async (req,res)=>{
    // console.log(req.params.id)
    // console.log(req)
    const file = await asyncReadFile('./data.json') 
    const account = JSON.parse(file)
    if(account.filter(v=>v.id==req.params.id).length!=0){
        for(var i=0;i<todo.length;i++){
            if(todo[i].id==req.params.id){
                todo.splice(i,1)
            }
        }
        await asyncWriteFile(JSON.stringify(todo),'./data.json')
        res.status(201).send(todo)
    }else{
        res.send('未找到指定id')
    }
    
})
app.get('/getid/:id',async (req,res)=>{
    const file = await asyncReadFile('./data.json') 
    const todo = JSON.parse(file)
    if(todo.filter(v=>v.id==req.params.id).length!=0){
        for(var i=0;i<todo.length;i++){
            if(todo[i].id==req.params.id){
                res.status(201).send(todo[i])
                return
            }
        }
    }else{
        res.send('未找到指定id')
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
exports.app =app