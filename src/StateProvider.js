import React, { useEffect, useState, createContext, useReducer, useContext } from "react";
import { auth } from "./firebaseConfig";

export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => {
    return (<StateContext.Provider value={useReducer(reducer, initialState)}>{children}</StateContext.Provider>);
};

export const useStateValue = () => useContext(StateContext);