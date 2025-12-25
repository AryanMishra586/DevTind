const skillsCheck = (req,bd) =>{

    let skl= Array.isArray(req.body?.skills)?req.body.skills:[];
    skl= [...new Set(skl)];
    if(skl.length>10){
        return false;
    }
    bd.skills=skl;
    return true;
}

module.exports = {skillsCheck};