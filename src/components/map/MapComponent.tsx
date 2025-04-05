
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWF5dWRocGFuY2hhbCIsImEiOiJjbTY5Z2picDQwYjkzMmpzY3BrcTNmNG56In0.i6eKC2dHWy3DLik7i1OXJA';

interface Location {
  id: number;
  lat: number;
  lng: number;
  intensity?: number;
  title?: string;
}

interface MapComponentProps {
  locations?: Location[];
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
}

const MapComponent = ({ 
  locations = [], 
  center = [78.9629, 20.5937], // India center
  zoom = 4,
  interactive = true
}: MapComponentProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxKey, setMapboxKey] = useState<string>(mapboxgl.accessToken);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainerRef.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom,
      interactive: interactive,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Clean up on unmount
    return () => map.current?.remove();
  }, [center, zoom, interactive]);

  // Add markers when locations change or map loads
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Remove existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());

    // Add markers for each location
    locations.forEach(location => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'relative';
      
      const markerElement = document.createElement('div');
      markerElement.className = `w-5 h-5 rounded-full bg-red-500 flex items-center justify-center 
                             animate-pulse shadow-md shadow-red-500/50`;
      
      const pinIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      pinIcon.setAttribute('viewBox', '0 0 24 24');
      pinIcon.setAttribute('width', '20');
      pinIcon.setAttribute('height', '20');
      pinIcon.setAttribute('fill', 'none');
      pinIcon.setAttribute('stroke', 'currentColor');
      pinIcon.setAttribute('stroke-width', '2');
      pinIcon.setAttribute('stroke-linecap', 'round');
      pinIcon.setAttribute('stroke-linejoin', 'round');
      pinIcon.classList.add('text-white');
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z');
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '12');
      circle.setAttribute('cy', '10');
      circle.setAttribute('r', '3');
      
      pinIcon.appendChild(path);
      pinIcon.appendChild(circle);
      markerElement.appendChild(pinIcon);
      el.appendChild(markerElement);
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${location.title || 'Incident'}</h3>
            <p class="text-sm">Severity: ${location.intensity || 'Medium'}</p>
          </div>
        `);

      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([location.lng, location.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [locations, mapLoaded]);

  return (
    <div className="h-full w-full relative">
      <div ref={mapContainerRef} className="h-full w-full rounded-lg" />
      
      {/* Attribution */}
      <div className="absolute bottom-0 right-0 bg-white/80 px-2 py-1 text-xs rounded-tl">
        © <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener noreferrer">Mapbox</a>
      </div>
    </div>
  );
};

export default MapComponent;
