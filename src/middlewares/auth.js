const adminauth=(req,res,next)=>{
    const token="asdfg"
    if(token==="xyz"){
        next();
    }
    else{
        res.status(401).send("Admin not authorised")
    }
}

const userauth=(req,res,next)=>{
    const token="abc"
    if(token==="abc"){
        next();
    }
    else{
        res.status(401).send("User not authorised");
    }
}

module.exports={
    adminauth,
    userauth
}