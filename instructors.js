const fs = require('fs')

//create 
exports.post = function(req, res) {
    //validando dados    
    const keys = Object.keys(req.body)
    
    for(key of keys) {
        if(req.body[key] == ""){
            return res.send("Por favor preencha todos os campos")
        }
    }

    fs.writeFile("data.json", JSON.stringify(req.body), function(err){
        if(err) return res.send("Write file error")

        return res.redirect("/instructors")
    })

    // return res.send(req.body)
}