import React from 'react';
import TimeBlock from './TimeBlock';
import { Task as TaskType } from '../App';
import Task from './Task';

interface CalendarProps {
  tasks: TaskType[];
}

const Calendar: React.FC<CalendarProps> = ({ tasks }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex flex-col">
      <div className="flex-1 grid grid-cols-8">
        {/* Empty corner */}
        <div className="border-r border-b"></div>
        {/* Days of the week */}
        {days.map(day => (
          <div key={day} className="text-center border-r border-b p-2 font-semibold">{day}</div>
        ))}

        {/* Time slots */}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="text-center border-r border-b p-2">{`${hour}:00`}</div>
            {days.map(day => (
              <TimeBlock key={`${day}-${hour}`} day={day} hour={hour}>
                {tasks
                  .filter(task => task.day === day && task.hour === hour)
                  .map(task => (
                    <Task key={task.id} task={task} />
                  ))}
              </TimeBlock>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
