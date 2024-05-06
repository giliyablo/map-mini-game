// src/google.d.ts
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      // Add other options as needed
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
  }
}
