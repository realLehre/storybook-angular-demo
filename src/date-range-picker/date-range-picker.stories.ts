import type { Meta, StoryObj } from '@storybook/angular';
import { DateRangePickerComponent, type DateRangePreset, type DateRange } from './date-range-picker.component';
import { applicationConfig } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

const presets: DateRangePreset[] = [
  {
    label: 'Today',
    getRange: (now: Date) => ({ start: new Date(now.setHours(0,0,0,0)), end: new Date(now.setHours(23,59,59,999)) })
  },
  {
    label: 'Last 7 Days',
    getRange: (now: Date) => {
      const end = new Date(now);
      const start = new Date(now);
      start.setDate(end.getDate() - 6);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      return { start, end };
    }
  },
  {
    label: 'This Month',
    getRange: (now: Date) => {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23,59,59,999);
      return { start, end };
    }
  },
  {
    label: 'Last Month',
    getRange: (now: Date) => {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      end.setHours(23,59,59,999);
      return { start, end };
    }
  }
];

const meta = {
  title: 'Components/Date Range Picker',
  component: DateRangePickerComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(OverlayModule)
      ]
    })
  ],
  parameters: {
    docs: {
      description: {
        component: 'A reusable date range picker component with presets, timezone support, and i18n.'
      }
    }
  }
} as const;

export default meta;

type Story = StoryObj<typeof DateRangePickerComponent>;

export const Primary = {
  args: {
    presets,
    timeZones: ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'],
    locale: 'en-US'
  }
} as Story;

export const FrenchLocale = {
  args: {
    presets,
    timeZones: ['UTC', 'Europe/Paris'],
    locale: 'fr-FR'
  }
} as Story;

export const MobileView = {
  args: {
    presets,
    timeZones: ['UTC', 'Asia/Tokyo'],
    locale: 'ja-JP'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
} as Story;

export const Accessibility = {
  args: {
    presets,
    timeZones: ['UTC', 'America/New_York'],
    locale: 'en-US'
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true
          }
        ]
      }
    }
  }
} as Story;
