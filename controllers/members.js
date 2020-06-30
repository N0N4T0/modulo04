const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')

//index
exports.index = function(req, res) {
    return res.render("members/index", { members: data.members })
}

//create
exports.create = function(req, res) {
    return res.render('members/create')
}


//CRUD
//delete
exports.delete = function(req, res){
    const { id } = req.body

    const filteredMembers = data.members.filter(function(member){
        return member.id != id
    })

    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error")

        return res.redirect('/members')
    })
}

//atualizar
exports.put = function(req, res){
    const { id } = req.body;
    let index

    const foundMember = data.members.find(function(member, foundIndex){
        if(member.id  == id){
            index = foundIndex            
            return true
        }     
    })

    if(!foundMember) return res.send("Member not found")

    const member = {
        ...foundMember,
        ...req.body,
        id: Number(id),
        birth: Date.parse(req.body.birth),
    }

    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error")

        return res.redirect(`/members/${id}`)
    })
}

//edit
exports.edit = function(req, res){
    const { id } = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if(!foundMember) return res.send("Member not found")

    const member = {
        ...foundMember,
        birth: date(foundMember.birth)
    }

    return res.render('members/edit', {member})
}


//show
exports.show = function(req, res){
    const { id } = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if(!foundMember) return res.send("Member not found")

    const member = {
        ...foundMember,
        age: age(foundMember.birth),
    }

    return res.render('members/show', { member })
}


//create 
exports.post = function(req, res) {
    //validando dados    
    const keys = Object.keys(req.body)
    
    for(key of keys) {
        if(req.body[key] == ""){
            return res.send("Por favor preencha todos os campos")
        }
    }

    birth = Date.parse(req.body.birth)

    let id = 1
    const lastMember = data.members[data.members.length - 1]

    if(lastMember) {
        id = lastMember.id + 1
    } 

    data.members.push({
        id,
        ...req.body,
        birth,
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error")

        return res.redirect(`/members/${id}`)
    })
}