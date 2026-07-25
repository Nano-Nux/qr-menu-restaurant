'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import RestaurantStory from '@/components/RestaurantStory';
import FeaturedDishes from '@/components/FeaturedDishes';
import DigitalMenu from '@/components/DigitalMenu';
import FoodDetailModal from '@/components/FoodDetailModal';
import PromotionsSection from '@/components/PromotionsSection';
import GallerySection from '@/components/GallerySection';
import ReviewsSection from '@/components/ReviewsSection';
import TableOrderDrawer from '@/components/TableOrderDrawer';
import CallServerModal from '@/components/CallServerModal';
import ReservationModal from '@/components/ReservationModal';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [tableNumber, setTableNumber] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('table');
    }
    return null;
  });

  // Data states
  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Interactive UI Modals & Drawers
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [tableOrder, setTableOrder] = useState<any[]>([]);
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [callServerOpen, setCallServerOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [reservationSpecialNote, setReservationSpecialNote] = useState('');

  const handleOpenReservation = (specialNote?: string) => {
    if (specialNote) {
      setReservationSpecialNote(specialNote);
    } else {
      setReservationSpecialNote('');
    }
    setReservationOpen(true);
  };

  // Fetch all database content on load
  const fetchData = async () => {
    try {
      const [rRes, mRes, pRes, gRes, revRes] = await Promise.all([
        fetch('/api/restaurant').then((r) => r.json()),
        fetch('/api/menu').then((r) => r.json()),
        fetch('/api/promotions').then((r) => r.json()),
        fetch('/api/gallery').then((r) => r.json()),
        fetch('/api/reviews').then((r) => r.json())
      ]);

      if (rRes.data) setRestaurant(rRes.data);
      if (mRes.categories) setCategories(mRes.categories);
      if (mRes.items) setMenuItems(mRes.items);
      if (pRes.promotions) setPromotions(pRes.promotions);
      if (gRes.gallery) setGallery(gRes.gallery);
      if (revRes.reviews) setReviews(revRes.reviews);
    } catch (err) {
      console.error('Failed to load restaurant data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [rRes, mRes, pRes, gRes, revRes] = await Promise.all([
          fetch('/api/restaurant').then((r) => r.json()),
          fetch('/api/menu').then((r) => r.json()),
          fetch('/api/promotions').then((r) => r.json()),
          fetch('/api/gallery').then((r) => r.json()),
          fetch('/api/reviews').then((r) => r.json())
        ]);

        if (active) {
          if (rRes.data) setRestaurant(rRes.data);
          if (mRes.categories) setCategories(mRes.categories);
          if (mRes.items) setMenuItems(mRes.items);
          if (pRes.promotions) setPromotions(pRes.promotions);
          if (gRes.gallery) setGallery(gRes.gallery);
          if (revRes.reviews) setReviews(revRes.reviews);
        }
      } catch (err) {
        console.error('Failed to load restaurant data:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  // Table Order / Wishlist Session Actions
  const handleAddToOrder = (item: any, quantity: number = 1, notes: string = '') => {
    setTableOrder((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === item.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity = (updated[existingIdx].quantity || 1) + quantity;
        if (notes) updated[existingIdx].notes = notes;
        return updated;
      } else {
        return [...prev, { ...item, quantity, notes }];
      }
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setTableOrder((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = (item.quantity || 1) + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (id: string) => {
    setTableOrder((prev) => prev.filter((item) => item.id !== id));
  };

  const handleScrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0c0b09] text-[#f4efe6] selection:bg-[#c5a059]/30 selection:text-[#f8f5ee] relative">
      
      {/* Navigation Header */}
      <Navbar
        tableNumber={tableNumber}
        orderCount={tableOrder.reduce((acc, curr) => acc + (curr.quantity || 1), 0)}
        onOpenOrderDrawer={() => setOrderDrawerOpen(true)}
        onOpenCallServer={() => setCallServerOpen(true)}
        onOpenReservation={() => handleOpenReservation()}
        restaurantInfo={restaurant}
      />

      {/* Hero Section */}
      <Hero
        restaurantInfo={restaurant}
        tableNumber={tableNumber}
        onExploreMenu={handleScrollToMenu}
        onReserveTable={() => handleOpenReservation()}
      />

      {/* Culinary Story */}
      <RestaurantStory restaurantInfo={restaurant} />

      {/* Signature Dishes */}
      <FeaturedDishes
        items={menuItems}
        onSelectItem={(item) => setSelectedItem(item)}
        onAddToOrder={(item) => handleAddToOrder(item, 1)}
      />

      {/* Digital QR Menu */}
      <DigitalMenu
        categories={categories}
        items={menuItems}
        onSelectItem={(item) => setSelectedItem(item)}
        onAddToOrder={(item) => handleAddToOrder(item, 1)}
        orderItemIds={tableOrder.map((i) => i.id)}
      />

      {/* Seasonal Promotions & Tasting Menus */}
      <PromotionsSection
        promotions={promotions}
        onOpenReservation={handleOpenReservation}
      />

      {/* Gallery & Ambiance */}
      <GallerySection gallery={gallery} />

      {/* Diner Testimonials & Reviews */}
      <ReviewsSection
        reviews={reviews}
        onReviewSubmitted={fetchData}
      />

      {/* Location & Coordinates */}
      <ContactSection restaurantInfo={restaurant} />

      {/* Footer */}
      <Footer restaurantInfo={restaurant} />

      {/* Modals & Drawers */}
      <FoodDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToOrder={handleAddToOrder}
        isInOrder={selectedItem ? tableOrder.some((i) => i.id === selectedItem.id) : false}
      />

      <TableOrderDrawer
        isOpen={orderDrawerOpen}
        onClose={() => setOrderDrawerOpen(false)}
        orderItems={tableOrder}
        tableNumber={tableNumber}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearOrder={() => setTableOrder([])}
      />

      <CallServerModal
        isOpen={callServerOpen}
        onClose={() => setCallServerOpen(false)}
        tableNumber={tableNumber}
      />

      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
        initialSpecialRequest={reservationSpecialNote}
      />

    </div>
  );
}
