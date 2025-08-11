
import {Component, Input, Output, EventEmitter, input, output} from '@angular/core';
import { Task } from '../models/task.model';
import TaskComponent from "../task/task.component";

@Component({
    selector: 'app-task-list',
    standalone: true,
    template: `
		<div class="list-items">
            @for(task of tasksInOrder; track task.id){
                <app-task
                    [task]="task"
                    (onArchiveTask)="onArchiveTask.emit($event)"
                    (onPinTask)="onPinTask.emit($event)"
                >
                </app-task>
			}
            @if(tasksInOrder.length === 0 && !loading()){
                <div
                    class="wrapper-message"
                >
                    <span class="icon-check"></span>
                    <p class="title-message">You have no tasks</p>
                    <p class="subtitle-message">Sit back and relax</p>
                </div>
			}
            @if(loading()){                
                <div>
                    @for(i of [1, 2, 3, 4, 5, 6]; track i){
                        <div class="loading-item">
                            <span class="glow-checkbox"></span>
                            <span class="glow-text">
                           <span>Loading</span> <span>cool</span> <span>state</span>
                         </span>
                        </div>
					}
                </div>
            }
		</div>
    `,
    imports: [
        TaskComponent
    ]
})
export default class TaskListComponent {
    tasksInOrder: Task[] = [];

    loading = input<boolean>(false);

    onPinTask = output();

    onArchiveTask = output();

    @Input()
    set tasks(arr: Task[]) {
        const initialTasks = [
            ...arr.filter(t => t.state === 'TASK_PINNED'),
            ...arr.filter(t => t.state !== 'TASK_PINNED'),
        ];
        const filteredTasks = initialTasks.filter(
            t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
        );
        this.tasksInOrder = filteredTasks.filter(
            t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
        );
    }
}
