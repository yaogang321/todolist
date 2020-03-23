const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
app.use(express.json())

app.get('/accounts', (req, res) => fs.readFile('./data.json','utf-8',(err, data )=>{
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
const createAccount = async (req,res) =>{
    const newAccount =req.body
    const file = await asyncReadFile('./data.json') 
    const account = JSON.parse(file)
    if(account.filter(v=>v.email===newAccount.email).length!=0){
        res.status(400).send
    }
    else{
        account.push(newAccount)
        await asyncReadFile('./data.json',JSON.stringify(account))
        await asyncWriteFile(JSON.stringify(account),'./data.json')
        res.status(201).send(account)
    }

}

app.post('/accounts', createAccount)
app.delete('/del/:id',async (req,res)=>{
    // console.log(req.params.id)
    // console.log(req)
    const file = await asyncReadFile('./data.json') 
    const account = JSON.parse(file)
    if(account.filter(v=>v.id==req.params.id).length!=0){
        for(var i=0;i<account.length;i++){
            if(account[i].id==req.params.id){
                account.splice(i,1)
            }
        }
        await asyncWriteFile(JSON.stringify(account),'./data.json')
        res.status(201).send(account)
    }else{
        res.send('未找到指定id')
    }
    
})
app.get('/getid/:id',async (req,res)=>{
    const file = await asyncReadFile('./data.json') 
    const account = JSON.parse(file)
    if(account.filter(v=>v.id==req.params.id).length!=0){
        for(var i=0;i<account.length;i++){
            if(account[i].id==req.params.id){
                res.status(201).send(account[i])
                return
            }
        }
    }else{
        res.send('未找到指定id')
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
exports.app =app