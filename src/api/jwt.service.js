const ID_TOKEN_KEY = "id_token";

export const getToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};


export const saveToken = (token) => {
      window.localStorage.setItem(ID_TOKEN_KEY, token);
      console.log("saved")
};


export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};


    
export const verifyToken = () => {
    if(getToken())
          return true
    return false
};
  
  
export default { getToken, saveToken, destroyToken ,verifyToken};
