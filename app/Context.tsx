import {createContext, useState } from "react";
//Context es un objeto que nos permite pasar datos entre
//pantallas, o tener un "contexto global" donde podremos
//leer y almacenar variables
export const MyContext = createContext({
  loginData:{},
  setLoginData:()=>{},

});

export const MyContextProvider = ({children}) =>{
  const[loginData, setLoginData] = useState({});

  return (
    <MyContext.Provider value = {{loginData, setLoginData}}>
      {children}
    </MyContext.Provider>
  );

};