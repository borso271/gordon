import styles from './SidebarLayout.module.css';

interface SidebarLayoutProps {
  stickyTop?: React.ReactNode;
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ stickyTop, children }) => {
  return (
    <div className={styles.sidebarContainer}>
      {stickyTop && (
        <div className={styles.stickyWrapper}>
          <div className={styles.stickyTop}>{stickyTop}</div>
          <div className={styles.fadeBottom} />
        </div>
      )}
      <div className={styles.scrollableContent}>
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
