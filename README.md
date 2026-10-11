# 🗺️ HiddenAtlas — Location-Aware 3D Travel Discovery

> **A community-driven, geospatial 3D web experience built with React, TypeScript, Three.js, and Clean Architecture.**  
> Travelers can explore nearby hidden destinations around **Kozhikode Beach, Kerala, India**, calculate precise straight-line distances using the Haversine formula, submit new discoveries with photographs, and see them immediately brought to life as interactive illustrative 3D landmarks in the shared world.

---

## 🌟 Key Highlights

* **Geospatial 3D World (Zero External Map Keys Required)**: A custom, self-contained 3D environment built with **React Three Fiber**, **Drei**, and **Three.js** that maps real latitude and longitude into stable local 3D coordinates.
* **Kozhikode Beach Demo Center**: Reliable demo mode centered at **Kozhikode Beach, Kerala, India** (`11.2588° N, 75.7675° E`). Works seamlessly without GPS permissions, API keys, or cloud accounts.
* **Haversine Distance Engine**: Mathematical straight-line distance calculations:
  * Distances under $1\text{ km}$ display in meters (e.g., `540 m away`, `733 m away`).
  * Distances over $1\text{ km}$ display in kilometers (e.g., `1.1 km away`, `15.3 km away`).
* **Photo-Guided Illustrative 3D Scene Generator**: Local, deterministic scene generator that converts place categories, keywords, and submitted details into distinct 3D landmarks:
  * **Pond / Wetland**: Shimmering blue water body, earthy/grassy bank, water lilies, river rocks, earthen footpath, surrounding shade trees, and a surrounding field landscape if the description mentions *"field"*, *"paddy"*, or *"village"*.
  * **Waterfall**: Multi-tiered rocky cliff, falling blue water with emissive glow, plunge pool, river stones, and lush pines.
  * **Beach & Coast**: Golden sand shore, azure ocean disc, beach parasol, coastal boulders, and palms.
  * **Mountain / Viewpoint**: Multi-tiered elevations, rocky ridgeline, snow cap, and cantilevered viewing platform.
  * **Historical Site / Temple**: Stone plinth, sanctuary chamber, classical pillars, sloped pagoda roof, and golden finial.
  * **Park / Garden**: Manicured green lawn, circular paved promenade, park benches, and ornamental trees.
  * **Village / Food / Heritage**: Clustered multi-story dwellings with terracotta tiled roofs and chimneys.
* **Instant Submission & Persistence**: Add new places with photograph upload (FileReader base64 with $< 5\text{ MB}$ validation), quick-fill coordinate buttons, auto-approval for demo mode, MongoDB persistence, and automatic `localStorage` fallback across page refreshes.
* **Camera Fly-To**: Smooth camera interpolation to any destination selected from the 3D scene or nearby list.

---

## 📍 Kozhikode Demo Destinations & Distance Table

Reference location: **Kozhikode Beach, Kerala, India** (`11.2588° N, 75.7675° E`)

| Landmark / Place | Category | Coordinates | Haversine Distance |
| :--- | :--- | :--- | :--- |
| **TinkerSpace (Living Location)** | Culture / Tech | `11.2610, 75.7720` | **~540 m** |
| **Tali Shiva Temple** | Historical Site | `11.2530, 75.7707` | **~733 m** |
| **Sweet Meat Street (S.M. Street)** | Food / Heritage | `11.2525, 75.7757` | **~1.1 km** |
| **Mananchira Square & Historic Pond** | Nature / Pond | `11.2520, 75.7804` | **~1.6 km** |
| **Sarovaram Bio Park & Wetlands** | Nature / Park | `11.2721, 75.7950` | **~3.3 km** |
| **Cheruvannur Village Lotus Pond** | Nature / Pond | `11.2650, 75.7720` | **~850 m** |
| **Kappad Beach & Rock Formations** | Beaches | `11.3886, 75.7196` | **~15.3 km** |
| **Kadalundi Bird Sanctuary & Estuary** | Nature / Bird | `11.1356, 75.8282` | **~15.2 km** |
| **Thusharagiri Waterfalls & Trek** | Nature / Waterfall | `11.4512, 76.0425` | **~36.8 km** |

---

## 🏛️ Clean Architecture Structure

The project strictly follows **Clean Architecture** principles to decouple user interface, application rules, and data sources:

```
src/
├── domain/                      # Enterprise Business Rules (zero external dependencies)
│   ├── entities/               # Place, User, Memory entities
│   ├── repositories/           # IPlaceRepository, IUserRepository interfaces
│   └── value-objects/          # Coordinates, validation rules
├── application/                 # Application Business Rules
│   ├── dto/                    # SubmitPlaceFormDto, search filters
│   └── use-cases/              # SubmitPlace, GetPlaces, GetPlaceById, SearchPlaces
├── infrastructure/              # External Interfaces & Implementations
│   └── repositories/           # ApiPlaceRepository (REST API), MockPlaceRepository (localStorage)
├── presentation/                # UI Layer (React, Three.js, CSS)
│   ├── components/
│   │   ├── forms/              # AddPlaceForm (FileReader, quick-fill buttons)
│   │   ├── world/              # WorldScene (3D Canvas), WorldSidebar, WorldInfoPanel
│   │   ├── places/             # PlaceCard, FilterBar, PlaceGrid
│   │   └── common/             # Button, Toast, Modal
│   ├── context/                # PlacesContext, AuthContext, ToastContext
│   └── pages/                  # WorldPage, ExplorePage, PlaceDetailPage, AddPlacePage
└── shared/                      # Shared utilities & hooks
    ├── utils/                  # geo.ts (Haversine formula & 3D coordinate projection)
    ├── hooks/                  # useGeoLocation.ts (Demo vs. Device location)
    └── constants/              # categories.ts, authEvents.ts
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/FathimaShaima17/layover-frontend.git
cd layover-frontend
npm install
```

2. *(Optional)* Configure the backend API URL in `.env`:
```env
VITE_API_URL=http://localhost:5000
```
> *If the backend is not running, HiddenAtlas automatically operates in local demo mode using `MockPlaceRepository` and `localStorage`.*

3. Start the development server:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

4. Build for production:
```bash
npm run build
```

---

## 🧭 Step-by-Step Mentor Demo Walkthrough

### 1. Open the 3D World in Demo Mode
1. Open `http://localhost:5173/world`.
2. Notice the central **"📍 You are here (Kozhikode Beach Demo)"** beacon marker.
3. Observe nearby approved landmarks positioned accurately on the 3D landscape.

### 2. Explore Nearby Places & Distances
1. Click the **List button** in the top-right HUD to expand the sidebar.
2. View destinations sorted by straight-line Haversine distance (*TinkerSpace: ~540 m*, *Tali Shiva Temple: ~733 m*, *S.M. Street: ~1.1 km*, *Mananchira Square: ~1.6 km*).
3. Adjust the radius filter chips (`1 km`, `5 km`, `10 km`, `25 km`, `50 km`, `100 km`).
4. Click any destination in the list:
   * The 3D camera smoothly flies to the landmark.
   * A vintage Polaroid info panel opens with the photograph, story, tags, and exact distance badge.

### 3. Add a New Discovery (e.g., A Pond in a Field)
1. Click **"Add a Place"** in the top navigation bar.
2. Fill out the form:
   * **Name**: `Olavanna Village Lotus Pond`
   * **Category**: Select `Nature & Waterfalls`
   * **Description**: `A serene lotus pond in an open green paddy field with coconut trees and laterite stone steps.`
   * **Location**: Click the **"💧 Nearby Pond (~800m north-east)"** quick-fill button (or enter `11.2650` lat, `75.7720` lng).
   * **Image**: Select an image file from your computer (preview appears instantly).
3. Click **"Submit Discovery"**.

### 4. Experience the Instant 3D Scene Generation
1. On the success screen, click **"Enter 3D World"**.
2. The 3D camera flies directly to the new pond:
   * The illustrative generator dynamically builds blue water, earthen bank, floating lily pads, river stones, trees, and a surrounding green field.
   * Selecting the pond displays your original uploaded photo, description, and distance from Kozhikode Beach.

### 5. Verify Persistence
1. Navigate to `/explore` or refresh the page ($F5$).
2. Return to `/world`: your newly created place remains present in the 3D world and the sidebar list.

---

## ⚙️ Technologies Used

* **Frontend Framework**: React 19, TypeScript, Vite
* **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
* **Geospatial Computations**: Haversine Formula, Custom Equirectangular Metric Projection
* **Icons & UI**: `lucide-react`, Custom CSS Design System
* **Architecture**: Clean Architecture (Hexagonal / Ports & Adapters)
* **Backend Companion**: Node.js, Express, TypeScript, MongoDB with Mongoose ([layover-backend](https://github.com/FathimaShaima17/layover-backend))
