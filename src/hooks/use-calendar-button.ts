
'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import type { Event } from '@/lib/types';

function formatToICSDate(date: Date) {
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
}

export function useCalendarButton(event: Event) {
  const { googleCalendarUrl, icsContent } = useMemo(() => {
    const startDate = new Date(event.date);
    // Assume event is 2 hours long for end date
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); 

    const startDateGoogle = formatToICSDate(startDate).replace(/-|:|\.\d{3}/g, '');
    const endDateGoogle = formatToICSDate(endDate).replace(/-|:|\.\d{3}/g, '');

    const googleUrl = new URL('https://www.google.com/calendar/render');
    googleUrl.searchParams.append('action', 'TEMPLATE');
    googleUrl.searchParams.append('text', event.title);
    googleUrl.searchParams.append('dates', `${startDateGoogle}/${endDateGoogle}`);
    googleUrl.searchParams.append('details', event.description);
    googleUrl.searchParams.append('location', event.location);

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `URL:${window.location.href}`,
      `DTSTART:${formatToICSDate(startDate)}`,
      `DTEND:${formatToICSDate(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');

    return {
      googleCalendarUrl: googleUrl.toString(),
      icsContent,
    };
  }, [event]);

  const downloadIcsFile = () => {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/ /g,"_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    googleCalendarUrl,
    downloadIcsFile,
  };
}
