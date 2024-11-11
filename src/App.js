import React from "react";
import logo from "./logo.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./Screens/Main";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Reducers from "./Store";
import { AnimatePresence } from "framer-motion";

function App() {
  const store = configureStore({ reducer: Reducers });

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
        </Provider>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
