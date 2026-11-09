import Layout from '@theme/Layout';
import ErrorPageContent from '@theme/ErrorPageContent';
import {translate} from '@docusaurus/Translate';
import {PageMetadata} from '@docusaurus/theme-common';

export default function ErrorPage() {
  return (
    <Layout title={translate({id: 'docnest.error.title', message: 'Page Error'})}>
      <PageMetadata>
        <meta
          name="robots"
          content="noindex, follow"
        />
      </PageMetadata>
      <ErrorPageContent tryAgain={() => window.location.reload()} />
    </Layout>
  );
}
