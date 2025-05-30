/* eslint-disable no-unused-vars */

import { useNavigate } from 'react-router-dom';

// const useNavigation = () => {
//   const navigate = useNavigate();

//   const goToPage = (path: string, state?: any) => {
//     navigate(path, { state }); // Pasar el estado junto con la ruta
//   };

//   return { goToPage };
// };

// export default useNavigation;

type GoToPage = (path: string, state?: unknown, newTab?: boolean) => void

const useNavigation = () => {
  const navigate = useNavigate()

  const goToPage: GoToPage = (path, state, newTab = false) => {
    if (newTab) {
      // construimos la URL completa con el mismo origin
      const url = window.location.origin + path
      // abrimos la ruta en una pestaña nueva
      window.open(url, '_blank')
    } else {
      navigate(path, { state })
    }
  }

  return { goToPage }
}

export default useNavigation
