import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse, Task, TaskInput } from '../types/task';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const requestError = error as AxiosError<ApiErrorResponse>;
    return requestError.response?.data?.message || 'No fue posible conectar con el servidor.';
  }

  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}

export async function getTasks(): Promise<Task[]> {
  const response = await api.get<Task[]>('/tasks');
  return response.data;
}

export async function createTask(values: TaskInput): Promise<Task> {
  const response = await api.post<Task>('/tasks', values);
  return response.data;
}

export async function updateTask(id: string, values: Partial<TaskInput & Pick<Task, 'completed'>>): Promise<Task> {
  const response = await api.put<Task>(`/tasks/${id}`, values);
  return response.data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
