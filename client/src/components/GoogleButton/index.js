import GoogleLogin from 'react-google-login';
import useGoogleSuccess from '../../hooks/auth/useGoogleSuccess';
import Button from '../Button/index';

const GoogleButton = ({ children }) => {
    const onSuccess = useGoogleSuccess();

    return (
        <GoogleLogin
            clientId="672058375787-ig8vvppsens2vtlqvirok014g6aurkja.apps.googleusercontent.com"
            onSuccess={onSuccess}
            render={({ onClick, disabled }) => (
                <Button onClick={onClick} disabled={disabled} outlined>
                    {children}
                </Button>
            )}
            cookiePolicy={'single_host_origin'}
        />
    );
};

export default GoogleButton;
