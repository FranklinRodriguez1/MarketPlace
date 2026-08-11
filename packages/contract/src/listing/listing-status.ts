export type ListingType =
    | {
        kind: 'draft';
    }
    | {
        kind: 'published';
        publishedAt: string;
    }
    | {
        kind: 'paused';
    }
    | {
        kind: 'under_review';
        reportId: string;
    }
    | {
        kind: 'removed';
        removedBy: string;
        reason: string;
    };