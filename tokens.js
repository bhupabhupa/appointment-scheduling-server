const keys = require('./config/keys');

class Tokens {
    static verifyToken(req,res,next){
        const headers = req.headers;
        const token = headers["x-token"];
        if(!token)
           return res.status(403).send();
        else
        return jwt.verify(token,keys.JWT_KEY,(err,decoded)=>{
            if(err)
             res.status(500).send(err.message)
            else
             next();
        })
    }
}
module.exports = {Tokens};