export type ActiveRequestType = {
    id: string;
    name: string;
    course: string;
    question: string;
    createdAt: string;
};

export type ProcessedRequestType = {
    id: string;
    tutorId: string;
    studentName: string;
    course: string;
    question: string;
    waitTime: number;
    helpTime: number;
    createdAt: string;
    tutor: UserType; // Reference to the User who handled the request
};

export type UserType = {
    id: string;
    email: string;
    name: string;
    password: string;
    role: string;
    status: StatusType;
    createdAt: string;
    ProcessedRequest: ProcessedRequestType[]; // List of processed requests handled by the user
};

export enum StatusType {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    SUSPENDED = "SUSPENDED"
}
