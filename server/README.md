# LocalLive Web API & Database Backend

Production-ready ASP.NET Core Web API backend for **LocalLive**, a hyperlocal real-time request platform connecting customers with nearby physical retailers who immediately respond with product availability.

---

## 1. Architecture Overview

- **Framework**: ASP.NET Core Web API 10 / 9 (`C# 13`)
- **Database**: PostgreSQL 16 (via `Npgsql.EntityFrameworkCore.PostgreSQL`) with SQLite fallback for local development.
- **Realtime**: SignalR Hub (`/hubs/live`) with decoupled `IRealtimeNotifier`.
- **Authentication**: JWT Bearer Tokens + Rotating Refresh Tokens with token reuse detection.
- **Geographic Search**: Bounding box index scanning + Haversine spherical distance calculation.
- **Containerization**: Multi-stage `Dockerfile` and `docker-compose.yml` with PostgreSQL health checks.

---

## 2. Core Hyperlocal Live Flow

```
CUSTOMER                                      SHOPS
   │                                             │
   ├─► POST /api/requests                        │
   │   (Finds nearby shops in radius & category) │
   │                                             │
   │                    SignalR: NewLiveRequest ─►
   │                                             │
   │                                             ├─► POST /api/requests/{id}/respond (AVAILABLE)
   │                                             │
   │◄─ SignalR: ShopAvailable ───────────────────┤
   │                                             │
   ├─► POST /api/requests/{id}/select-shop/{id}  │
   │   (Auto-starts Chat Conversation)           │
   │                                             │
   ├─► Chat: POST /api/chat/conversations/{id} ──┼──►
   │                                             │
   ├─► POST /api/requests/{id}/fulfill           │
```

---

## 3. Database Schema

- **Users**: Authentication, roles (`Customer`, `ShopOwner`, `Admin`), status.
- **Categories & Subcategories**: Database-driven, ordering, slugs, active toggling.
- **Shops & ShopCategories**: Many-to-many relationship, GPS coordinates, verification status, live availability online/offline toggle.
- **ShopOperatingHours**: Days of week, open/close intervals, closed flags.
- **LiveRequests**: Customer request text, category, coordinates, search radius, lifecycle statuses (`Active`, `Fulfilled`, `Expired`, `Cancelled`).
- **ShopResponses**: `Available` status with **unique constraint on `(LiveRequestId, ShopId)`** to prevent duplicate responses.
- **Notifications**: Persistent notification inbox for offline delivery.
- **Chat**: `Conversation` and `ChatMessage` linking Customer, Shop, and Request.
- **Reports & AuditLogs**: Moderation and administrative audit trail.
- **BusinessSettings**: Database-backed dynamic configuration (e.g. `RequestExpirationMinutes`, `MaxSearchRadiusKm`).

---

## 4. Running the Backend

### Option A: Running with Docker Compose (PostgreSQL + API)
```bash
cd server
docker-compose up --build
```
- PostgreSQL will be provisioned on `localhost:5432`
- Web API will be running on `http://localhost:5000`
- Swagger UI available at `http://localhost:5000/swagger`

### Option B: Running Locally with .NET CLI
```bash
cd server/Zooner.Api
dotnet run
```

---

## 5. Automated Tests

Execute the xUnit test suite covering categories, shop ownership, nearby geographic matching, request lifecycles, duplicate protection, chat authorization, and reports:
```bash
dotnet test server/Zooner.sln
```

---

## 6. Seed Data for Development

On startup, the system seeds:
- **Default Administrator**: `admin@locallive.com` / `Admin@123456` (Role: `Admin`)
- **Default Settings**: `RequestExpirationMinutes` (30), `MaxSearchRadiusKm` (50), `DefaultSearchRadiusKm` (5).
- **Initial Categories**: `Clothing & Fashion`, `Electronics & Gadgets`, `Grocery & Essentials`, `Pharmacy & Healthcare` with subcategories.

---

## 7. API Reference Summary

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user (`Customer` or `ShopOwner`) |
| `POST` | `/api/auth/login` | Sign in & receive JWT + Refresh Token |
| `POST` | `/api/auth/logout` | Revoke active refresh token |
| `POST` | `/api/auth/refresh-token` | Rotate & refresh access token |
| `GET` | `/api/auth/me` | Current authenticated user claims |

### Categories (`/api/categories`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | List active categories & subcategories in display order |
| `GET` | `/api/categories/{id}` | Get category by ID |
| `GET` | `/api/categories/{id}/subcategories` | Get subcategories for category |

### Shops (`/api/shops`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/shops` | Register new shop (`ShopOwner` / `Admin`) |
| `GET` | `/api/shops/my-shops` | List owned shops |
| `GET` | `/api/shops/{id}` | Shop profile & operating hours |
| `PUT` | `/api/shops/{id}` | Update shop profile |
| `PATCH` | `/api/shops/{id}/live-status` | Toggle LIVE availability (Online/Offline) |
| `POST` | `/api/shops/{id}/categories` | Assign categories to shop |
| `GET` | `/api/shops/{id}/incoming-requests` | View nearby live requests matching shop |

### Live Requests (`/api/requests`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/requests` | Customer creates live request (dispatches to nearby shops) |
| `GET` | `/api/requests/{id}` | Request details and all responding shops |
| `GET` | `/api/requests/my-requests` | Customer's active and past requests |
| `POST` | `/api/requests/{id}/respond` | Shop owner responds AVAILABLE (realtime update) |
| `POST` | `/api/requests/{id}/cancel` | Customer cancels request |
| `POST` | `/api/requests/{id}/select-shop/{shopId}` | Customer selects shop (creates chat) |
| `POST` | `/api/requests/{id}/fulfill` | Mark request fulfilled |

### Chat & Notifications
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/chat/conversations` | List user's conversations |
| `GET` | `/api/chat/conversations/{id}/messages` | Get conversation message history |
| `POST` | `/api/chat/conversations/{id}/messages` | Send message (SignalR broadcast) |
| `GET` | `/api/notifications` | User notifications inbox |
| `PATCH` | `/api/notifications/{id}/read` | Mark notification read |

### Administration (`/api/admin` - Role: `Admin`)
| Method | Endpoint | Description |
|---|---|---|
| `POST/PUT` | `/api/admin/categories` | Create or update category |
| `PATCH` | `/api/admin/categories/{id}/status` | Enable or disable category |
| `POST` | `/api/admin/categories/reorder` | Reorder category display orders |
| `GET` | `/api/admin/shops/pending` | List pending shop verifications |
| `PATCH` | `/api/admin/shops/{id}/verify` | Approve or reject shop |
| `GET` | `/api/admin/reports` | List abuse reports |
| `PATCH` | `/api/admin/reports/{id}/resolve` | Resolve report with audit log |
| `GET/PUT` | `/api/admin/settings` | View or update dynamic business settings |
| `GET` | `/api/admin/audit-logs` | Query administrative audit log trail |
