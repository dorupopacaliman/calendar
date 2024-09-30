import React, { useId, useRef, useState } from 'react';
import { Event, EventColor } from '../context/Events';
import { EVENT_COLORS } from '../hooks/useEvent';
import { formatDate } from '../utils/formatDate';
import { UnionOmit } from '../utils/types';
import Modal, { ModalProps } from './Modal';

type EventFormModalProps = {
  onSubmit: (event: UnionOmit<Event, 'id'>) => void;
} & ({ onDelete: () => void; event: Event; date?: never } | { onDelete?: never; event?: never; date: Date }) &
  Omit<ModalProps, 'children'>;

const EventFormModal = ({ onSubmit, onDelete, event, date, ...modalProps }: EventFormModalProps) => {
  const [selectedColor, setSelectedColor] = useState<EventColor>(event?.color ?? EVENT_COLORS[0]);
  const [isAllDay, setIsAllDay] = useState(event?.allDay ?? false);
  const [startTime, setStartTime] = useState(event?.startTime ?? '');
  const endTimeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const isNew = event == null;
  const formId = useId();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = nameRef.current?.value;
    const endTime = endTimeRef.current?.value;

    if (name == null || name === '') return;

    const commonProps = {
      name,
      date: date || event?.date,
      color: selectedColor,
    };
    let newEvent: UnionOmit<Event, 'id'>;

    if (isAllDay) {
      newEvent = {
        ...commonProps,
        allDay: true,
      };
    } else {
      if (startTime == null || endTime == null || endTime === '' || startTime === '') return;
      newEvent = {
        ...commonProps,
        allDay: false,
        startTime,
        endTime,
      };
    }
    
    modalProps.onClose();
    onSubmit(newEvent);
  };

  return (
    <Modal {...modalProps}>
      <div className="modal-title">
        <div>{isNew ? 'Add Event' : 'Edit Event'}</div>
        <small>{formatDate(date || event.date, { dateStyle: 'short' })}</small>
        <button className="close-btn" onClick={modalProps.onClose}>
          &times;
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor={`${formId}-name`}>Name</label>
          <input ref={nameRef} defaultValue={event?.name} type="text" id={`${formId}-name`} required />
        </div>
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id={`${formId}-all-day`}
            checked={isAllDay}
            onChange={() => setIsAllDay(prevState => !prevState)}
          />
          <label htmlFor={`${formId}-all-day`}>All Day?</label>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor={`${formId}-start-time`}>Start Time</label>
            <input
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              required={!isAllDay}
              disabled={isAllDay}
              type="time"
              id={`${formId}-start-time`}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`${formId}-end-time`}>End Time</label>
            <input
              ref={endTimeRef}
              defaultValue={event?.endTime}
              min={startTime}
              required={!isAllDay}
              disabled={isAllDay}
              type="time"
              id={`${formId}-end-time`}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Color</label>
          <div className="row left">
            {EVENT_COLORS.map(color => (
              <React.Fragment key={color}>
                <input
                  type="radio"
                  name="color"
                  value={color}
                  id={`${formId}-${color}`}
                  checked={selectedColor === color}
                  onChange={() => setSelectedColor(color)}
                  className="color-radio"
                />
                <label htmlFor={`${formId}-${color}`}>
                  <span className="sr-only">{color}</span>
                </label>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="row">
          <button className="btn btn-success" type="submit">
            {isNew ? 'Add' : 'Save'}
          </button>
          {onDelete != null && (
            <button className="btn btn-delete" type="button" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default EventFormModal;
