import type {StudentServiceDTO} from "../models/dtos/StudentServiceDTO.ts";
import type {TaskServiceDTO} from "../models/dtos/TaskServiceDTO.ts";

const studentServiceMock = {
    getStudentProfile: async (): Promise<StudentServiceDTO> => {
        return {
            id: "15bbf1b8-3c59-462d-a59a-9b2bfa0d771c",
            email: "student.example@udla.edu.ec",
            fullName: "Student Example",
            enrolledCourse: {
                id: "9a4e6602-e07e-47e7-8d8d-24ce40db561e",
                label: "Course Example"
            },
            activeTerm: {
                id: "9acec5e6-845b-410f-aef6-b9f9ad2f7fa0",
                label: "2026-01"
            }
        }
    },

    getStudentTask: async (taskId: string): Promise<TaskServiceDTO> => {
        return mockTasks.find(task => task.id === taskId) || {
            id: "84e1be90-0cd0-459f-b976-11ccb1fb74fe",
            title: "Tarea de prueba",
            summary: "Pulsa Iniciar Misión para empezar...",
            deadline: "2026-02-10T18:00:00",
            minScoreToPass: 0.7,
            status: "NOT_STARTED",
            currentAttempt: 0,
            maxAttempts: 8,
            remainingAttempts: 8
        }
    },

    getStudentTasks: async (): Promise<TaskServiceDTO[]> => {
        return mockTasks;
    },

}

const mockTasks: TaskServiceDTO[] = [
    {
        id: "0747b3ba-8e54-4d0c-941f-c42afb2889ed",
        title: "Tarea de prueba 1",
        summary: "Pulsa Iniciar Misión para empezar...",
        deadline: "2026-02-05T23:59:00",
        minScoreToPass: 0.6,
        status: "IN_PROGRESS",
        currentAttempt: 2,
        maxAttempts: 5,
        remainingAttempts: 3
    },
    {
        id: "84e1be90-0cd0-459f-b976-11ccb1fb74fe",
        title: "Tarea de prueba 2",
        summary: "Pulsa Iniciar Misión para empezar...",
        deadline: "2026-02-10T18:00:00",
        minScoreToPass: 0.7,
        status: "NOT_STARTED",
        currentAttempt: 0,
        maxAttempts: 8,
        remainingAttempts: 8
    },
    {
        id: "7880d421-89c6-4cee-b994-7377cedbdbcb",
        title: "Tarea de prueba 3",
        summary: "Pulsa Iniciar Misión para empezar...",
        deadline: "2026-02-15T18:00:00",
        minScoreToPass: 0.8,
        status: "COMPLETED",
        currentAttempt: 2,
        maxAttempts: 5,
        remainingAttempts: 3
    },
    {
        id: "1903be90-0056-4072-af12-867ff10e9e96",
        title: "Tarea de prueba 4",
        summary: "Pulsa Iniciar Misión para empezar...",
        deadline: "2026-02-20T18:00:00",
        minScoreToPass: 0.9,
        status: "FAILED",
        currentAttempt: 3,
        maxAttempts: 3,
        remainingAttempts: 0
    },
    {
        id: "7378940c-0da2-4187-9dea-06128de79aef",
        title: "Tarea de prueba 5",
        summary: "Pulsa Iniciar Misión para empezar...",
        deadline: "2026-02-15T20:30:00",
        minScoreToPass: 0.3,
        status: "OUTDATED",
        currentAttempt: 0,
        maxAttempts: 3,
        remainingAttempts: 3
    }
];

export {studentServiceMock}