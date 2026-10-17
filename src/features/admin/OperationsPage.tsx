import React, { useState } from 'react';
import {
  Plus,
  Check,
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { StaffTask } from '../../types/models';
import { HALLS } from '../../data/venueData';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

export const OperationsPage: React.FC = () => {
  const { success } = useToast();
  const [tasks, setTasks] = useState<StaffTask[]>(() => StorageService.getStaffTasks());
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskHall, setTaskHall] = useState(HALLS[0].name);
  const [taskAssignee, setTaskAssignee] = useState('Deepak Raj');
  const [taskPriority, setTaskPriority] = useState<StaffTask['priority']>('medium');
  const [taskStage, setTaskStage] = useState<StaffTask['stage']>('setup');
  const [taskDueDate, setTaskDueDate] = useState('');

  const toggleTaskStatus = (task: StaffTask) => {
    const nextStatus = task.status === 'done' ? 'todo' : 'done';
    StorageService.updateStaffTaskStatus(task.id, nextStatus);
    setTasks(StorageService.getStaffTasks());
    if (nextStatus === 'done') {
      success('Task Completed', `"${task.title}" marked as complete.`);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    StorageService.createStaffTask({
      title: taskTitle.trim(),
      hallName: taskHall,
      assignedTo: taskAssignee,
      priority: taskPriority,
      stage: taskStage,
      status: 'todo',
      dueDate: taskDueDate || new Date().toISOString().split('T')[0],
    });

    setTasks(StorageService.getStaffTasks());
    setNewTaskModalOpen(false);
    setTaskTitle('');
    success('Task Assigned', 'Operational task added to checklist.');
  };

  const filteredTasks = tasks.filter((t) => {
    if (selectedStage !== 'all' && t.stage !== selectedStage) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">
            Event Operations & Readiness
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Stage checklists, hall setup readiness, and operational run sheets
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setNewTaskModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Assign Operational Task
        </Button>
      </div>

      {/* Stage Filter Buttons */}
      <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-sm flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-ink-600 mr-2">Filter by Stage:</span>
        {[
          { id: 'all', label: 'All Stages' },
          { id: 'pre_event', label: 'Pre-Event Inspection' },
          { id: 'setup', label: 'Hall Setup' },
          { id: 'event_day', label: 'Event Day Operations' },
          { id: 'cleanup', label: 'Post-Event Cleaning' },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStage(s.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              selectedStage === s.id
                ? 'bg-forest-800 text-white font-bold'
                : 'bg-cream-100 text-ink-700 hover:bg-cream-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Tasks Checklist */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-sm divide-y divide-cream-200">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-ink-500">
            No operational tasks in this stage.
          </div>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
                t.status === 'done' ? 'bg-cream-50/50' : 'hover:bg-cream-50'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <button
                  onClick={() => toggleTaskStatus(t)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    t.status === 'done'
                      ? 'bg-forest-800 border-forest-800 text-white'
                      : 'border-cream-400 hover:border-forest-700'
                  }`}
                  aria-label="Toggle task completion"
                >
                  {t.status === 'done' && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="space-y-1 min-w-0">
                  <h4
                    className={`text-sm font-semibold text-forest-950 ${
                      t.status === 'done' ? 'line-through text-ink-400' : ''
                    }`}
                  >
                    {t.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
                    {t.hallName && (
                      <span className="font-semibold text-gold-700">{t.hallName}</span>
                    )}
                    <span>·</span>
                    <span>Assigned to: {t.assignedTo}</span>
                    <span>·</span>
                    <span>Due: {t.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant={
                    t.priority === 'urgent' || t.priority === 'high'
                      ? 'danger'
                      : t.priority === 'medium'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {t.priority.toUpperCase()}
                </Badge>
                <Badge variant={t.status === 'done' ? 'success' : 'default'}>
                  {t.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Task Modal */}
      <Modal
        isOpen={newTaskModalOpen}
        onClose={() => setNewTaskModalOpen(false)}
        title="Assign Operational Task"
        subtitle="Create task for event setup, sound/light verification, or sanitation sign-off."
        maxWidth="md"
      >
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-ink-800">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Test audio microphone and podium setup"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Affected Hall *</label>
            <select
              value={taskHall}
              onChange={(e) => setTaskHall(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            >
              {HALLS.map((h) => (
                <option key={h.id} value={h.name}>
                  {h.name}
                </option>
              ))}
              <option value="Wash Area / Compound">Wash Area / Compound</option>
              <option value="Whole Property">Whole Property</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-ink-800">Stage *</label>
              <select
                value={taskStage}
                onChange={(e) => setTaskStage(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              >
                <option value="pre_event">Pre-Event Inspection</option>
                <option value="setup">Hall Setup</option>
                <option value="event_day">Event Day Operations</option>
                <option value="cleanup">Post-Event Cleanup</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Priority *</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-ink-800">Assignee *</label>
              <input
                type="text"
                required
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Due Date *</label>
              <input
                type="date"
                required
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-cream-200 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setNewTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="md" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
