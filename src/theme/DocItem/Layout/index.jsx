import {useDoc} from '@docusaurus/plugin-content-docs/client';
import OriginalDocItemLayout from '@theme-original/DocItem/Layout';
import DocumentCategoryPage from '@site/src/app/components/DocumentCategoryPage';
import {documentLocation} from '@site/src/app/logic/document-location.js';

export default function DocItemLayout(props) {
  const {metadata} = useDoc();
  const {directory, isDocumentCategory} = documentLocation(metadata.source, metadata.sourceDirName);
  if (!isDocumentCategory) return <OriginalDocItemLayout {...props} />;
  return (
    <DocumentCategoryPage
      directory={directory}
      title={metadata.title}
      description={metadata.description}
    />
  );
}
