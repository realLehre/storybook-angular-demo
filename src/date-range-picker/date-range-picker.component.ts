import {Component, Input, Output, EventEmitter, signal} from '@angular/core';
import { Overlay, OverlayRef, OverlayModule } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';

export interface DateRangePreset {
    label: string;
    getRange: (now: Date) => { start: Date; end: Date };
}

export interface DateRange {
    start: Date;
    end: Date;
    timeZone: string;
}

@Component({
    selector: 'app-date-range-picker',
    templateUrl: './date-range-picker.component.html',
    styleUrls: ['./date-range-picker.component.css'],
    standalone: true,
    imports: [CommonModule, OverlayModule, PortalModule]
})
export class DateRangePickerComponent {
    @Input() presets: DateRangePreset[] = [];
    @Input() timeZones: string[] = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];
    @Input() locale: string = 'en-US';
    @Output() rangeChange = new EventEmitter<DateRange>();

    @ViewChild('pickerPopover') pickerPopover!: TemplateRef<any>;
    @ViewChild('trigger', { static: true }) trigger!: ElementRef;

    overlayRef: OverlayRef | null = null;

    range = signal<DateRange>({
        start: new Date(),
        end: new Date(),
        timeZone: 'UTC',
    });

    constructor(private overlay: Overlay) {}

    openPopover() {
        if (this.overlayRef) return;
        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo(this.trigger)
            .withPositions([
                { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
            ]);
        this.overlayRef = this.overlay.create({ positionStrategy, hasBackdrop: true });
        this.overlayRef.backdropClick().subscribe(() => this.closePopover());
        this.overlayRef.attach(new TemplatePortal(this.pickerPopover, null!));
    }

    closePopover() {
        this.overlayRef?.dispose();
        this.overlayRef = null;
    }

    selectPreset(preset: DateRangePreset) {
        const { start, end } = preset.getRange(new Date());
        this.range.set({ ...this.range(), start, end });
        this.emitChange();
        this.closePopover();
    }

    updateStart(date: string) {
        this.range.set({ ...this.range(), start: new Date(date) });
        this.emitChange();
    }

    updateEnd(date: string) {
        this.range.set({ ...this.range(), end: new Date(date) });
        this.emitChange();
    }

    updateTimeZone(tz: string) {
        this.range.set({ ...this.range(), timeZone: tz });
        this.emitChange();
    }

    emitChange() {
        this.rangeChange.emit(this.range());
    }

    format(date: Date) {
        return formatDate(date, 'yyyy-MM-dd', this.locale, this.range().timeZone);
    }
}
