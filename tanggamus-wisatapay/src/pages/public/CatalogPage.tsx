import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { storageService } from '../../services/storage';
import { DestinationCategory } from '../../types';
import {
  Search,
  Filter,
  MapPin,
  Star,
  ArrowRight,
  Sparkles,
  Compass,
  Waves,
  Mountain,
} from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const catParam = (searchParams.get('cat') as DestinationCategory) || 'all';

  const [search, setSearch] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>(catParam);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'name'>('popular');

  const allDestinations = storageService.getDestinations().filter((d) => d.status === 'active');

  const categories = [
    { id: 'all', label: 'Semua Destinasi', icon: Compass },
    { id: 'bahari', label: 'Bahari & Teluk', icon: Waves },
    { id: 'air_terjun', label: 'Air Terjun Alami', icon: Sparkles },
    { id: 'perbukitan', label: 'Perbukitan & Danau', icon: Mountain },
  ];

  const filteredDestinations = useMemo(() => {
    return allDestinations
      .filter((dest) => {
        const matchesQuery =
          dest.name.toLowerCase().includes(search.toLowerCase()) ||
          dest.kecamatan.toLowerCase().includes(search.toLowerCase()) ||
          dest.description.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          selectedCategory === 'all' || dest.category === selectedCategory;

        return matchesQuery && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return b.reviewsCount - a.reviewsCount; // popular
      });
  }, [allDestinations, search, selectedCategory, sortBy]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('cat');
    } else {
      newParams.set('cat', catId);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-ivory-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-teal uppercase tracking-widest">
            Katalog Resmi Wisata
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
            Destinasi Wisata Kabupaten Tanggamus
          </h1>
          <p className="text-sm text-muted">
            Temukan lokasi liburan impian Anda, pelajari informasi fasilitas dan tarif demo, lalu pesan tiket secara instan.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-sand-200 shadow-soft mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari berdasarkan nama destinasi, pekon, atau kecamatan..."
                className="w-full pl-11 pr-4 py-3 bg-ivory-50 border border-sand-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-charcoal placeholder-muted"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <span className="text-xs text-muted font-medium shrink-0">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-ivory-50 border border-sand-200 text-charcoal text-xs font-semibold py-3 px-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer w-full md:w-auto"
              >
                <option value="popular">Terpopuler</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="name">Nama Alfabetis (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isSelected
                      ? 'bg-emerald-850 text-white shadow-soft'
                      : 'bg-ivory-100 hover:bg-sand-200 text-charcoal'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-300' : 'text-muted'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Summary */}
        <div className="flex items-center justify-between text-xs text-muted mb-6 px-1">
          <span>Menampilkan <strong className="text-charcoal">{filteredDestinations.length}</strong> destinasi aktif</span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-emerald-850 font-bold hover:underline"
            >
              Hapus pencarian
            </button>
          )}
        </div>

        {/* Cards Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest) => {
              const ticketTypes = storageService.getTicketTypes(dest.id);
              const minPrice = ticketTypes.length > 0 ? Math.min(...ticketTypes.map((t) => t.price)) : 10000;

              return (
                <div
                  key={dest.id}
                  className="bg-white rounded-3xl overflow-hidden border border-sand-200 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col group hover:-translate-y-1"
                >
                  {/* Photo container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-sand-100">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-850 shadow-sm">
                      {dest.category === 'bahari'
                        ? '🌊 Bahari'
                        : dest.category === 'air_terjun'
                        ? '💧 Air Terjun'
                        : '⛰️ Perbukitan'}
                    </div>
                    <div className="absolute top-3 right-3 bg-charcoal/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-sand-200 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{dest.rating}</span>
                      <span className="text-[10px] text-sand-300/80">({dest.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-muted mb-2">
                        <MapPin className="w-3.5 h-3.5 text-coral shrink-0" />
                        <span>Kecamatan {dest.kecamatan}, Tanggamus</span>
                      </div>

                      <h3 className="font-extrabold text-charcoal text-lg group-hover:text-emerald-850 transition-colors line-clamp-1">
                        {dest.name}
                      </h3>

                      <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">
                        {dest.shortDescription}
                      </p>

                      {/* Facilities preview */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {dest.facilities.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-ivory-200/80 text-charcoal font-medium"
                          >
                            {f}
                          </span>
                        ))}
                        {dest.facilities.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-muted">
                            +{dest.facilities.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-sand-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted block uppercase font-medium">Mulai dari</span>
                        <span className="text-base font-extrabold text-emerald-850">
                          Rp {minPrice.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <Link
                        to={`/destinasi/${dest.slug}`}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-850 to-forest-green hover:from-emerald-900 hover:to-emerald-850 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-soft transition-all active:scale-95"
                      >
                        <span>Detail & Pesan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-sand-200 max-w-md mx-auto space-y-3">
            <Compass className="w-12 h-12 text-muted mx-auto stroke-1" />
            <h3 className="font-bold text-charcoal text-base">Tidak ada destinasi ditemukan</h3>
            <p className="text-xs text-muted">
              Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
              }}
              className="mt-3 px-4 py-2 bg-emerald-850 text-white text-xs font-semibold rounded-xl"
            >
              Reset Filter
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
