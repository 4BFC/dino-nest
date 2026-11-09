import styles from '../../styles/components/navigation/MobileNavigation.module.scss';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import LibraryNavigation from '@site/src/app/components/navigation/LibraryNavigation';

export default function MobileNavigation() {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <div className={styles.tree}>
      <LibraryNavigation onNavigate={() => mobileSidebar.toggle()} />
    </div>
  );
}
