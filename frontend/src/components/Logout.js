import { Navigate} from 'react-router-dom';

const Logout = () => {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  };

export default Logout;