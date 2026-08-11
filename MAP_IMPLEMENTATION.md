# Map implementation summary

Changed:
- frontend/package.json
- frontend/src/components/places/PlaceMap.jsx (new)
- frontend/src/pages/places/PlacesPage.jsx
- frontend/src/index.css
- README.md

No backend or Prisma changes are required:
Place already contains latitude/longitude and the backend serializes them as Number.

After replacing/updating the files:
cd frontend
npm uninstall @react-google-maps/api
npm install leaflet react-leaflet
npm run build
