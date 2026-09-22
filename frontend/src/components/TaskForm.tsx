import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Save, X } from 'lucide-react';
import type { Task, TaskInput, TaskPriority } from '../types/task';

interface TaskFormProps {
  task?: Task | null;
  saving: boolean;
  onSubmit: (values: TaskInput) => Promise<void>;
  onCancel?: () => void;
}

const emptyForm: TaskInput = {
  title: '',
  description: '',
  priority: 'medium',
};

export function TaskForm({ task, saving, onSubmit, onCancel }: TaskFormProps) {
  const [form, setForm] = useState<TaskInput>(emptyForm);

  useEffect(() => {
    setForm(
      task
        ? { title: task.title, description: task.description, priority: task.priority }
        : emptyForm,
    );
  }, [task]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim()) return;
    await onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() });
    if (!task) setForm(emptyForm);
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <span className="eyebrow">{task ? 'Actualizar tarea' : 'Nueva tarea'}</span>
          <h2>{task ? 'Edita los detalles' : '¿Qué necesitas hacer?'}</h2>
        </div>
        {task && onCancel ? (
          <button className="icon-button" type="button" onClick={onCancel} aria-label="Cancelar edición">
            <X size={20} />
          </button>
        ) : null}
      </div>

      <label>
        Título
        <input
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          placeholder="Ej. Terminar la presentación"
          maxLength={120}
          required
        />
      </label>

      <label>
        Descripción <span className="optional">(opcional)</span>
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          placeholder="Agrega información que te ayude a completar la tarea"
          maxLength={600}
          rows={4}
        />
      </label>

      <label>
        Prioridad
        <select
          value={form.priority}
          onChange={(event) => setForm({ ...form, priority: event.target.value as TaskPriority })}
        >
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </label>

      <button className="primary-button" type="submit" disabled={saving || !form.title.trim()}>
        {task ? <Save size={18} /> : <Plus size={18} />}
        {saving ? 'Guardando…' : task ? 'Guardar cambios' : 'Agregar tarea'}
      </button>
    </form>
  );
}
