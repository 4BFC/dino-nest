import OriginalNavbarSearch from '@theme-original/Navbar/Search';
import styles from '@site/src/app/styles/components/navigation/NavigationControls.module.scss';

// Keep search in the header flow so its mobile absolute position cannot cover
// the adjacent Recent Updates shortcut.
export default function NavbarSearch({className, ...props}) {
  return (
    <OriginalNavbarSearch
      {...props}
      className={`${styles['search-container']} ${className ?? ''}`}
    />
  );
}
