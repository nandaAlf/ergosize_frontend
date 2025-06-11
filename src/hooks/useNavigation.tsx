/* eslint-disable no-unused-vars */

import { useNavigate } from "react-router-dom";

type GoToPage = (path: string, state?: unknown, newTab?: boolean) => void;

const useNavigation = () => {
  const navigate = useNavigate();

  const goToPage: GoToPage = (path, state, newTab = false) => {
    if (newTab) {
      // construimos la URL completa con el mismo origin
      const url = window.location.origin + path;
      // abrimos la ruta en una pestaña nueva
      if (state) {
        // Para nueva pestaña, usamos localStorage temporalmente
        // const stateKey = `navState_${Date.now()}`;
        // localStorage.setItem(stateKey, JSON.stringify(state));
        // url.searchParams.append("stateKey", stateKey);
      }
      window.open(url, "_blank");
    } else {
      navigate(path, { state });
    }
  };

  return { goToPage };
};

export default useNavigation;
