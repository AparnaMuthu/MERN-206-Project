import './Skeleton.css';

/**
 * Reusable skeleton loading components.
 * Display these while data is being fetched to give users
 * a visual indication of what's coming (instead of blank space or "Loading...").
 */

// Catalog page: grid of placeholder cards
export function CatalogSkeleton() {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton skeleton-card-image" />
          <div className="skeleton-card-body">
            <div className="skeleton skeleton-badge" />
            <div className="skeleton skeleton-line full" />
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-line medium" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Book detail page: image + info placeholder
export function BookDetailSkeleton() {
  return (
    <div className="skeleton-detail">
      <div className="skeleton skeleton-detail-image" />
      <div className="skeleton-detail-info">
        <div className="skeleton skeleton-badge" />
        <div className="skeleton skeleton-line full" style={{ height: '28px' }} />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line full" />
        <div className="skeleton skeleton-line full" />
        <div className="skeleton skeleton-line medium" />
        <div className="skeleton skeleton-line full" style={{ height: '100px', marginTop: '12px' }} />
      </div>
    </div>
  );
}

// My books page: list of placeholder rows
export function MyBooksSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton-list-item">
          <div className="skeleton skeleton-list-image" />
          <div className="skeleton-list-info">
            <div className="skeleton skeleton-line medium" />
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-line full" style={{ height: '10px' }} />
          </div>
          <div className="skeleton skeleton-badge" style={{ width: '80px', height: '30px' }} />
        </div>
      ))}
    </div>
  );
}
