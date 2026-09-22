import { Check, Pencil, Trash2 } from 'lucide-react';
import type { Task, TaskPriority } from '../types/task';

interface TaskItemProps {
  task: Task;
  busy: boolean;
  onToggle: (task: Task) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => Promise<void>;
}

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

export function TaskItem({ task, busy, onToggle, onEdit, onDelete }: TaskItemProps) {
  return (
    <article className={`task-card ${task.completed ? 'is-completed' : ''}`}>
      <button
        className="check-button"
        type="button"
        disabled={busy}
        aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
        aria-pressed={task.completed}
        onClick={() => void onToggle(task)}
      >
        {task.completed ? <Check size={17} strokeWidth={3} /> : null}
      </button>

      <div className="task-content">
        <div className="task-title-row">
          <h3>{task.title}</h3>
          <span className={`priority priority-${task.priority}`}>
            {priorityLabels[task.priority]}
          </span>
        </div>
        {task.description ? <p>{task.description}</p> : null}
        <small>
          {task.completed ? 'Completada' : 'Creada'} ·{' '}
          {new Date(task.updated_at).toLocaleDateString('es-EC', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </small>
      </div>

      <div className="task-actions">
        <button type="button" onClick={() => onEdit(task)} disabled={busy} aria-label="Editar tarea">
          <Pencil size={17} />
        </button>
        <button
          className="danger-button"
          type="button"
          onClick={() => void onDelete(task)}
          disabled={busy}
          aria-label="Eliminar tarea"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  );
}
