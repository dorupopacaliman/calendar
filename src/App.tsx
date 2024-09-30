import Calendar from './components/Calendar';
import EventsProvider from './context/Events';
import './styles.css';

const App = () => {
  return (
    <EventsProvider>
      <Calendar />
    </EventsProvider>
  );
};

export default App;
