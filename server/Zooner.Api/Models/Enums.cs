namespace Zooner.Api.Models;

public enum LiveRequestStatus
{
    Active = 0,
    Fulfilled = 1,
    Expired = 2,
    Cancelled = 3
}

public enum ShopResponseStatus
{
    Available = 0
}

public enum ShopVerificationStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

public enum ReportStatus
{
    Pending = 0,
    UnderReview = 1,
    Resolved = 2,
    Dismissed = 3
}
