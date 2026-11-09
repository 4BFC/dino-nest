import AppProviders from './providers/AppProviders.jsx';
import DevTools from './DevTools.jsx';

export default function Root({children}) {
  return (
    <AppProviders>
      {children}
      <DevTools />
    </AppProviders>
  );
}
