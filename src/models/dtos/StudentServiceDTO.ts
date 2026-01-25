interface StudentServiceDTO {
    id: string;
    email: string;
    fullName: string;
    enrolledCourse: CourseInfo;
    activeTerm: TermInfo;
}

interface CourseInfo {
    id: string;
    label: string;
}

interface TermInfo {
    id: string;
    label: string;
}

export type { StudentServiceDTO };
