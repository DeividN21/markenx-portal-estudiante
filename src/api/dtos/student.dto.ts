/**
 * Response de GET /students/me
 * Coincide con StudentMeResponseDTO del backend
 */
export interface StudentProfileResponse {
    id: string;
    email: string;
    fullName: string;
    enrolledCourse: StudentEnrolledCourseResponse;
    currentTerm: StudentCurrentTermResponse;
}

export interface StudentEnrolledCourseResponse {
    id: string;
    label: string;
}

export interface StudentCurrentTermResponse {
    id: string;
    label: string;
}
