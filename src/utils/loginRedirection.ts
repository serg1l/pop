import { Response } from "express";;

export default function login(res: Response){
  if(!res.locals.user){
    res.redirect(301, "http://localhost:6700/login");
    return false;
  };
    return true;
};
