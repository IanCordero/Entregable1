const supabase = require('../lib/supabase');

const PRIORITIES = ['low', 'medium', 'high'];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function sendDatabaseError(res, action, error) {
  console.error(`Supabase error while ${action}:`, error);
  return res.status(500).json({
    message: `No se pudo ${action}.`,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
}

function validateTaskInput(body, partial = false) {
  const errors = [];

  if (!partial || body.title !== undefined) {
    if (typeof body.title !== 'string' || !body.title.trim()) errors.push('El título es obligatorio.');
    else if (body.title.trim().length > 120) errors.push('El título no puede superar 120 caracteres.');
  }

  if (body.description !== undefined && (typeof body.description !== 'string' || body.description.length > 600)) {
    errors.push('La descripción debe ser texto de máximo 600 caracteres.');
  }

  if (body.priority !== undefined && !PRIORITIES.includes(body.priority)) {
    errors.push('La prioridad debe ser low, medium o high.');
  }

  if (body.completed !== undefined && typeof body.completed !== 'boolean') {
    errors.push('El estado completed debe ser verdadero o falso.');
  }

  return errors;
}

async function listTasks(_req, res) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('completed', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return sendDatabaseError(res, 'cargar las tareas', error);
  return res.status(200).json(data);
}

async function createTask(req, res) {
  const errors = validateTaskInput(req.body);
  if (errors.length) return res.status(400).json({ message: errors[0] });

  const newTask = {
    title: req.body.title.trim(),
    description: typeof req.body.description === 'string' ? req.body.description.trim() : '',
    priority: req.body.priority || 'medium',
    completed: false,
  };

  const { data, error } = await supabase.from('tasks').insert(newTask).select().single();
  if (error) return sendDatabaseError(res, 'crear la tarea', error);
  return res.status(201).json(data);
}

async function updateTask(req, res) {
  if (!UUID_PATTERN.test(req.params.id)) return res.status(400).json({ message: 'El ID de la tarea no es válido.' });

  const allowedKeys = ['title', 'description', 'priority', 'completed'];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowedKeys.includes(key)),
  );

  if (!Object.keys(updates).length) return res.status(400).json({ message: 'No se enviaron cambios válidos.' });

  const errors = validateTaskInput(updates, true);
  if (errors.length) return res.status(400).json({ message: errors[0] });

  if (typeof updates.title === 'string') updates.title = updates.title.trim();
  if (typeof updates.description === 'string') updates.description = updates.description.trim();
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .maybeSingle();

  if (error) return sendDatabaseError(res, 'actualizar la tarea', error);
  if (!data) return res.status(404).json({ message: 'La tarea no existe.' });
  return res.status(200).json(data);
}

async function deleteTask(req, res) {
  if (!UUID_PATTERN.test(req.params.id)) return res.status(400).json({ message: 'El ID de la tarea no es válido.' });

  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', req.params.id)
    .select('id')
    .maybeSingle();

  if (error) return sendDatabaseError(res, 'eliminar la tarea', error);
  if (!data) return res.status(404).json({ message: 'La tarea no existe.' });
  return res.status(204).send();
}

module.exports = { listTasks, createTask, updateTask, deleteTask };
