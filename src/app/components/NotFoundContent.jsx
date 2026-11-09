import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import ThemedImage from '@theme/ThemedImage';
import styles from '../styles/components/StatusPage.module.scss';

export default function NotFoundContent({className}) {
  const light = useBaseUrl('img/empty-shell-light.svg');
  const dark = useBaseUrl('img/empty-shell-dark.svg');

  return (
    <main className={clsx('container margin-vert--xl', className)}>
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
            <Translate id="theme.NotFound.title">Page Not Found</Translate>
          </Heading>
        </div>
        <p>
          <Translate id="theme.NotFound.p1">We could not find what you were looking for.</Translate>
        </p>
        <p>
          <Translate id="theme.NotFound.p2">
            Please contact the owner of the site that linked you to the original URL and let them
            know their link is broken.
          </Translate>
        </p>
      </div>
    </main>
  );
}
