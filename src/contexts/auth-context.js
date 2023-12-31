import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = window.sessionStorage.getItem("authenticated") === "true";
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const user = {
        id: "5e86809283e28b96d2d38537",
        avatar: "/assets/avatars/avatar-anika-visser.png",
        name: "Anika Visser",
        email: "anika.visser@devias.io",
      };

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = () => {
    try {
      window.sessionStorage.setItem("authenticated", "true");
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: "5e86809283e28b96d2d38537",
      avatar: "/assets/avatars/avatar-anika-visser.png",
      name: "Anika Visser",
      email: "tuannvph27234@fpt.edu.vn",
      password: "123",
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };

  const signIn = async (email, password) => {
    axios
      .post("http://localhost:2003/api/login", {
        username: email,
        password: password,
      })
      .then((response) => {
        const accessToken = response.data.accessToken;
        const idAccount = response.data.idUser;
        const fullName = response.data.fullName;
        const position = response.data.position;
        console.log(idAccount);
        console.log(fullName);
        console.log(accessToken);
        if (accessToken === undefined) {
          alert("Login fail !");
          window.location.href = "/auth/login";
        } // Lưu trữ access token
        window.sessionStorage.setItem("authenticated", "true");
        localStorage.setItem("accessToken", accessToken); // Lưu access token vào localStorage
        localStorage.setItem("idAccount", idAccount);
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("position", position);
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const user = {
          email: email,
          password: password,
        };

        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: user,
        });
      })
      .catch((error) => {
        console.error(error);
        window.location.href = "/auth/login";
        alert("Tài khoản hoặc mật khẩu không chính xác !");
      });
  };

  const signUp = async (email, name, password) => {
    throw new Error("Sign up is not implemented");
  };

  const signOut = () => {
    window.sessionStorage.setItem("authenticated", "false");
    localStorage.setItem("accessToken", ""); // Lưu access token vào localStorage
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
