import type {StudentServiceDTO} from "../models/dtos/StudentServiceDTO.ts";
import type {TaskServiceDTO} from "../models/dtos/TaskServiceDTO.ts";

const studentServiceMock = {
    getStudentMe: async (): Promise<StudentServiceDTO> => {
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

    getTaskById: async (): Promise<TaskServiceDTO> => {
        return {
            id: "e10e8a9d-b2fe-4d9c-bcdd-6207c53d95f3",
            title: "Tarea de prueba",
            summary: "Descripción...",
            deadline: "2026-02-01T18:00:00",
            minScoreToPass: 0.7,
            status: "NOT_STARTED",
            currentAttempt: 1,
            maxAttempts: 11,
            remainingAttempts: 10
        }
    }
}

export { studentServiceMock }