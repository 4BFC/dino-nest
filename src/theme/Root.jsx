import {lazy, Suspense} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import OriginalRoot from '@theme-original/Root';

// Agentation is a development tool provided by this template, not by Dino Ovum.
// Docusaurus replaces process.env.NODE_ENV while bundling, so production builds omit it.
const DevelopmentAgentation =
  process.env.NODE_ENV === 'development'
    ? lazy(() => import('agentation').then(({Agentation}) => ({default: Agentation})))
    : null;

function DevelopmentTools() {
  if (!DevelopmentAgentation) return null;
  return (
    <BrowserOnly>
      {() => (
        <Suspense fallback={null}>
          <DevelopmentAgentation endpoint="http://localhost:4747" />
        </Suspense>
      )}
    </BrowserOnly>
  );
}

export default function Root({children}) {
  return (
    <OriginalRoot>
      {children}
      <DevelopmentTools />
    </OriginalRoot>
  );
}
