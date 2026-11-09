import {useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import OriginalDocCardList from '@theme-original/DocCardList';
import DocumentTable from '@site/src/app/components/DocumentTable';
import {findDocumentByRoute} from '@site/src/app/logic/document-list.js';

export default function DocCardList(props) {
  const {pathname} = useLocation();
  const {documentEntries} = usePluginData('library-navigation');
  const current = findDocumentByRoute(documentEntries, pathname);
  if (!current?.isIndex || !current.directory) return <OriginalDocCardList {...props} />;
  return (
    <DocumentTable
      key={current.directory}
      directory={current.directory}
    />
  );
}
