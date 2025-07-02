
import jwt from 'jsonwebtoken';

const userAuth = async(req,res, next)=>{
  const {token} = req.cookies;

  if(!token){
    return res.json({
      success:false,
      message:"token is not there, not Autherised login again."
    });
  }
  try{
    // verify and token decoded

    const tokenDecoded = jwt.verify(token,process.env.JWT_SECRET);

    if(tokenDecoded.id){
      req.body = req.body ? req.body :{};

      req.userId = tokenDecoded.id;
    }else{
      return res.json({success:false,
        message:'token id not avialable not authorised login agian.'
      });
    }
    next();
  }catch(err){
    return res.json({success:false,message:err.message});
  }
}

export default userAuth;