import type {MetricServiceDTO} from "../models/dtos/MetricServiceDTO.ts";
import {apiClient} from "./apiClient.ts";
import {attemptServiceMock} from "../__mocks__/attemptServiceMock.ts";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const attemptService = {

    getAttemptMetrics: async (attemptId: string): Promise<MetricServiceDTO> => {
        if (USE_MOCK) return attemptServiceMock.getAttemptMetric(attemptId);
        return apiClient.request<MetricServiceDTO>(`/attempts/${attemptId}/metrics`, { method: 'GET' });
    }
}

export { attemptService }