import { createContext, useState } from "react";

 export const CounterContext = createContext();
 export default function CounterContextProvider({children}) {
  const [counter, setCounter] = useState(0);
  function sayHello(){
    console.log("hello")
  }

  return <CounterContext.Provider value={{ counter ,setCounter,sayHello}}>
    {children}
  </CounterContext.Provider>;
  //bb3tlha kol el hagat el hstkhdmha bra 
}
