
import { useNavigate } from 'react-router-dom';

const useNavigation = () => {
  const navigate = useNavigate();

  const goToPage = (path: string, state?: any) => {
    navigate(path, { state }); // Pasar el estado junto con la ruta
  };

  return { goToPage };
};

export default useNavigation;
