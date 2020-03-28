const express = require('express')
const fs = require('fs')
const app = express()
//实例化express模块
const port = 3500
app.use(express.json())

//查看tasks
app.get('/api/tasks/', (req, res) => {
    fs.readFile('./data.json','utf-8',(err, data)=>{
        if (err) {
            res.status(500).send()
        }
        else{
            res.json(JSON.parse(data))
            //json.parse用于将字符串转为json
            //json.stringify用于将json转为字符串
        }
    })
})

//读取文件异步处理
asyncReadFile =function(path){
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

//写入文件异步处理
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


//创建tasks
app.post('/api/tasks/',  async (req,res) =>{
    const newTodo =req.body
    const file = await asyncReadFile('./data.json') 
    const todo = JSON.parse(file)
    if(todo.filter(v=>v.content===newTodo.content).length!=0){
        res.status(400).send
    }
    else{
        todo.push(newTodo)
        await asyncReadFile('./data.json',JSON.stringify(todo))
        await asyncWriteFile(JSON.stringify(todo),'./data.json')
        res.status(201).send(todo)
    }
})

//寻找指定id
app.get('/api/tasks/id',async (req,res)=>{
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

//删除指定id的todo
app.delete('/api/tasks/id',async (req,res)=>{
    const file = await asyncReadFile('./data.json') 
    const todo = JSON.parse(file)
    if(todo.filter(v=>v.id==req.params.id).length!=0){
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




//启动服务器
app.listen(port, () => {
    console.log(`todo sever start!`)
})