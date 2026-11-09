import {lazy, Suspense} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const DevAgentation =
  process.env.NODE_ENV === 'development'
    ? lazy(() => import('agentation').then(({Agentation}) => ({default: Agentation})))
    : null;

export default function DevTools() {
  if (!DevAgentation) return null;
  return (
    <BrowserOnly>
      {() => (
        <Suspense fallback={null}>
          <DevAgentation endpoint="http://localhost:4747" />
        </Suspense>
      )}
    </BrowserOnly>
  );
}
