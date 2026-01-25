import type {SessionServiceDTO} from "../models/dtos/SessionServiceDTO.ts";

const sessionServiceMock = {
    getAuthMe: async (): Promise<SessionServiceDTO> => {
        return {
            username: 'student.example@udla.edu.ec',
            email: 'student.example@udla.edu.ec',
            fullName: 'Student Example',
            roles: ['ROLE_STUDENT'],
        };
    },

    logoutFederated: (postLogoutRedirectUrl: string) => {
        console.log('Simulando logout federado, redirigiendo a:', postLogoutRedirectUrl);
        window.location.href = postLogoutRedirectUrl;
        return;
    }
};

export { sessionServiceMock }