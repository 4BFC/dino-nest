import Translate from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import ThemedImage from '@theme/ThemedImage';
import {SITE_ROUTES} from '../routes.js';
import styles from '../styles/components/StatusPage.module.scss';

export default function ErrorPageContent({error, tryAgain}) {
  const light = useBaseUrl('img/broken-egg-light.svg');
  const dark = useBaseUrl('img/broken-egg-dark.svg');
  const home = useBaseUrl(SITE_ROUTES.home);

  return (
    <main className="container margin-vert--xl">
      <div className={styles.content}>
        <div className={styles.heading}>
          <ThemedImage
            className={styles.logo}
            alt=""
            width={96}
            height={96}
            sources={{light, dark}}
          />
          <Heading
            as="h1"
            className={styles.title}
          >
            <Translate id="docnest.error.title">Page Error</Translate>
          </Heading>
        </div>
        <p>
          <Translate id="docnest.error.description">
            We couldn't display this page. Try again, or head back home.
          </Translate>
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className="button button--primary"
            onClick={tryAgain}
          >
            <Translate id="docnest.error.retry">Try again</Translate>
          </button>
          <a
            className="button button--secondary button--outline"
            href={home}
          >
            <Translate id="docnest.error.home">Back home</Translate>
          </a>
        </div>
        {error && (
          <details className={styles.details}>
            <summary>
              <Translate id="docnest.error.details">Error details</Translate>
            </summary>
            <pre>{error.message}</pre>
          </details>
        )}
      </div>
    </main>
  );
}
