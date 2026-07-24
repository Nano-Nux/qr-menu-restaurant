'use client';

import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  Check,
  X,
  QrCode,
  Bell,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  DollarSign,
  Flame,
  Wine,
  Save,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Tag
} from 'lucide-react';
import QRCode from 'qrcode';
import ImageInputPicker from '@/components/ImageInputPicker';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'menu' | 'promotions' | 'gallery' | 'qrcodes'>('overview');
  
  // Data states
  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [serverCalls, setServerCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [restaurantForm, setRestaurantForm] = useState<any>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modal / Editing states
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [showCatModal, setShowCatModal] = useState(false);

  const [editingPromo, setEditingPromo] = useState<any | null>(null);
  const [showPromoModal, setShowPromoModal] = useState(false);

  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');
  const [newGalleryCat, setNewGalleryCat] = useState('Culinary');

  // QR Code generator states
  const [selectedTableForQr, setSelectedTableForQr] = useState('08');
  const [qrDataUrl, setQrDataUrl] = useState('');

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [rRes, mRes, pRes, gRes, resRes, cRes] = await Promise.all([
        fetch('/api/restaurant').then((r) => r.json()),
        fetch('/api/menu').then((r) => r.json()),
        fetch('/api/promotions?all=true').then((r) => r.json()),
        fetch('/api/gallery').then((r) => r.json()),
        fetch('/api/reservations').then((r) => r.json()),
        fetch('/api/server-call').then((r) => r.json())
      ]);

      if (rRes.data) {
        setRestaurant(rRes.data);
        setRestaurantForm(rRes.data);
      }
      if (mRes.categories) setCategories(mRes.categories);
      if (mRes.items) setMenuItems(mRes.items);
      if (pRes.promotions) setPromotions(pRes.promotions);
      if (gRes.gallery) setGallery(gRes.gallery);
      if (resRes.reservations) setReservations(resRes.reservations);
      if (cRes.calls) setServerCalls(cRes.calls);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Generate QR Code for Selected Table
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      const targetUrl = `${baseUrl}/?table=${selectedTableForQr}`;
      QRCode.toDataURL(targetUrl, { width: 300, margin: 2, color: { dark: '#0c0b09', light: '#ffffff' } }).then((url) => {
        setQrDataUrl(url);
      });
    }
  }, [selectedTableForQr]);

  // Handle Restaurant Settings Save
  const handleSaveRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/restaurant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurantForm)
      });
      const data = await res.json();
      if (data.success) {
        setRestaurant(data.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Menu Item Save (Add or Update)
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const isNew = !editingItem.id;
      const res = await fetch('/api/menu', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      const data = await res.json();
      if (data.success) {
        setShowItemModal(false);
        setEditingItem(null);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete Menu Item
  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Category Save
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;

    try {
      const isNew = !editingCat.id;
      const res = await fetch('/api/categories', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCat)
      });
      const data = await res.json();
      if (data.success) {
        setShowCatModal(false);
        setEditingCat(null);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Deleting this category will also remove associated menu items. Proceed?')) return;
    try {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Promotion Save
  const handleSavePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo) return;

    try {
      const isNew = !editingPromo.id;
      const res = await fetch('/api/promotions', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPromo)
      });
      const data = await res.json();
      if (data.success) {
        setShowPromoModal(false);
        setEditingPromo(null);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete Promotion
  const handleDeletePromotion = async (id: string) => {
    if (!confirm('Delete this promotion offer?')) return;
    try {
      await fetch(`/api/promotions?id=${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Add Gallery Image
  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl) return;

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: newGalleryUrl,
          caption: newGalleryCaption,
          category: newGalleryCat
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewGalleryUrl('');
        setNewGalleryCaption('');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete Gallery Image
  const handleDeleteGalleryImage = async (id: string) => {
    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Resolve Server Call
  const handleResolveServerCall = async (id: string) => {
    try {
      await fetch('/api/server-call', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Resolved' })
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#080706] text-[#f8f5ee] flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0c0b09] border-r border-[#c5a059]/20 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          
          {/* Admin Header Branding */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8c6d27] p-[1px]">
              <div className="w-full h-full bg-[#0c0b09] rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#c5a059]" />
              </div>
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-gold-gradient">
                {restaurant?.name || 'AURELIA'}
              </h1>
              <span className="text-[10px] text-[#c5a059] uppercase font-mono tracking-wider">
                Admin Management
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-between transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#181510] text-[#c5a059] border border-[#c5a059]/40 shadow-lg'
                  : 'text-[#a39783] hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                <span>Live Floor & Calls</span>
              </div>
              {serverCalls.filter((c) => c.status === 'Pending').length > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {serverCalls.filter((c) => c.status === 'Pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#181510] text-[#c5a059] border border-[#c5a059]/40 shadow-lg'
                  : 'text-[#a39783] hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Restaurant Details</span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all ${
                activeTab === 'menu'
                  ? 'bg-[#181510] text-[#c5a059] border border-[#c5a059]/40 shadow-lg'
                  : 'text-[#a39783] hover:text-white hover:bg-white/5'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Menu CRUD ({menuItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('promotions')}
              className={`w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all ${
                activeTab === 'promotions'
                  ? 'bg-[#181510] text-[#c5a059] border border-[#c5a059]/40 shadow-lg'
                  : 'text-[#a39783] hover:text-white hover:bg-white/5'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Promotions</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all ${
                activeTab === 'gallery'
                  ? 'bg-[#181510] text-[#c5a059] border border-[#c5a059]/40 shadow-lg'
                  : 'text-[#a39783] hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Ambiance Gallery</span>
            </button>

            <button
              onClick={() => setActiveTab('qrcodes')}
              className={`w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all ${
                activeTab === 'qrcodes'
                  ? 'bg-[#181510] text-[#c5a059] border border-[#c5a059]/40 shadow-lg'
                  : 'text-[#a39783] hover:text-white hover:bg-white/5'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Table QR Generator</span>
            </button>
          </nav>
        </div>

        <div className="pt-8 border-t border-white/10 space-y-3">
          <a
            href="/"
            className="w-full py-2.5 rounded-xl bg-[#181510] border border-white/10 text-xs text-[#d1c7b7] text-center hover:text-white flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4 text-[#c5a059]" /> View Public Website
          </a>
        </div>
      </aside>

      {/* Main Workspace Body */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        
        {loading ? (
          <div className="flex items-center justify-center h-64 text-[#c5a059] gap-3">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="font-serif text-lg font-bold">Synchronizing Aurelia Database...</span>
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW & LIVE FLOOR CALLS */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#f8f5ee]">
                    Live Floor Operations & Guest Requests
                  </h2>
                  <p className="text-xs text-[#a39783] mt-1">
                    Real-time server calls sent by guests scanning table QR codes.
                  </p>
                </div>

                {/* Server Calls Grid */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#c5a059] flex items-center gap-2">
                      <Bell className="w-5 h-5" /> Pending Table Assistance Calls
                    </h3>
                    <button
                      onClick={fetchAllData}
                      className="p-1.5 text-xs text-[#a39783] hover:text-white flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                  </div>

                  {serverCalls.filter((c) => c.status === 'Pending').length === 0 ? (
                    <p className="text-xs text-[#8c8273] italic py-4 text-center">
                      No pending server assistance calls at this moment.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {serverCalls
                        .filter((c) => c.status === 'Pending')
                        .map((call) => (
                          <div
                            key={call.id}
                            className="p-4 rounded-xl bg-[#1c1813] border border-amber-500/40 space-y-3 shadow-xl"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-400 font-mono">
                                Table {call.table_number}
                              </span>
                              <span className="text-[10px] text-[#8c8273]">{call.created_at}</span>
                            </div>

                            <p className="text-sm font-bold text-[#f8f5ee]">{call.request_type}</p>

                            <button
                              onClick={() => handleResolveServerCall(call.id)}
                              className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> Mark Attended
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Incoming Reservations Table */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#c5a059] flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> Confirmed Table Reservations
                  </h3>

                  {reservations.length === 0 ? (
                    <p className="text-xs text-[#8c8273] italic py-4 text-center">
                      No table reservations logged yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-[#c5a059] font-mono uppercase">
                            <th className="py-2.5 px-3">Guest Name</th>
                            <th className="py-2.5 px-3">Date & Time</th>
                            <th className="py-2.5 px-3">Party</th>
                            <th className="py-2.5 px-3">Environment</th>
                            <th className="py-2.5 px-3">Contact</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {reservations.map((res) => (
                            <tr key={res.id} className="hover:bg-white/5">
                              <td className="py-3 px-3 font-bold text-[#f8f5ee]">{res.guest_name}</td>
                              <td className="py-3 px-3 text-[#d1c7b7]">{res.date} at {res.time}</td>
                              <td className="py-3 px-3 font-mono text-[#c5a059]">{res.guests} Guests</td>
                              <td className="py-3 px-3 text-[#a39783]">{res.seating_area}</td>
                              <td className="py-3 px-3 text-[#a39783]">{res.phone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: RESTAURANT SETTINGS */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveRestaurant} className="space-y-6 max-w-3xl">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#f8f5ee]">
                    Restaurant Identity & Contact Details
                  </h2>
                  <p className="text-xs text-[#a39783] mt-1">
                    Updates reflect dynamically across the guest landing page and digital menu.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#c5a059] block mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        value={restaurantForm.name || ''}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                        className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#c5a059] block mb-1">Brand Tagline</label>
                      <input
                        type="text"
                        value={restaurantForm.tagline || ''}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, tagline: e.target.value })}
                        className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#c5a059] block mb-1">Executive Chef Name</label>
                    <input
                      type="text"
                      value={restaurantForm.chef_name || ''}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, chef_name: e.target.value })}
                      className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#c5a059] block mb-1">Restaurant Story & Philosophy</label>
                    <textarea
                      rows={4}
                      value={restaurantForm.description || ''}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, description: e.target.value })}
                      className="w-full bg-[#181510] border border-white/10 rounded-xl p-4 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#c5a059] block mb-1">Address</label>
                      <input
                        type="text"
                        value={restaurantForm.address || ''}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
                        className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#c5a059] block mb-1">Opening Hours</label>
                      <input
                        type="text"
                        value={restaurantForm.opening_hours || ''}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, opening_hours: e.target.value })}
                        className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#c5a059] block mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={restaurantForm.phone || ''}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, phone: e.target.value })}
                        className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#c5a059] block mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={restaurantForm.whatsapp || ''}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, whatsapp: e.target.value })}
                        className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <ImageInputPicker
                    label="Hero Showcase Image"
                    value={restaurantForm.hero_image_url || ''}
                    onChange={(url) => setRestaurantForm({ ...restaurantForm, hero_image_url: url })}
                  />

                  <button
                    type="submit"
                    className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                      saveSuccess
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09]'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{saveSuccess ? 'Changes Persisted!' : 'Save Restaurant Settings'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: MENU & CATEGORY MANAGEMENT */}
            {activeTab === 'menu' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl font-bold text-[#f8f5ee]">
                      Menu & Category CRUD
                    </h2>
                    <p className="text-xs text-[#a39783] mt-1">
                      Manage food categories, pricing, ingredients, allergens, and availability status.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setEditingCat({ name: '', display_order: categories.length + 1, icon: 'Utensils' });
                        setShowCatModal(true);
                      }}
                      className="px-4 py-2 rounded-full bg-[#181510] border border-[#c5a059]/40 text-xs font-semibold text-[#c5a059] hover:bg-[#c5a059] hover:text-[#0c0b09] transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Category
                    </button>

                    <button
                      onClick={() => {
                        setEditingItem({
                          category_id: categories[0]?.id || '',
                          name: '',
                          description: '',
                          price: 25,
                          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
                          ingredients: '',
                          allergens: '',
                          tags: 'Chef Choice',
                          spice_level: 0,
                          available: 1,
                          wine_pairing: '',
                          calories: 400
                        });
                        setShowItemModal(true);
                      }}
                      className="px-5 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-lg"
                    >
                      <Plus className="w-4 h-4" /> Add Food Item
                    </button>
                  </div>
                </div>

                {/* Categories Table */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#c5a059]">Active Menu Categories</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="p-4 rounded-xl bg-[#181510] border border-white/10 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-bold text-[#f8f5ee]">{cat.name}</p>
                          <span className="text-[10px] text-[#a39783]">Order: #{cat.display_order}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCat(cat);
                              setShowCatModal(true);
                            }}
                            className="p-1.5 text-[#c5a059] hover:text-white"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Food Items List */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#c5a059]">Food Items ({menuItems.length})</h3>
                  
                  <div className="divide-y divide-white/5">
                    {menuItems.map((item) => {
                      const categoryObj = categories.find((c) => c.id === item.category_id);
                      return (
                        <div
                          key={item.id}
                          className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 p-2 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80"}
                              alt={item.name}
                              className="w-14 h-14 rounded-lg object-cover border border-[#c5a059]/30 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-[#f8f5ee]">{item.name}</h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#181510] text-[#c5a059] border border-[#c5a059]/30">
                                  {categoryObj?.name || 'Uncategorized'}
                                </span>
                              </div>
                              <p className="text-xs text-[#a39783] line-clamp-1 mt-0.5">{item.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-serif font-bold text-gold-gradient text-xs">${item.price}</span>
                                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${item.available === 1 ? 'text-emerald-400 bg-emerald-950/40' : 'text-red-400 bg-red-950/40'}`}>
                                  {item.available === 1 ? 'Available' : 'Sold Out'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setShowItemModal(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#181510] border border-white/10 text-xs text-[#c5a059] hover:text-white flex items-center gap-1"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:text-red-200"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: PROMOTIONS */}
            {activeTab === 'promotions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-3xl font-bold text-[#f8f5ee]">
                      Promotions & Chef Specials
                    </h2>
                    <p className="text-xs text-[#a39783] mt-1">
                      Manage banners and special culinary campaigns.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingPromo({
                        title: '',
                        subtitle: '',
                        description: '',
                        image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80',
                        discount_tag: 'Seasonal Special',
                        active: 1
                      });
                      setShowPromoModal(true);
                    }}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Promotion
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {promotions.map((promo) => (
                    <div
                      key={promo.id}
                      className="glass-card rounded-2xl p-6 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#c5a059] text-[#0c0b09]">
                          {promo.discount_tag}
                        </span>
                        <span className={`text-[10px] font-bold ${promo.active === 1 ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {promo.active === 1 ? 'Active' : 'Disabled'}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#f8f5ee]">{promo.title}</h3>
                      <p className="text-xs text-[#a39783] line-clamp-2">{promo.description}</p>

                      <div className="pt-3 flex items-center justify-between border-t border-white/5">
                        <button
                          onClick={() => {
                            setEditingPromo(promo);
                            setShowPromoModal(true);
                          }}
                          className="text-xs text-[#c5a059] font-bold flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeletePromotion(promo.id)}
                          className="text-xs text-red-400 font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: GALLERY */}
            {activeTab === 'gallery' && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#f8f5ee]">
                    Ambiance Gallery Management
                  </h2>
                  <p className="text-xs text-[#a39783] mt-1">
                    Upload or add photo URLs to showcase interior atmosphere and culinary arts.
                  </p>
                </div>

                {/* Add Photo Form */}
                <form onSubmit={handleAddGalleryImage} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 max-w-2xl">
                  <h3 className="font-serif text-lg font-bold text-[#c5a059]">Add New Gallery Photograph</h3>
                  <ImageInputPicker
                    label="Ambiance Photograph"
                    value={newGalleryUrl}
                    onChange={(url) => setNewGalleryUrl(url)}
                  />

                  <div>
                    <label className="text-xs font-semibold text-[#c5a059] block mb-1">Gallery Category</label>
                      <select
                        value={newGalleryCat}
                        onChange={(e) => setNewGalleryCat(e.target.value)}
                        className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      >
                        <option value="Culinary">Culinary</option>
                        <option value="Atmosphere">Atmosphere</option>
                        <option value="Wine & Bar">Wine & Bar</option>
                      </select>
                    </div>

                  <div>
                    <label className="text-xs font-semibold text-[#c5a059] block mb-1">Caption</label>
                    <input
                      type="text"
                      value={newGalleryCaption}
                      onChange={(e) => setNewGalleryCaption(e.target.value)}
                      placeholder="e.g. Grand Dining Room Candlelight"
                      className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] font-bold text-xs uppercase"
                  >
                    Add Image to Gallery
                  </button>
                </form>

                {/* Gallery List Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {gallery.map((g) => (
                    <div key={g.id} className="glass-card rounded-2xl overflow-hidden border border-white/10 group relative">
                      <img src={g.image} alt={g.caption} className="w-full h-40 object-cover" />
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#c5a059] uppercase block">{g.category}</span>
                          <p className="text-xs font-bold text-white line-clamp-1">{g.caption || 'No Caption'}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteGalleryImage(g.id)}
                          className="p-1.5 text-red-400 hover:text-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: TABLE QR CODE GENERATOR */}
            {activeTab === 'qrcodes' && (
              <div className="space-y-8 max-w-2xl">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#f8f5ee]">
                    Table QR Code Generator
                  </h2>
                  <p className="text-xs text-[#a39783] mt-1">
                    Print custom QR standees for physical tables. Scanners will be redirected straight into digital table mode.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-[#c5a059]/40 space-y-6 text-center">
                  <div className="max-w-xs mx-auto">
                    <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block mb-2">
                      Select Table Number
                    </label>
                    <select
                      value={selectedTableForQr}
                      onChange={(e) => setSelectedTableForQr(e.target.value)}
                      className="w-full bg-[#181510] border border-white/20 rounded-xl p-3 text-sm text-white font-mono text-center font-bold"
                    >
                      {Array.from({ length: 30 }).map((_, i) => {
                        const num = (i + 1).toString().padStart(2, '0');
                        return (
                          <option key={num} value={num}>
                            Table {num}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Generated QR Standee Preview Card */}
                  <div className="p-8 rounded-2xl bg-[#ffffff] text-[#0c0b09] max-w-xs mx-auto border-4 border-[#c5a059] shadow-2xl space-y-4">
                    <div className="border-b-2 border-[#0c0b09] pb-3">
                      <span className="font-serif text-2xl font-bold tracking-widest block">
                        {restaurant?.name || 'AURELIA'}
                      </span>
                      <span className="text-[10px] uppercase font-mono tracking-widest font-bold">
                        Fine Dining & QR Menu
                      </span>
                    </div>

                    {qrDataUrl && (
                      <img src={qrDataUrl} alt={`Table ${selectedTableForQr} QR`} className="w-48 h-48 mx-auto" />
                    )}

                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest block text-[#c5a059]">
                        Scan to Browse & Order
                      </span>
                      <span className="font-serif text-2xl font-bold tracking-wider block mt-1">
                        TABLE {selectedTableForQr}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <a
                      href={qrDataUrl}
                      download={`Aurelia-Table-${selectedTableForQr}-QR.png`}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] font-bold text-xs uppercase flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download QR Card
                    </a>
                  </div>
                </div>
              </div>
            )}

          </>
        )}

      </main>

      {/* ITEM MODAL */}
      {showItemModal && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#12100d] border border-[#c5a059]/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full z-10 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-xl font-bold text-[#f8f5ee]">
                {editingItem.id ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button onClick={() => setShowItemModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-4 text-xs">
              <div>
                <label className="text-[#c5a059] block mb-1 font-semibold">Category</label>
                <select
                  value={editingItem.category_id}
                  onChange={(e) => setEditingItem({ ...editingItem, category_id: e.target.value })}
                  className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#c5a059] block mb-1 font-semibold">Dish Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#c5a059] block mb-1 font-semibold">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                    className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[#c5a059] block mb-1 font-semibold">Availability</label>
                  <select
                    value={editingItem.available}
                    onChange={(e) => setEditingItem({ ...editingItem, available: Number(e.target.value) })}
                    className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                  >
                    <option value={1}>Available</option>
                    <option value={0}>Sold Out / Unavailable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#c5a059] block mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <ImageInputPicker
                label="Dish Image"
                value={editingItem.image || ''}
                onChange={(url) => setEditingItem({ ...editingItem, image: url })}
              />

              <div>
                <label className="text-[#c5a059] block mb-1 font-semibold">Tags (comma separated: Bestseller, Chef Choice, New, Seasonal)</label>
                <input
                  type="text"
                  value={editingItem.tags || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, tags: e.target.value })}
                  className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#c5a059] block mb-1 font-semibold">Ingredients</label>
                  <input
                    type="text"
                    value={editingItem.ingredients || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, ingredients: e.target.value })}
                    className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#c5a059] block mb-1 font-semibold">Allergens</label>
                  <input
                    type="text"
                    value={editingItem.allergens || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, allergens: e.target.value })}
                    className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#c5a059] block mb-1 font-semibold">Wine Pairing Recommendation</label>
                <input
                  type="text"
                  value={editingItem.wine_pairing || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, wine_pairing: e.target.value })}
                  className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] font-bold uppercase tracking-wider"
              >
                Save Food Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCatModal && editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#12100d] border border-[#c5a059]/40 rounded-3xl p-6 max-w-md w-full z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#f8f5ee]">
                {editingCat.id ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setShowCatModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="text-[#c5a059] block mb-1 font-semibold">Category Name</label>
                <input
                  type="text"
                  required
                  value={editingCat.name}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#c5a059] block mb-1 font-semibold">Display Order</label>
                <input
                  type="number"
                  required
                  value={editingCat.display_order}
                  onChange={(e) => setEditingCat({ ...editingCat, display_order: parseInt(e.target.value) })}
                  className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] font-bold uppercase"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PROMOTION MODAL */}
      {showPromoModal && editingPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#12100d] border border-[#c5a059]/40 rounded-3xl p-6 max-w-lg w-full z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#f8f5ee]">
                {editingPromo.id ? 'Edit Promotion' : 'Add Promotion'}
              </h3>
              <button onClick={() => setShowPromoModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromotion} className="space-y-4 text-xs">
              <div>
                <label className="text-[#c5a059] block mb-1 font-semibold">Promotion Title</label>
                <input
                  type="text"
                  required
                  value={editingPromo.title}
                  onChange={(e) => setEditingPromo({ ...editingPromo, title: e.target.value })}
                  className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#c5a059] block mb-1 font-semibold">Badge Tag (e.g. Daily 17:30 - 18:30)</label>
                <input
                  type="text"
                  value={editingPromo.discount_tag || ''}
                  onChange={(e) => setEditingPromo({ ...editingPromo, discount_tag: e.target.value })}
                  className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#c5a059] block mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={editingPromo.description || ''}
                  onChange={(e) => setEditingPromo({ ...editingPromo, description: e.target.value })}
                  className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <ImageInputPicker
                label="Promotion Banner Image"
                value={editingPromo.image || ''}
                onChange={(url) => setEditingPromo({ ...editingPromo, image: url })}
              />

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] font-bold uppercase"
              >
                Save Promotion
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
