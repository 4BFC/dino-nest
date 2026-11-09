import Layout from '@theme/Layout';
import {translate} from '@docusaurus/Translate';
import LibraryLayout from '@site/src/app/components/LibraryLayout';
import Updates from '@site/src/app/components/Updates';

export default function UpdatesPage() {
  return (
    <Layout
      title={translate({id: 'docnest.updates.title', message: 'Recent Updates'})}
      description={translate({
        id: 'docnest.updates.description',
        message: 'Browse new and updated documents by date and document space.',
      })}
    >
      <LibraryLayout>
        <Updates />
      </LibraryLayout>
    </Layout>
  );
}
