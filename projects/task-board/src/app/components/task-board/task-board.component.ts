import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Task, Lane, Priority, LaneConfig } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
})
export class TaskBoardComponent {
  readonly lanes: LaneConfig[] = [
    { key: 'queued', label: 'Queued' },
    { key: 'moving', label: 'In motion' },
    { key: 'delivered', label: 'Delivered' },
  ];

  private taskService =  inject(TaskService)

  tasks$: Observable<Task[]> = this.taskService.tasks$;
  searchQuery = '';

  isModalOpen = false;
  editingId: string | null = null;
  draggingId: string | null = null;
  dragOverLane: Lane | null = null;

  formTitle = '';
  formNotes = '';
  formPriority: Priority = 'standard';
  formLane: Lane = 'queued';


  laneTasks(tasks: Task[], lane: Lane): Task[] {
    const q = this.searchQuery.trim().toLowerCase();
    return tasks.filter(
      t => t.lane === lane && (!q || t.title.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q))
    );
  }

  laneCount(tasks: Task[], lane: Lane): number {
    return tasks.filter(t => t.lane === lane).length;
  }

  openNewTask(): void {
    this.editingId = null;
    this.formTitle = '';
    this.formNotes = '';
    this.formPriority = 'standard';
    this.formLane = 'queued';
    this.isModalOpen = true;
  }

  openEditTask(task: Task): void {
    this.editingId = task.id;
    this.formTitle = task.title;
    this.formNotes = task.notes;
    this.formPriority = task.priority;
    this.formLane = task.lane;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingId = null;
  }

  saveTask(): void {
    const title = this.formTitle.trim();
    if (!title) return;

    if (this.editingId) {
      this.taskService.updateTask(this.editingId, {
        title,
        notes: this.formNotes.trim(),
        priority: this.formPriority,
        lane: this.formLane,
      });
    } else {
      this.taskService.addTask(title, this.formNotes.trim(), this.formPriority, this.formLane);
    }
    this.closeModal();
  }

  deleteTask(): void {
    if (!this.editingId) return;
    this.taskService.deleteTask(this.editingId);
    this.closeModal();
  }

  onDragStart(task: Task): void {
    this.draggingId = task.id;
  }

  onDragEnd(): void {
    this.draggingId = null;
    this.dragOverLane = null;
  }

  onDragOver(event: DragEvent, lane: Lane): void {
    event.preventDefault();
    this.dragOverLane = lane;
  }

  onDragLeave(lane: Lane): void {
    if (this.dragOverLane === lane) this.dragOverLane = null;
  }

  onDrop(event: DragEvent, lane: Lane): void {
    event.preventDefault();
    this.dragOverLane = null;
    if (this.draggingId) {
      this.taskService.moveTask(this.draggingId, lane);
      this.draggingId = null;
    }
  }

  priorityLabel(priority: Priority): string {
    return { urgent: 'Urgent', standard: 'Standard', low: 'Low' }[priority];
  }
}
