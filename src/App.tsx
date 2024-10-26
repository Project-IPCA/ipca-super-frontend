import { ToastContainer } from "react-toastify";
import Router from "./Router";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <Router />
      <ToastContainer />
    </Provider>
  );
}

export default App;
