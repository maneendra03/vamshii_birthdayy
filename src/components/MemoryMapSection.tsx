import { useState, useEffect } from 'react';
import { MapPin, X, Image as ImageIcon, Calendar } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MemoryLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  memories: {
    id: string;
    year: number;
    caption: string;
    mediaPath: string;
    mediaType: 'photo' | 'video';
  }[];
  visitedYear: number;
}

const sampleLocations: MemoryLocation[] = [
  {
    id: '1',
    name: 'Bhavans vivekananda college',
    latitude: 17.489569539348853,
    longitude:  78.53497566788778,
    visitedYear: 2023,
    memories: [
      {
        id: 'm1',
        year: 2023,
        caption: 'Bhada gangggg',
        mediaPath: '/vamshieee/WhatsApp Image 1947-07-21 at 14.50.04.jpeg',
        mediaType: 'photo'
      },
      {
        id: 'm2',
        year: 2023,
        caption: 'BVC memoriess',
        mediaPath: '/vamshieee/WhatsApp Image 1947-07-21 at 15.49.03.jpeg',
        mediaType: 'photo'
      },
      {
        id: 'm3',
        year: 2023,
        caption: 'BVC memoriess',
        mediaPath: '/vamshieee/WhatsApp Image 1947-07-21 at 15.49.04.jpeg',
        mediaType: 'photo'

      }
    ]
  },
  {
    id: '2',
    name: 'Chai thadi',
    latitude: 17.46611643663668, 
    longitude: 78.48701849356256,
    visitedYear: 2024,
    memories: [
      {
        id: 'm1',
        year: 2025,
        caption: 'trust is good, but a cup of chai is better.',
        mediaPath: '/vamshieee/PHOTO-2025-10-13-16-21-37.jpg',
        mediaType: 'photo'
      },
      {
        id: 'm4',
        year: 2025,
        caption: 'Chai — the only relationship we never messed up',
        mediaPath: '/vamshieee/WhatsApp Image 1947-07-21 at 15.49.05.jpeg',
        mediaType: 'photo'
      }
    ]
  },
  {
    id: '3',
    name: 'Tankbund',
    latitude: 17.4169512326881, 
    longitude: 78.48073861700496,
    visitedYear: 2019,
    memories: [
      {
        id: 'm5',
        year: 2019,
        caption: 'Epic day out with friends',
        mediaPath: '/vamshieee/IMG_20200818_150947-01.jpeg',
        mediaType: 'photo'
      },
      {
        id: 'm6',
        year: 2020,
        caption: 'Sunset memories',
        mediaPath: '/vamshieee/IMG_20200818_151026.jpg',
        mediaType: 'photo'
      }
    ]
  },
  {
    id: '4',
    name: 'Eatalia dhaba',
    latitude: 17.486428879903904,
    longitude:  78.54553319672394,
    visitedYear: 2020,
    memories: [
      {
        id: 'm7',
        year: 2020,
        caption: '',
        mediaPath: '/vamshieee/PHOTO-2025-10-13-16-21-46.jpg',
        mediaType: 'photo'
      }
    ]
  },
  {
    id: '5',
    name: 'Inter college vibes',
    latitude: 17.3850,
    longitude: 78.4867,
    visitedYear: 2021,
    memories: [
      {
        id: 'm8',
        year: 2024,
        caption: 'Exploring the city streets',
        mediaPath: '/vamshieee/IMG20210205112206.jpg',
        mediaType: 'photo'
      },
      {
        id: 'm9',
        year: 2024,
        caption: 'Night market adventures',
        mediaPath: '/vamshieee/IMG20210208133139.jpg',
        mediaType: 'photo'
      }
    ]
  },
  {
    id: '6',
    name: 'PAPRIKA CAFE AND RESTAURANT',
    latitude: 17.486488484628214,
    longitude: 78.54557300918451,
    visitedYear: 2024,
    memories: [
      {
        id: 'm8',
        year: 2024,
        caption: 'Exploring the city streets',
        mediaPath: '/vamshieee/WhatsApp Image 1947-07-21 at 15.49.04 (1).jpeg',
        mediaType: 'photo'
      }
    ]
  },
  {
    id: '9',
    name: 'holiii',
    latitude: 17.45217541372276,
    longitude:  78.5096309701519,
    visitedYear: 2024,
    memories: [
      {
        id: 'm8',
        year: 2024,
        caption: 'Holi time',
        mediaPath: '/vamshieee/IMG20210329113115.jpg',
        mediaType: 'photo'
      },
        {
        id: 'm20',
        year: 2024,
        caption: 'Holi time',
        mediaPath: '/vamshieee/IMG20210329113521.jpg',
        mediaType: 'photo'
      }
    ]
  },
  {
    id: '6',
    name: 'homeee',
    latitude:17.45218336382533, 
    longitude: 78.50763331106297,
    visitedYear: 2024,
    memories: [
      {
        id: 'm8',
        year: 2024,
        caption: 'Exploring Vamshi',
        mediaPath: '/vamshieee/IMG_20210206_223622-01.jpeg',
        mediaType: 'photo'
      },
      {
        id: 'm9',
        year: 2024,
        caption: 'Exploring Vamshi',
        mediaPath: '/vamshieee/IMG_20210213_183501_0336.jpg',
        mediaType: 'photo'
      },
      {
        id: 'm8',
        year: 2024,
        caption: 'Exploring Vamshi',
        mediaPath: '/vamshieee/IMG_20210312_203656_533.jpg',
        mediaType: 'photo'
      }
    ]
  },
  {
    id: '7',
    name: 'Tekkali',
    latitude: 18.605427941806955,
    longitude: 84.23107090670631,
    visitedYear: 2023,
    memories: [
      {
        id: 'm10',
        year: 2023,
        caption: 'Memories from Tekkali',
        mediaPath: '/vamshieee/IMG20230525190834.jpg',
        mediaType: 'photo'
      },
      {
        id: 'm11',
        year: 2023,
        caption: 'Memories from Tekkali',
        mediaPath: '/vamshieee/IMG20230523070004.jpg',
        mediaType: 'photo'
      },
      {
        id: 'm12',
        year: 2023,
        caption: 'Memories from Tekkali',
        mediaPath: '/vamshieee/IMG20230522170705.jpg',
        mediaType: 'photo'
      }
    ]
  },
  {
    id: '8',
    name: 'Keesara',
    latitude: 17.531357504261603,
    longitude: 78.68690371053646,
    visitedYear: 2021,
    memories: [
      {
        id: 'm13',
        year: 2021,
        caption: 'Memories from Keesara',
        mediaPath: '/vamshieee/IMG20210311133442.jpg',
        mediaType: 'photo'
      },
      {
        id: 'm14',
        year: 2021,
        caption: 'Memories from Keesara',
        mediaPath: '/vamshieee/IMG20210311111629.jpg',
        mediaType: 'photo'
      },
      {
        id: 'm15',
        year: 2021,
        caption: 'Memories from Keesara',
        mediaPath: '/vamshieee/IMG20210311111535.jpg',
        mediaType: 'photo'
      },
      {
        id: 'm16',
        year: 2021,
        caption: 'Memories from Keesara',
        mediaPath: '/vamshieee/IMG20210311130618.jpg',
        mediaType: 'photo'
      },
      {
        id: 'm17',
        year: 2021,
        caption: 'Memories from Keesara',
        mediaPath: '/vamshieee/IMG20210311130855.jpg',
        mediaType: 'photo'
      }
    ]
  }

];

export default function MemoryMapSection() {
  const [selectedLocation, setSelectedLocation] = useState<MemoryLocation | null>(null);
  const [visiblePins, setVisiblePins] = useState<Set<string>>(new Set());

  // Reveal pins one by one with staggered animation
  useEffect(() => {
    sampleLocations.forEach((_, index) => {
      setTimeout(() => {
        setVisiblePins(prev => new Set(prev).add(sampleLocations[index].id));
      }, index * 300);
    });
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-10 h-10 text-cyan-400 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-black text-white">Memory Map</h2>
          </div>
          <p className="text-xl text-slate-300">Places where our memories were made</p>
          <p className="text-slate-400 mt-2">Scroll to reveal locations around the world</p>
        </div>

        <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
          {/* Map Container */}
          <div className="w-full h-[70vh] rounded-2xl overflow-hidden">
            <MapContainer 
              center={[17.4475, 78.3485]} 
              zoom={8} 
              style={{ height: '100%', width: '100%' }}
              className="rounded-2xl"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {sampleLocations.map((location) => {
                const isVisible = visiblePins.has(location.id);
                
                return (
                  <Marker 
                    key={location.id} 
                    position={[location.latitude, location.longitude]}
                    eventHandlers={{
                      click: () => {
                        setSelectedLocation(location);
                      },
                    }}
                  >
                    <Popup>
                      <div className={`transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <h3 className="font-bold text-slate-800">{location.name}</h3>
                        <p className="text-slate-600 text-sm">Visited in {location.visitedYear}</p>
                        <p className="text-slate-700 text-xs mt-1">
                          {location.memories.length} memories
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* Stats Bar */}
          <div className="p-6 bg-slate-800/30 border-t border-slate-700/50">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{sampleLocations.length}</p>
                  <p className="text-slate-400 text-sm">Locations</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">
                    {sampleLocations.reduce((total, loc) => total + loc.memories.length, 0)}
                  </p>
                  <p className="text-slate-400 text-sm">Memories</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">2017-2022</p>
                  <p className="text-slate-400 text-sm">Years</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Modal */}
        {selectedLocation && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLocation(null)}
          >
            <div 
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedLocation(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedLocation.name}</h3>
                    <p className="text-cyan-400 mb-4">First visited in {selectedLocation.visitedYear}</p>
                    
                    <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                      <h4 className="font-bold text-white mb-2">Location Details</h4>
                      <p className="text-slate-300 text-sm">
                        Latitude: {selectedLocation.latitude.toFixed(4)}<br />
                        Longitude: {selectedLocation.longitude.toFixed(4)}
                      </p>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-xl p-4">
                      <h4 className="font-bold text-white mb-2">Memories</h4>
                      <p className="text-slate-300 text-sm">
                        {selectedLocation.memories.length} memorable moments
                      </p>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <h4 className="text-xl font-bold text-white mb-4">Memories from this location</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedLocation.memories.map((memory) => (
                        <div 
                          key={memory.id}
                          className="group relative bg-slate-700/50 rounded-xl overflow-hidden border border-slate-600/50 hover:border-cyan-500/50 transition-all duration-300"
                        >
                          <div className="aspect-square bg-slate-600 flex items-center justify-center">
                            {memory.mediaType === 'photo' ? (
                              <img 
                                src={memory.mediaPath} 
                                alt={memory.caption}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center p-4">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <div className="w-0 h-0 border-l-6 border-l-white border-y-4 border-y-transparent ml-1"></div>
                                </div>
                                <p className="text-white text-sm">Video Memory</p>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-white font-medium text-sm mb-1">{memory.caption}</p>
                            <div className="flex justify-between items-center">
                              <p className="text-cyan-400 text-xs">{memory.year}</p>
                              <div className="flex items-center gap-1 text-slate-400 text-xs">
                                <Calendar className="w-3 h-3" />
                                <span>{memory.year}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}