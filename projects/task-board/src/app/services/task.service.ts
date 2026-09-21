import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, Lane, Priority } from '../models/task.model';

const STORAGE_KEY = 'dispatch-board-tasks-v1';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly tasksSubject = new BehaviorSubject<Task[]>(this.loadTasks());
  readonly tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  private get tasks(): Task[] {
    return this.tasksSubject.value;
  }

  addTask(title: string, notes: string, priority: Priority, lane: Lane): void {
    const task: Task = { id: this.createId(), title, notes, priority, lane };
    this.persist([...this.tasks, task]);
  }

  updateTask(id: string, changes: Partial<Omit<Task, 'id'>>): void {
    const updated = this.tasks.map(t => (t.id === id ? { ...t, ...changes } : t));
    this.persist(updated);
  }

  moveTask(id: string, lane: Lane): void {
    this.updateTask(id, { lane });
  }

  deleteTask(id: string): void {
    this.persist(this.tasks.filter(t => t.id !== id));
  }

  private persist(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  private loadTasks(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.seedTasks();
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : this.seedTasks();
    } catch {
      return this.seedTasks();
    }
  }

  private seedTasks(): Task[] {
    return [
      {
        id: this.createId(),
        title: 'Wire up new client onboarding form',
        notes: 'Reactive form with validation, save to draft.',
        priority: 'standard',
        lane: 'queued',
      },
      {
        id: this.createId(),
        title: 'Fix cart total rounding bug',
        notes: 'Off by one paisa on discounted items.',
        priority: 'urgent',
        lane: 'moving',
      },
      {
        id: this.createId(),
        title: 'Write unit tests for auth guard',
        notes: '',
        priority: 'low',
        lane: 'moving',
      },
      {
        id: this.createId(),
        title: 'Ship dark mode toggle',
        notes: 'Already merged, awaiting release window.',
        priority: 'standard',
        lane: 'delivered',
      },
    ];
  }

  private createId(): string {
    return 't-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }
}
