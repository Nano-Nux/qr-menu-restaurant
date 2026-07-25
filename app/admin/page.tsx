'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Tag,
  LogOut,
  KeyRound,
  User,
  UserCheck,
  Lock,
  MessageSquare,
  Send
} from 'lucide-react';
import QRCode from 'qrcode';
import ImageInputPicker from '@/components/ImageInputPicker';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'reservations' | 'settings' | 'menu' | 'promotions' | 'gallery' | 'qrcodes' | 'support'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Auth & Admin state
  const [adminUser, setAdminUser] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  // Change Password Modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Data states
  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [serverCalls, setServerCalls] = useState<any[]>([]);
  const [tableOrders, setTableOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [replyingTicketId, setReplyingTicketId] = useState<string | null>(null);
  const [ticketFilter, setTicketFilter] = useState<'All' | 'Pending' | 'Replied'>('All');
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const [reservationFilter, setReservationFilter] = useState<string>('All');
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
      const [rRes, mRes, pRes, gRes, resRes, cRes, ordRes, ticketRes] = await Promise.all([
        fetch('/api/restaurant').then((r) => r.json()),
        fetch('/api/menu').then((r) => r.json()),
        fetch('/api/promotions?all=true').then((r) => r.json()),
        fetch('/api/gallery').then((r) => r.json()),
        fetch('/api/reservations').then((r) => r.json()),
        fetch('/api/server-call').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/support').then((r) => r.json())
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
      if (ordRes.orders) setTableOrders(ordRes.orders);
      if (ticketRes && ticketRes.tickets) setTickets(ticketRes.tickets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this table order?')) return;
    try {
      await fetch(`/api/orders?id=${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplyTicket = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      const response = await fetch('/api/support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, admin_reply: replyText })
      });
      const data = await response.json();
      if (data.success) {
        setReplyText('');
        setReplyingTicketId(null);
        fetchAllData();
      } else {
        alert('Failed to send reply: ' + data.error);
      }
    } catch (err: any) {
      alert('Error replying to ticket: ' + err.message);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;
    try {
      const response = await fetch(`/api/support?id=${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        fetchAllData();
      } else {
        alert('Failed to delete ticket: ' + data.error);
      }
    } catch (err: any) {
      alert('Error deleting ticket: ' + err.message);
    }
  };

  const handleUpdateReservationStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/reservations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;
    try {
      await fetch(`/api/reservations?id=${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Check Admin Session on Mount
  useEffect(() => {
    let active = true;

    // Safety fallback timeout: if request takes more than 4 seconds, redirect to login
    const timeoutId = setTimeout(() => {
      if (active) {
        setAuthenticated(false);
        router.replace('/admin/login');
      }
    }, 4000);

    const token = typeof window !== 'undefined' ? localStorage.getItem('aurelia_admin_session') : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('/api/admin/me', { headers })
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        if (active) {
          clearTimeout(timeoutId);
          if (data.authenticated) {
            setAuthenticated(true);
            setAdminUser(data.user);
          } else {
            setAuthenticated(false);
            router.replace('/admin/login');
          }
        }
      })
      .catch(() => {
        if (active) {
          clearTimeout(timeoutId);
          setAuthenticated(false);
          router.replace('/admin/login');
        }
      });

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aurelia_admin_session');
      }
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/admin/login';
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    setPasswordLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('aurelia_admin_session') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers,
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || 'Failed to update password');
      } else {
        setPasswordSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess(null);
        }, 1500);
      }
    } catch (err) {
      setPasswordError('An error occurred while updating password');
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [rRes, mRes, pRes, gRes, resRes, cRes] = await Promise.all([
          fetch('/api/restaurant').then((r) => r.json()),
          fetch('/api/menu').then((r) => r.json()),
          fetch('/api/promotions?all=true').then((r) => r.json()),
          fetch('/api/gallery').then((r) => r.json()),
          fetch('/api/reservations').then((r) => r.json()),
          fetch('/api/server-call').then((r) => r.json())
        ]);

        if (active) {
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
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
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

  if (authenticated !== true) {
    return (
      <div className="min-h-screen bg-[#080706] text-[#f8f5ee] flex items-center justify-center p-4 font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#a39783] font-mono uppercase tracking-widest">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080706] text-[#f8f5ee] flex flex-col lg:flex-row font-sans relative overflow-hidden">
      
      {/* Mobile & Tablet Header Bar */}
      <header className="lg:hidden w-full bg-[#0c0b09] border-b border-[#c5a059]/20 px-6 py-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8c6d27] p-[1px]">
            <div className="w-full h-full bg-[#0c0b09] rounded-full flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            </div>
          </div>
          <div>
            <h1 className="font-serif text-base font-bold text-gold-gradient">
              {restaurant?.name || 'AURELIA'}
            </h1>
            <span className="text-[9px] text-[#c5a059] uppercase font-mono tracking-wider block">
              Admin Management
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2.5 rounded-xl bg-[#181510] border border-[#c5a059]/30 text-[#c5a059] hover:text-white transition-all"
          aria-label="Open Admin Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Sidebar Drawer Backdrop for Mobile & Tablet */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0c0b09] border-r border-[#c5a059]/20 p-6 flex flex-col justify-between shrink-0 overflow-y-auto
        transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:max-h-screen lg:translate-x-0 h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-8">
          
          {/* Admin Header Branding */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
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

            {/* Mobile Sidebar Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#a39783] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
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
              onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}
              className={`w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-between transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#181510] text-[#c5a059] border border-[#c5a059]/40 shadow-lg'
                  : 'text-[#a39783] hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Flame className="w-4 h-4" />
                <span>Table Orders</span>
              </div>
              {tableOrders.filter((o) => o.status === 'Pending').length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                  {tableOrders.filter((o) => o.status === 'Pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('reservations'); setIsSidebarOpen(false); }}
              className={`w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-between transition-all ${
                activeTab === 'reservations'
                  ? 'bg-[#181510] text-[#c5a059] border border-[#c5a059]/40 shadow-lg'
                  : 'text-[#a39783] hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span>Reservations</span>
              </div>
              {reservations.filter((r) => r.status === 'Confirmed' || r.status === 'Pending' || !r.status).length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#c5a059]/20 text-[#c5a059] text-[10px] font-bold">
                  {reservations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
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
              onClick={() => { setActiveTab('menu'); setIsSidebarOpen(false); }}
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
              onClick={() => { setActiveTab('promotions'); setIsSidebarOpen(false); }}
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
              onClick={() => { setActiveTab('gallery'); setIsSidebarOpen(false); }}
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
              onClick={() => { setActiveTab('qrcodes'); setIsSidebarOpen(false); }}
              className={`w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all ${
                activeTab === 'qrcodes'
                  ? 'bg-[#181510] text-[#c5a059] border border-[#c5a059]/40 shadow-lg'
                  : 'text-[#a39783] hover:text-white hover:bg-white/5'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Table QR Generator</span>
            </button>

            <button
              onClick={() => { setActiveTab('support'); setIsSidebarOpen(false); }}
              className={`w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-between transition-all ${
                activeTab === 'support'
                  ? 'bg-[#181510] text-[#c5a059] border border-[#c5a059]/40 shadow-lg'
                  : 'text-[#a39783] hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Support Desk</span>
              </div>
              {tickets.filter((t) => t.status === 'Pending').length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                  {tickets.filter((t) => t.status === 'Pending').length}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="pt-8 border-t border-white/10 space-y-3">
          {adminUser && (
            <div className="p-3 rounded-xl bg-[#181510] border border-[#c5a059]/20 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#c5a059]/20 text-[#c5a059] flex items-center justify-center font-bold text-xs shrink-0">
                  {adminUser.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{adminUser.name || 'Executive Manager'}</p>
                  <p className="text-[10px] text-[#a39783] truncate">@{adminUser.username}</p>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setShowPasswordModal(true); setIsSidebarOpen(false); }}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#d1c7b7] flex items-center justify-center gap-1 transition-colors"
                >
                  <KeyRound className="w-3 h-3 text-[#c5a059]" />
                  <span>Password</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="py-1.5 px-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-[11px] flex items-center justify-center gap-1 transition-colors border border-red-500/20"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          <Link
            href="/"
            onClick={() => setIsSidebarOpen(false)}
            className="w-full py-2.5 rounded-xl bg-[#181510] border border-white/10 text-xs text-[#d1c7b7] text-center hover:text-white flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4 text-[#c5a059]" /> View Public Website
          </Link>
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

                {/* Active Kitchen Orders Summary */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#c5a059] flex items-center gap-2">
                      <Flame className="w-5 h-5 text-amber-500" /> Active Table Orders ({tableOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length})
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#c5a059] hover:underline flex items-center gap-1 font-semibold"
                    >
                      View All Orders ({tableOrders.length}) <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {tableOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length === 0 ? (
                    <p className="text-xs text-[#8c8273] italic py-4 text-center">
                      No active pending or preparing table orders right now.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tableOrders
                        .filter(o => o.status === 'Pending' || o.status === 'Preparing')
                        .map((order) => {
                          const items = Array.isArray(order.items) ? order.items : [];
                          return (
                            <div
                              key={order.id}
                              className="p-4 rounded-xl bg-[#1c1813] border border-[#c5a059]/30 space-y-3 shadow-xl"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-amber-400 font-mono">
                                  {order.table_number.startsWith('Table') ? order.table_number : `Table ${order.table_number}`}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  order.status === 'Preparing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                }`}>
                                  {order.status || 'Pending'}
                                </span>
                              </div>

                              <div>
                                <p className="text-xs text-[#a39783]">Diner: <strong className="text-white">{order.customer_name}</strong></p>
                                <p className="text-xs text-[#c5a059] font-mono mt-0.5">{items.length} items • ${Number(order.total_amount).toFixed(2)}</p>
                              </div>

                              <div className="flex items-center gap-2 pt-1">
                                {order.status === 'Pending' ? (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Preparing')}
                                    className="flex-1 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                                  >
                                    Mark Preparing
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}
                                    className="flex-1 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                                  >
                                    Mark Completed
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Incoming Reservations Table */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#c5a059] flex items-center gap-2">
                      <Calendar className="w-5 h-5" /> Confirmed Table Reservations
                    </h3>
                    <button
                      onClick={() => setActiveTab('reservations')}
                      className="text-xs text-[#c5a059] hover:underline flex items-center gap-1 font-semibold"
                    >
                      Manage Reservations ({reservations.length}) <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

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
                            <th className="py-2.5 px-3">Special Offer / Request</th>
                            <th className="py-2.5 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {reservations.map((res) => (
                            <tr key={res.id} className="hover:bg-white/5">
                              <td className="py-3 px-3 font-bold text-[#f8f5ee]">
                                {res.guest_name}
                                <span className="block text-[10px] text-[#8c8273] font-mono font-normal">{res.phone}</span>
                              </td>
                              <td className="py-3 px-3 text-[#d1c7b7]">{res.date} at {res.time}</td>
                              <td className="py-3 px-3 font-mono text-[#c5a059]">{res.guests} Guests</td>
                              <td className="py-3 px-3 text-[#a39783]">{res.seating_area}</td>
                              <td className="py-3 px-3 text-[#d1c7b7] italic">{res.special_requests || '-'}</td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  (res.status || 'Confirmed') === 'Confirmed'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : (res.status || 'Confirmed') === 'Seated'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                    : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {res.status || 'Confirmed'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: TABLE ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl font-bold text-[#f8f5ee]">
                      Kitchen & Table Orders
                    </h2>
                    <p className="text-xs text-[#a39783] mt-1">
                      Manage live orders placed directly by diners at their assigned tables.
                    </p>
                  </div>
                  <button
                    onClick={fetchAllData}
                    className="px-4 py-2 rounded-xl bg-[#181510] border border-[#c5a059]/30 text-xs text-[#c5a059] hover:bg-[#c5a059] hover:text-[#0c0b09] font-bold flex items-center gap-2 self-start transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                  {['All', 'Pending', 'Preparing', 'Completed', 'Cancelled'].map((f) => {
                    const count = f === 'All' 
                      ? tableOrders.length 
                      : tableOrders.filter((o) => o.status === f).length;
                    return (
                      <button
                        key={f}
                        onClick={() => setOrderFilter(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                          orderFilter === f
                            ? 'bg-[#c5a059] text-[#0c0b09] shadow-lg'
                            : 'bg-[#181510] text-[#a39783] hover:text-white border border-white/5'
                        }`}
                      >
                        <span>{f}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          orderFilter === f ? 'bg-black/20 text-[#0c0b09]' : 'bg-white/10 text-[#c5a059]'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Orders List */}
                {tableOrders.filter((o) => orderFilter === 'All' || o.status === orderFilter).length === 0 ? (
                  <div className="glass-card p-12 rounded-2xl border border-white/10 text-center space-y-3">
                    <Flame className="w-12 h-12 mx-auto text-[#c5a059]/40" />
                    <p className="text-sm text-[#a39783]">No {orderFilter !== 'All' ? orderFilter.toLowerCase() : ''} table orders recorded yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {tableOrders
                      .filter((o) => orderFilter === 'All' || o.status === orderFilter)
                      .map((order) => {
                        const items = Array.isArray(order.items) ? order.items : [];
                        return (
                          <div
                            key={order.id}
                            className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 hover:border-[#c5a059]/40 transition-all shadow-xl"
                          >
                            <div className="flex items-start justify-between border-b border-white/10 pb-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="px-3 py-1 rounded-full bg-[#c5a059] text-[#0c0b09] font-bold font-mono text-xs">
                                    {order.table_number.startsWith('Table') ? order.table_number : `Table ${order.table_number}`}
                                  </span>
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    order.status === 'Pending'
                                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                      : order.status === 'Preparing'
                                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                      : order.status === 'Completed'
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                                  }`}>
                                    {order.status || 'Pending'}
                                  </span>
                                </div>
                                <h3 className="font-serif text-lg font-bold text-white mt-2">
                                  Diner: <span className="text-[#c5a059]">{order.customer_name}</span>
                                </h3>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-[#8c8273] block font-mono">
                                  {order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                                <span className="font-serif text-lg font-bold text-gold-gradient block mt-1">
                                  ${Number(order.total_amount).toFixed(2)}
                                </span>
                              </div>
                            </div>

                            {/* Itemized list */}
                            <div className="space-y-2 bg-[#14120f] p-3 rounded-xl border border-white/5 max-h-48 overflow-y-auto">
                              <span className="text-[10px] text-[#a39783] uppercase tracking-wider block font-bold">
                                Ordered Items ({items.length})
                              </span>
                              {items.map((it: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-white/5 last:border-0">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[#c5a059]/20 text-[#c5a059] font-mono text-[10px] font-bold flex items-center justify-center">
                                      {it.quantity || 1}x
                                    </span>
                                    <span className="text-white font-medium">{it.name || it.title}</span>
                                  </div>
                                  <span className="font-mono text-[#a39783]">
                                    ${((it.price || 0) * (it.quantity || 1)).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                              <div className="flex flex-wrap gap-2">
                                {order.status !== 'Preparing' && order.status !== 'Completed' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Preparing')}
                                    className="px-3 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1"
                                  >
                                    <Flame className="w-3.5 h-3.5" /> Mark Preparing
                                  </button>
                                )}
                                {order.status !== 'Completed' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Mark Completed
                                  </button>
                                )}
                                {order.status !== 'Cancelled' && order.status !== 'Completed' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                                    className="px-3 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 font-bold text-xs flex items-center gap-1 border border-amber-500/30"
                                  >
                                    <X className="w-3.5 h-3.5" /> Cancel
                                  </button>
                                )}
                              </div>

                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: RESERVATIONS & SPECIAL OFFERS */}
            {activeTab === 'reservations' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl font-bold text-[#f8f5ee]">
                      Reservations & Special Offers
                    </h2>
                    <p className="text-xs text-[#a39783] mt-1">
                      Manage guest table bookings, party sizes, seating preferences, and special offer claims.
                    </p>
                  </div>
                  <button
                    onClick={fetchAllData}
                    className="px-4 py-2 rounded-xl bg-[#181510] border border-[#c5a059]/30 text-xs text-[#c5a059] hover:bg-[#c5a059] hover:text-[#0c0b09] font-bold flex items-center gap-2 self-start transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh Reservations
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                  {['All', 'Confirmed', 'Seated', 'Completed', 'Cancelled'].map((f) => {
                    const count = f === 'All' 
                      ? reservations.length 
                      : reservations.filter((r) => (r.status || 'Confirmed') === f).length;
                    return (
                      <button
                        key={f}
                        onClick={() => setReservationFilter(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                          reservationFilter === f
                            ? 'bg-[#c5a059] text-[#0c0b09] shadow-lg'
                            : 'bg-[#181510] text-[#a39783] hover:text-white border border-white/5'
                        }`}
                      >
                        <span>{f}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          reservationFilter === f ? 'bg-black/20 text-[#0c0b09]' : 'bg-white/10 text-[#c5a059]'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Reservations Grid */}
                {reservations.filter((r) => reservationFilter === 'All' || (r.status || 'Confirmed') === reservationFilter).length === 0 ? (
                  <div className="glass-card p-12 rounded-2xl border border-white/10 text-center space-y-3">
                    <Calendar className="w-12 h-12 mx-auto text-[#c5a059]/40" />
                    <p className="text-sm text-[#a39783]">No {reservationFilter !== 'All' ? reservationFilter.toLowerCase() : ''} reservations found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {reservations
                      .filter((r) => reservationFilter === 'All' || (r.status || 'Confirmed') === reservationFilter)
                      .map((res) => {
                        const status = res.status || 'Confirmed';
                        const isSpecialOffer = res.special_requests && res.special_requests.toLowerCase().includes('special offer');
                        return (
                          <div
                            key={res.id}
                            className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 hover:border-[#c5a059]/40 transition-all shadow-xl"
                          >
                            <div className="flex items-start justify-between border-b border-white/10 pb-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    status === 'Confirmed'
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                      : status === 'Seated'
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                      : status === 'Completed'
                                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                                  }`}>
                                    {status}
                                  </span>

                                  {isSpecialOffer && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40 flex items-center gap-1">
                                      <Sparkles className="w-3 h-3" /> Special Offer Claim
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-serif text-xl font-bold text-white mt-2">
                                  {res.guest_name}
                                </h3>
                                <p className="text-xs text-[#a39783] font-mono mt-0.5">
                                  {res.email} • {res.phone}
                                </p>
                              </div>

                              <div className="text-right bg-[#181510] px-3 py-2 rounded-xl border border-white/5">
                                <span className="font-serif text-sm font-bold text-[#c5a059] block">
                                  {res.date}
                                </span>
                                <span className="text-xs text-[#d1c7b7] font-mono block">
                                  @ {res.time}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs bg-[#14120f] p-3 rounded-xl border border-white/5">
                              <div>
                                <span className="text-[10px] text-[#a39783] uppercase block font-semibold">Party Size</span>
                                <span className="font-mono text-[#c5a059] font-bold">{res.guests} Guests</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-[#a39783] uppercase block font-semibold">Seating Salon</span>
                                <span className="text-white font-medium">{res.seating_area || 'Main Dining Room'}</span>
                              </div>
                            </div>

                            {res.special_requests && (
                              <div className="p-3 rounded-xl bg-[#181510] border border-[#c5a059]/20 text-xs">
                                <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-wider block mb-1">
                                  Special Request / Notes
                                </span>
                                <p className="text-white font-light italic">&ldquo;{res.special_requests}&rdquo;</p>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                              <div className="flex flex-wrap gap-2">
                                {status !== 'Seated' && status !== 'Completed' && (
                                  <button
                                    onClick={() => handleUpdateReservationStatus(res.id, 'Seated')}
                                    className="px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" /> Mark Seated
                                  </button>
                                )}
                                {status !== 'Completed' && (
                                  <button
                                    onClick={() => handleUpdateReservationStatus(res.id, 'Completed')}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Mark Completed
                                  </button>
                                )}
                                {status !== 'Cancelled' && status !== 'Completed' && (
                                  <button
                                    onClick={() => handleUpdateReservationStatus(res.id, 'Cancelled')}
                                    className="px-3 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 font-bold text-xs flex items-center gap-1 border border-amber-500/30"
                                  >
                                    <X className="w-3.5 h-3.5" /> Cancel
                                  </button>
                                )}
                              </div>

                              <button
                                onClick={() => handleDeleteReservation(res.id)}
                                className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                                title="Delete Reservation"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
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

                  {/* Social Media Links */}
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#c5a059] mb-4">Social Media Channels</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#a39783] block mb-1">Instagram Profile URL</label>
                        <input
                          type="text"
                          value={restaurantForm.instagram_url || ''}
                          onChange={(e) => setRestaurantForm({ ...restaurantForm, instagram_url: e.target.value })}
                          className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                          placeholder="https://instagram.com/aurelia.dining"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#a39783] block mb-1">Facebook Page URL</label>
                        <input
                          type="text"
                          value={restaurantForm.facebook_url || ''}
                          onChange={(e) => setRestaurantForm({ ...restaurantForm, facebook_url: e.target.value })}
                          className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                          placeholder="https://facebook.com/aureliadining"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Map & Coordinates Location Details */}
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#c5a059] mb-4">Coordinates & Google Maps</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#a39783] block mb-1">Latitude (for display)</label>
                        <input
                          type="text"
                          value={restaurantForm.map_latitude || ''}
                          onChange={(e) => setRestaurantForm({ ...restaurantForm, map_latitude: e.target.value })}
                          className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                          placeholder="51.5074"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#a39783] block mb-1">Longitude (for display)</label>
                        <input
                          type="text"
                          value={restaurantForm.map_longitude || ''}
                          onChange={(e) => setRestaurantForm({ ...restaurantForm, map_longitude: e.target.value })}
                          className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                          placeholder="-0.1278"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-xs font-semibold text-[#a39783] block mb-1">Google Maps Embed URL (Iframe src link)</label>
                      <input
                        type="text"
                        value={restaurantForm.map_embed_url || ''}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, map_embed_url: e.target.value })}
                        className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                        placeholder="https://www.google.com/maps/embed?pb=..."
                      />
                      <span className="text-[10px] text-[#a39783] block mt-1 leading-relaxed">
                        How to find: Go to Google Maps &rarr; search your venue &rarr; Click &quot;Share&quot; &rarr; Click &quot;Embed a map&quot; &rarr; copy only the URL within the <code className="text-[#c5a059] font-mono font-bold">src=&quot;...&quot;</code> attribute. Let empty to hide the interactive map iframe and display the beautifully styled card.
                      </span>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* TAB 7: SUPPORT CONCIERGE & GUEST TICKETS */}
            {activeTab === 'support' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl font-bold text-[#f8f5ee]">
                      Support Desk & Inquiries
                    </h2>
                    <p className="text-xs text-[#a39783] mt-1">
                      Manage guest relations, answer private dining queries, and reply to dietary arrangements.
                    </p>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="flex bg-[#12100d] border border-white/10 rounded-xl p-1 shrink-0 self-start">
                    {(['All', 'Pending', 'Replied'] as const).map((filter) => {
                      const count = filter === 'All' 
                        ? tickets.length 
                        : filter === 'Pending' 
                          ? tickets.filter(t => t.status === 'Pending').length 
                          : tickets.filter(t => t.status === 'Replied').length;
                      return (
                        <button
                          key={filter}
                          onClick={() => setTicketFilter(filter)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                            ticketFilter === filter
                              ? 'bg-[#c5a059] text-black font-bold'
                              : 'text-[#a39783] hover:text-white'
                          }`}
                        >
                          <span>{filter}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            ticketFilter === filter ? 'bg-black/15 text-black' : 'bg-white/5 text-[#a39783]'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {tickets.length === 0 ? (
                  <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-[#c5a059]/15">
                    <div className="w-14 h-14 rounded-full bg-white/5 text-[#a39783] flex items-center justify-center mx-auto">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#f8f5ee]">No Support Inquiries</h4>
                      <p className="text-xs text-[#a39783] max-w-sm mx-auto mt-1 font-light">
                        There are currently no support inquiries submitted by customers on the public contact form.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Tickets List - 5 Columns */}
                    <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {tickets
                        .filter(t => ticketFilter === 'All' || t.status === ticketFilter)
                        .map((ticket) => {
                          const isSelected = replyingTicketId === ticket.id;
                          return (
                            <button
                              key={ticket.id}
                              onClick={() => {
                                setReplyingTicketId(ticket.id);
                                setReplyText(ticket.admin_reply || '');
                              }}
                              className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2 ${
                                isSelected
                                  ? 'bg-[#181510] border-[#c5a059] shadow-xl'
                                  : 'bg-[#0d0c0a]/60 border border-white/5 hover:border-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="font-mono text-[10px] text-[#a39783] uppercase">
                                  {ticket.id.split('_').pop()}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                  ticket.status === 'Pending'
                                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                }`}>
                                  {ticket.status === 'Pending' ? 'Pending' : 'Replied'}
                                </span>
                              </div>

                              <div>
                                <h4 className="font-serif text-sm font-bold text-white truncate">
                                  {ticket.subject || 'General Inquiry'}
                                </h4>
                                <p className="text-[11px] text-[#a39783] truncate">
                                  {ticket.customer_name} &bull; {ticket.email}
                                </p>
                              </div>

                              <p className="text-xs text-[#a39783]/70 line-clamp-2 font-light italic">
                                &ldquo;{ticket.message}&rdquo;
                              </p>

                              <div className="flex justify-between items-center text-[9px] text-[#837660] mt-1 font-mono">
                                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                {ticket.replied_at && <span>Replied</span>}
                              </div>
                            </button>
                          );
                        })}

                      {tickets.filter(t => ticketFilter === 'All' || t.status === ticketFilter).length === 0 && (
                        <p className="text-xs text-[#a39783] text-center py-6 font-light">
                          No tickets match this filter.
                        </p>
                      )}
                    </div>

                    {/* Ticket Reply Detail Pane - 7 Columns */}
                    <div className="lg:col-span-7">
                      {replyingTicketId ? (() => {
                        const ticket = tickets.find(t => t.id === replyingTicketId);
                        if (!ticket) return null;
                        return (
                          <div className="glass-card rounded-2xl p-6 border border-[#c5a059]/30 space-y-6">
                            {/* Ticket Details */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                              <div>
                                <span className="text-[10px] font-mono uppercase text-[#c5a059]">Guest Ticket Details</span>
                                <h3 className="font-serif text-lg font-bold text-white">{ticket.subject || 'General Inquiry'}</h3>
                                <div className="text-xs text-[#a39783] mt-1 space-y-0.5">
                                  <p>Sender: <span className="text-white font-medium">{ticket.customer_name}</span> ({ticket.email})</p>
                                  {ticket.phone && <p>Phone: <span className="text-white font-medium">{ticket.phone}</span></p>}
                                  <p>Date: <span className="font-mono">{new Date(ticket.created_at).toLocaleString()}</span></p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                                <button
                                  onClick={() => handleDeleteTicket(ticket.id)}
                                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                  title="Delete Ticket"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Message Bubble */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-mono text-[#a39783] uppercase block">Inquiry Message</span>
                              <div className="p-4 rounded-xl bg-[#181510] border border-white/5 relative">
                                <p className="text-xs text-[#f8f5ee] whitespace-pre-wrap leading-relaxed font-light">
                                  {ticket.message}
                                </p>
                              </div>
                            </div>

                            {/* Response / Reply Box */}
                            <div className="space-y-4 pt-4 border-t border-white/10">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-[#c5a059] uppercase block font-bold">
                                  {ticket.status === 'Replied' ? 'Update Reply Response' : 'Draft Official Reply'}
                                </span>
                                <span className="text-[10px] text-[#a39783] italic">Replies sent directly as official guest correspondence</span>
                              </div>

                              {/* Easy reply presets */}
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => setReplyText(`Dear ${ticket.customer_name},\n\nThank you for contacting Aurelia Mayfair. We would be delighted to assist you with your request. Our dining salon concierge will check details and follow up with you shortly.\n\nWarm regards,\nAurelia Guest Services`)}
                                  className="px-2.5 py-1 rounded bg-[#181510] border border-white/10 text-[10px] text-[#a39783] hover:text-[#c5a059] hover:border-[#c5a059] transition-colors"
                                >
                                  ✍️ Standard Acknowledgment
                                </button>
                                <button
                                  onClick={() => setReplyText(`Dear ${ticket.customer_name},\n\nThank you for choosing Aurelia. Regarding your dietary concern, our Chef de Cuisine ensures all dishes are prepared with extreme care. We have made a permanent note of your dietary preferences on your VIP file.\n\nKind regards,\nAurelia Culinary Team`)}
                                  className="px-2.5 py-1 rounded bg-[#181510] border border-white/10 text-[10px] text-[#a39783] hover:text-[#c5a059] hover:border-[#c5a059] transition-colors"
                                >
                                  🥦 Dietary Confirmation
                                </button>
                                <button
                                  onClick={() => setReplyText(`Dear ${ticket.customer_name},\n\nThank you for inquiring about private events. We offer bespoke culinary experiences in our private salon. I have attached our seasonal banquet catalog. Please let us know your preferred dates.\n\nWarmest regards,\nAurelia Event Concierge`)}
                                  className="px-2.5 py-1 rounded bg-[#181510] border border-white/10 text-[10px] text-[#a39783] hover:text-[#c5a059] hover:border-[#c5a059] transition-colors"
                                >
                                  🥂 Private Event Booking
                                </button>
                              </div>

                              <textarea
                                rows={6}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="w-full bg-[#181510] border border-white/10 focus:border-[#c5a059]/60 transition-all rounded-xl p-4 text-xs text-white resize-none"
                                placeholder={`Type your email reply to ${ticket.customer_name} here...`}
                              />

                              <div className="flex items-center justify-between">
                                <div className="text-[10px] text-[#a39783]">
                                  {ticket.replied_at && (
                                    <span>Last replied on: <strong className="font-mono text-[#c5a059]">{new Date(ticket.replied_at).toLocaleString()}</strong></span>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleReplyTicket(ticket.id)}
                                  className="px-5 py-2 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase flex items-center gap-2 tracking-wider"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>{ticket.status === 'Replied' ? 'Update Reply' : 'Send & Save Reply'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })() : (
                        <div className="glass-card rounded-2xl p-12 text-center border border-white/5 space-y-3">
                          <div className="w-12 h-12 rounded-full bg-white/5 text-[#a39783] flex items-center justify-center mx-auto">
                            <Eye className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">Select an Inquiry</h4>
                            <p className="text-xs text-[#a39783] max-w-xs mx-auto mt-1 font-light">
                              Click on any customer ticket on the left to read full details and reply instantly.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#12100d] border border-[#c5a059]/40 rounded-3xl p-6 max-w-md w-full z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-[#c5a059]">
                <KeyRound className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-[#f8f5ee]">Change Admin Password</h3>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordError && (
              <div className="p-3 bg-red-950/50 border border-red-500/30 text-red-200 text-xs rounded-xl text-center">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-xs rounded-xl text-center">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="text-[#c5a059] block mb-1 font-semibold">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#c5a059] block mb-1 font-semibold">New Password (min. 6 characters)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-[#181510] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] font-bold uppercase transition-all hover:opacity-95 disabled:opacity-50"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
