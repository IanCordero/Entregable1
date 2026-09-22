import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, ListFilter, RefreshCw } from 'lucide-react';
import { TaskForm } from './components/TaskForm';
import { TaskItem } from './components/TaskItem';
import { createTask, deleteTask, getErrorMessage, getTasks, updateTask } from './services/tasksApi';
import type { Task, TaskInput } from './types/task';

type Filter = 'all' | 'pending' | 'completed';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadTasks() {
    try {
      setLoading(true);
      setError('');
      setTasks(await getTasks());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(''), 3000);
    return () => window.clearTimeout(timer);
  }, [success]);

  const visibleTasks = useMemo(() => {
    if (filter === 'pending') return tasks.filter((task) => !task.completed);
    if (filter === 'completed') return tasks.filter((task) => task.completed);
    return tasks;
  }, [filter, tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;

  async function handleSave(values: TaskInput) {
    try {
      setSaving(true);
      setError('');

      if (editingTask) {
        const updated = await updateTask(editingTask.id, values);
        setTasks((current) => current.map((task) => (task.id === updated.id ? updated : task)));
        setEditingTask(null);
        setSuccess('La tarea fue actualizada correctamente.');
      } else {
        const created = await createTask(values);
        setTasks((current) => [created, ...current]);
        setSuccess('La tarea fue creada correctamente.');
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(task: Task) {
    try {
      setBusyTaskId(task.id);
      setError('');
      const updated = await updateTask(task.id, { completed: !task.completed });
      setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setSuccess(updated.completed ? 'Tarea completada.' : 'La tarea volvió a pendientes.');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyTaskId('');
    }
  }

  async function handleDelete(task: Task) {
    if (!window.confirm(`¿Eliminar la tarea “${task.title}”?`)) return;

    try {
      setBusyTaskId(task.id);
      setError('');
      await deleteTask(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      if (editingTask?.id === task.id) setEditingTask(null);
      setSuccess('La tarea fue eliminada.');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyTaskId('');
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <a className="brand" href="#top" aria-label="TaskFlow inicio">
          <span className="brand-mark"><CheckCircle2 size={22} /></span>
          <span>TaskFlow</span>
        </a>
        <span className="header-note">Organiza tu día, una tarea a la vez.</span>
      </header>

      <section className="hero" id="top">
        <div>
          <span className="eyebrow">Tu espacio personal</span>
          <h1>Convierte tus pendientes<br />en progreso.</h1>
          <p>Crea, organiza y completa tus tareas desde un solo lugar.</p>
        </div>
        <div className="progress-card">
          <span>Progreso general</span>
          <strong>{completedCount}<small> / {tasks.length}</small></strong>
          <div className="progress-track">
            <span style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }} />
          </div>
          <small>{tasks.length ? `${Math.round((completedCount / tasks.length) * 100)}% completado` : 'Agrega tu primera tarea'}</small>
        </div>
      </section>

      <section className="workspace">
        <aside>
          <TaskForm
            task={editingTask}
            saving={saving}
            onSubmit={handleSave}
            onCancel={() => setEditingTask(null)}
          />
        </aside>

        <div className="task-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Vista general</span>
              <h2>Mis tareas</h2>
            </div>
            <button className="refresh-button" type="button" onClick={() => void loadTasks()} disabled={loading}>
              <RefreshCw size={17} className={loading ? 'spin' : ''} /> Actualizar
            </button>
          </div>

          <div className="filters" aria-label="Filtrar tareas">
            <ListFilter size={17} />
            {(['all', 'pending', 'completed'] as Filter[]).map((value) => (
              <button
                type="button"
                key={value}
                className={filter === value ? 'active' : ''}
                onClick={() => setFilter(value)}
              >
                {value === 'all' ? 'Todas' : value === 'pending' ? 'Pendientes' : 'Completadas'}
              </button>
            ))}
          </div>

          {error ? <div className="message error" role="alert">{error}</div> : null}
          {success ? <div className="message success" role="status">{success}</div> : null}

          {loading ? (
            <div className="state-card"><span className="loader" /><p>Cargando tus tareas…</p></div>
          ) : visibleTasks.length ? (
            <div className="task-list">
              {visibleTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  busy={busyTaskId === task.id}
                  onToggle={handleToggle}
                  onEdit={setEditingTask}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="state-card empty-state">
              <ClipboardList size={38} />
              <h3>No hay tareas en esta vista</h3>
              <p>{filter === 'all' ? 'Crea una tarea para comenzar.' : 'Prueba con otro filtro.'}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
