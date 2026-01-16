/**
 * Página pública simple para verificar logout sin disparar auto-login.
 * Útil en DEV para evitar confusiones con SSO (Keycloak).
 */
export const LoggedOutPage = () => {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="text-gray-600 font-medium">
                Sesión cerrada en el sistema. Si vuelves a entrar a una ruta privada, se iniciará el login.
            </div>
        </div>
    );
};
