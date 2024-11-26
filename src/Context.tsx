/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState } from "react";

export const Context = createContext<any>(null)

export const Provider = (props:any) => {

    const [flag, setFlag] = useState(false)

    const handleFlag = () => setFlag(true)

    return (
        <Context.Provider
            value={{
                handleFlag,
                flag
            }}
        >
            {props.children}
        </Context.Provider>
    )
}