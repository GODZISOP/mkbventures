import React, { useState, useEffect } from 'react';
import { 
  Phone, Mail, MapPin, Search, ArrowRight, CheckCircle2, 
  Send, ExternalLink, ShieldCheck, Truck, Award,
  X, MessageSquare, Layers, Building2, ShoppingCart, Menu as MenuIcon,
  Plus, Minus, Trash2, ShoppingBag, Eye, ArrowLeft, Check,
  LayoutGrid, Sparkles, ChevronDown, Package, Star
} from 'lucide-react';
import { categories, products } from './data/products';
import { siteConfig } from './data/siteConfig';
import logoImg from './images/mkb-logo.svg';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [modalType, setModalType] = useState(null); // 'partner', 'quote', 'supplier', 'checkout', null
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Cart & Product Detail state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('mkb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(products[0]);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [activeDetailTab, setActiveDetailTab] = useState('description');
  const [toastMessage, setToastMessage] = useState(null);

  // Apply theme & document title from siteConfig
  useEffect(() => {
    if (siteConfig.theme) {
      const root = document.documentElement;
      if (siteConfig.theme.primaryNavy) root.style.setProperty('--primary-navy', siteConfig.theme.primaryNavy);
      if (siteConfig.theme.secondaryTeal) root.style.setProperty('--secondary-teal', siteConfig.theme.secondaryTeal);
      if (siteConfig.theme.accentTeal) root.style.setProperty('--accent-teal', siteConfig.theme.accentTeal);
      if (siteConfig.theme.accentHover) root.style.setProperty('--accent-teal-hover', siteConfig.theme.accentHover);
    }
    if (siteConfig.companyName) {
      document.title = siteConfig.companyName + (siteConfig.tagline ? ' | ' + siteConfig.tagline : '');
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mkb_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Filter & sort products
  const filteredProducts = products.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.priceNumeric - b.priceNumeric;
    if (sortBy === 'price-high') return b.priceNumeric - a.priceNumeric;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'latest') return b.id - a.id;
    return 0;
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (product, qty = 1, openDrawer = true) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`Added ${qty}x ${product.name} to cart!`);
    if (openDrawer) {
      setCartOpen(true);
    }
  };

  const updateCartQuantity = (productId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.priceNumeric * item.quantity), 0);

  const viewProductDetail = (product) => {
    setActiveProduct(product);
    setDetailQuantity(1);
    setActiveDetailTab('description');
    setActiveTab('product-detail');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuote = (product) => {
    setSelectedProduct(product);
    setModalType('quote');
    setFormSubmitted(false);
  };

  const handleOpenPartner = (type = 'partner') => {
    setModalType(type);
    setFormSubmitted(false);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedProduct(null);
    setFormSubmitted(false);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setTimeout(() => setNewsletterSuccess(false), 4000);
      setNewsletterEmail('');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const navigateTo = (tabName, categoryId = null) => {
    if (tabName === 'contact') {
      setActiveTab('home');
      setMobileMenuOpen(false);
      setTimeout(() => {
        const el = document.getElementById('contact-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    setActiveTab(tabName);
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    if (activeTab !== 'home') {
      setActiveTab('home');
    }
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('featured-products-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-[#1e293b]">
      {/* 2-TIER MODERN STICKY HEADER */}
      <header className="site-header">
        {/* UPPER TIER: MAIN NAVIGATION */}
        <div className="main-nav">
          <div className="nav-brand" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
            <img src={siteConfig.logo || logoImg} alt={`${siteConfig.companyName} Logo`} className="brand-logo-img" />
            <div>
              <div className="brand-title">{siteConfig.companyName}</div>
              <div className="brand-subtitle">{siteConfig.tagline}</div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              <li>
                <button 
                  className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                  onClick={() => navigateTo('home')}
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${activeTab === 'shop' ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory('all'); navigateTo('shop'); }}
                >
                  Shop All
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                  onClick={() => navigateTo('about')}
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${activeTab === 'business' ? 'active' : ''}`}
                  onClick={() => navigateTo('business')}
                >
                  Our Services
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${activeTab === 'partnerships' ? 'active' : ''}`}
                  onClick={() => navigateTo('partnerships')}
                >
                  Wholesale Partnerships
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${activeTab === 'supplier' ? 'active' : ''}`}
                  onClick={() => navigateTo('supplier')}
                >
                  Supplier Inquiries
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                  onClick={() => navigateTo('contact')}
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </nav>

          {/* Header Action Buttons */}
          <div className="nav-actions">
            <button 
              className="btn-nav-cart"
              onClick={() => setCartOpen(true)}
              aria-label="Open Shopping Cart"
            >
              <ShoppingCart size={18} />
              <span className="nav-cart-text">Cart</span>
              {totalCartItems > 0 && (
                <span className="nav-cart-badge">{totalCartItems}</span>
              )}
            </button>

            <button 
              className="btn-nav-partner"
              onClick={() => handleOpenPartner('partner')}
            >
              <span>Partner Today</span>
              <ArrowRight size={16} />
            </button>

            <button 
              className={`mobile-toggle-btn ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>

        {/* LOWER TIER: THE BLUE LINE (PRODUCTS & CATEGORIES BAR) */}
        <div className="products-blue-bar">
          <div className="blue-bar-content">
            {/* All Products master pill */}
            <div className="blue-bar-categories">
              <button 
                className={`blue-cat-btn all-cat-btn ${(activeTab === 'shop' || activeTab === 'home') && selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory('all');
                  navigateTo('shop');
                }}
              >
                <LayoutGrid size={15} />
                <span>All Products</span>
                <span className="blue-count-pill">{products.length}</span>
              </button>

              <div className="blue-bar-divider"></div>

              {/* Individual Product Categories in the Blue Line */}
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id && activeTab === 'home';
                return (
                  <button
                    key={cat.id}
                    className={`blue-cat-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Right side quick contact & direct trading desk info */}
            <div className="blue-bar-perks">
              <span className="blue-perk-item">
                <Truck size={14} />
                <span>Fast Global Dispatch</span>
              </span>
              <span className="blue-perk-divider">•</span>
              <a href={`tel:${siteConfig.phonePrimaryTel}`} className="blue-perk-phone">
                <Phone size={13} />
                <span>{siteConfig.phonePrimary}</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU ACCORDION / DRAWER */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="mobile-drawer-brand">
                <img src={siteConfig.logo || logoImg} alt="Logo" className="mobile-drawer-logo" />
                <div>
                  <div className="mobile-drawer-title">{siteConfig.companyName}</div>
                  <div className="mobile-drawer-subtitle">{siteConfig.tagline}</div>
                </div>
              </div>
              <button 
                className="mobile-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Navigation Menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-section">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCartOpen(true);
                }}
                className="mobile-cart-btn"
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart size={18} />
                  <span>Shopping Cart</span>
                </span>
                <span className="nav-cart-badge">{totalCartItems}</span>
              </button>
            </div>

            <div className="mobile-drawer-section">
              <div className="mobile-section-label">Navigation</div>
              {[
                { key: 'home', label: 'Home' },
                { key: 'about', label: 'About Us' },
                { key: 'business', label: 'Our Services' },
                { key: 'partnerships', label: 'Wholesale Partnerships' },
                { key: 'supplier', label: 'Supplier Inquiries' },
                { key: 'contact', label: 'Contact Us' }
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => navigateTo(item.key)}
                  className={`mobile-nav-link ${activeTab === item.key ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mobile-drawer-section">
              <div className="mobile-section-label">Product Categories</div>
              <button
                onClick={() => handleCategoryClick('all')}
                className={`mobile-nav-link ${selectedCategory === 'all' && activeTab === 'home' ? 'active' : ''}`}
              >
                <LayoutGrid size={16} />
                <span>All Products ({products.length})</span>
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`mobile-nav-link ${selectedCategory === cat.id && activeTab === 'home' ? 'active' : ''}`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            <div className="mobile-drawer-footer">
              <button 
                className="btn-hero-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenPartner('partner');
                }}
              >
                Partner Today
              </button>
              <div className="mobile-drawer-contact">
                <a href={`tel:${siteConfig.phonePrimaryTel}`} className="mobile-contact-link">
                  <Phone size={14} />
                  <span>{siteConfig.phonePrimary}</span>
                </a>
                <a href={`mailto:${siteConfig.email}`} className="mobile-contact-link">
                  <Mail size={14} />
                  <span>{siteConfig.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: HOME PAGE */}
      {activeTab === 'home' && (
        <main>
          {/* HERO SECTION - SHOP WITH DISTINCTION */}
          <section className="hero-section">
            <div className="hero-overlay"></div>
            <div className="hero-container">
              <div className="hero-content">
                <div className="hero-pretitle">{siteConfig.legalName}</div>
                <h1 className="hero-title">Quality Products Online</h1>
                <p className="hero-description">
                  {siteConfig.heroSubtitle}
                </p>
                <div className="hero-actions">
                  <button 
                    className="btn-hero-primary"
                    onClick={() => {
                      const el = document.getElementById('featured-products-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Shop Now
                  </button>
                  <button 
                    className="btn-hero-outline"
                    onClick={() => {
                      const el = document.getElementById('categories-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Explore Categories
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 1: SHOP EVERYDAY ESSENTIALS (EXACT SCREENSHOT LAYOUT) */}
          <section id="categories-section" className="section-wrapper essentials-section">
            <div className="section-header-left">
              <h2 className="section-heading-clean">Shop Everyday Essentials</h2>
            </div>

            <div className="categories-grid-four">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="category-card-clean"
                  onClick={() => {
                    if (cat.link) {
                      window.open(cat.link, '_blank', 'noopener,noreferrer');
                    } else {
                      handleCategoryClick(cat.id);
                    }
                  }}
                >
                  <div className="category-img-container">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="category-img-clean" 
                      loading="lazy"
                    />
                  </div>
                  <div className="category-meta-clean">
                    <h3 className="category-name-clean">{cat.name}</h3>
                    <a 
                      href={cat.link || '#'}
                      target={cat.link ? '_blank' : undefined}
                      rel={cat.link ? 'noopener noreferrer' : undefined}
                      className="category-link-clean"
                      onClick={(e) => {
                        if (!cat.link) {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCategoryClick(cat.id);
                        } else {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {cat.buttonText}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 2: FEATURED PRODUCTS (EXACT SCREENSHOT LAYOUT) */}
          <section id="featured-products-section" className="section-wrapper featured-section">
            <div className="section-header-center">
              <h2 className="section-heading-clean" style={{ textAlign: 'center' }}>Featured Products</h2>
            </div>

            <div className="featured-grid-four">
              {products.map((prod) => (
                <div key={prod.id} className="clean-product-card">
                  <div 
                    className="clean-product-img-wrap"
                    onClick={() => viewProductDetail(prod)}
                  >
                    <img src={prod.image} alt={prod.name} className="clean-product-img" loading="lazy" />
                  </div>
                  <div className="clean-product-body">
                    <h3 className="clean-product-title" onClick={() => viewProductDetail(prod)}>
                      {prod.name}
                    </h3>
                    <div className="clean-product-price">
                      {prod.price}
                    </div>
                    <button 
                      className="btn-clean-add-cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod, 1, true);
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Centered Shop All Products Pill Button */}
            <div className="shop-all-container">
              <button 
                className="btn-shop-all-pill"
                onClick={() => {
                  setSelectedCategory('all');
                  const el = document.getElementById('featured-products-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Shop All Products
              </button>
            </div>
          </section>

          {/* THE MKB VENTURES DISTINCTION EXPERIENCE (BENTO SHOWPIECE) */}
          <section className="hf-experience-section">
            <div className="section-wrapper">
              <div className="section-header-center">
                <span className="hf-eyebrow-badge">{siteConfig.eyebrowStandard}</span>
                <h2 className="section-heading-clean" style={{ textAlign: 'center', marginTop: '10px' }}>
                  Crafted For Everyday Living, Backed By Quality Sourcing
                </h2>
                <p className="hf-section-subtitle">
                  We hand-select each collection for practical elegance, enduring durability, and dependable quality.
                </p>
              </div>

              {/* Bento Grid */}
              <div className="hf-bento-grid">
                {/* Bento Card 1: Large Editorial Hero */}
                <div className="hf-bento-card hf-bento-hero">
                  <div className="hf-bento-img-wrap">
                    <img 
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" 
                      alt="Curated Modern Living" 
                      className="hf-bento-img" 
                      loading="lazy" 
                    />
                    <div className="hf-bento-overlay"></div>
                  </div>
                  <div className="hf-bento-hero-content">
                    <span className="hf-gold-pill">AUTHENTIC CURATION</span>
                    <h3 className="hf-bento-hero-title">Direct Workshop Sourcing</h3>
                    <p className="hf-bento-hero-desc">
                      Every piece is procured directly from certified suppliers and precision manufacturers, guaranteeing authentic materials and transparent pricing.
                    </p>
                  </div>
                </div>

                {/* Bento Card 2: Priority Express Dispatch */}
                <div className="hf-bento-card hf-bento-feature">
                  <div className="hf-bento-icon-box">
                    <Truck size={24} color="#c59b3f" />
                  </div>
                  <h3 className="hf-bento-feature-title">Insured Express Dispatch</h3>
                  <p className="hf-bento-feature-desc">
                    Every order is individually inspected, protective-foam boxed, and dispatched with live tracking to ensure pristine doorstep arrival.
                  </p>
                  <div className="hf-bento-stat">
                    <strong>24 - 48h</strong>
                    <span>Fast regional dispatch</span>
                  </div>
                </div>

                {/* Bento Card 3: Quality Guarantee */}
                <div className="hf-bento-card hf-bento-feature">
                  <div className="hf-bento-icon-box">
                    <ShieldCheck size={24} color="#c59b3f" />
                  </div>
                  <h3 className="hf-bento-feature-title">100% Quality Guaranteed</h3>
                  <p className="hf-bento-feature-desc">
                    From automotive tools to skincare and gourmet foods, our products undergo rigorous QC before reaching our catalog.
                  </p>
                  <div className="hf-bento-stat">
                    <strong>1-Year</strong>
                    <span>Manufacturer warranty support</span>
                  </div>
                </div>

                {/* Bento Card 4: Executive Customer Desk */}
                <div className="hf-bento-card hf-bento-feature hf-bento-wide">
                  <div className="hf-bento-icon-box">
                    <Phone size={24} color="#c59b3f" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 className="hf-bento-feature-title">Direct Concierge & Trade Desk</h3>
                    <p className="hf-bento-feature-desc">
                      Have questions or require wholesale quantity quotes? Connect directly with our executive trade team via WhatsApp or phone.
                    </p>
                  </div>
                  <a 
                    href="https://wa.me/${siteConfig.whatsappNumber}" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hf-btn-whatsapp-pill"
                  >
                    <span>WhatsApp {siteConfig.phoneDirect}</span>
                  </a>
                </div>
              </div>

              {/* CLIENT TESTIMONIALS STRIP */}
              <div className="hf-testimonials-wrap">
                <div className="hf-testimonials-header">
                  <span className="hf-gold-pill">VERIFIED EXPERIENCES</span>
                  <h3 className="hf-testimonials-title">Trusted By Discerning Customers & Retailers</h3>
                </div>

                <div className="hf-testimonials-grid">
                  <div className="hf-testimonial-card">
                    <div className="hf-stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill="#c59b3f" color="#c59b3f" />
                      ))}
                    </div>
                    <p className="hf-testimonial-quote">
                      "The Automotive Essentials kit is comprehensive, heavy-duty, and arrived promptly. Exactly what our fleet needed."
                    </p>
                    <div className="hf-testimonial-author">
                      <strong>Adil Al-Ghamdi</strong>
                      <span>Verified Buyer • Riyadh, KSA</span>
                    </div>
                  </div>

                  <div className="hf-testimonial-card">
                    <div className="hf-stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill="#c59b3f" color="#c59b3f" />
                      ))}
                    </div>
                    <p className="hf-testimonial-quote">
                      "The Home and Everyday Finds collection added great utility and modern aesthetic to our home. Packaging was rock solid with zero transit wear."
                    </p>
                    <div className="hf-testimonial-author">
                      <strong>Amina Tariq</strong>
                      <span>Verified Customer</span>
                    </div>
                  </div>

                  <div className="hf-testimonial-card">
                    <div className="hf-stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill="#c59b3f" color="#c59b3f" />
                      ))}
                    </div>
                    <p className="hf-testimonial-quote">
                      "{siteConfig.testimonial.quote}"
                    </p>
                    <div className="hf-testimonial-author">
                      <strong>Kamran Malik</strong>
                      <span>Retail Wholesale Partner</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* VIP COMMERCIAL & INQUIRY BANNER */}
              <div className="hf-vip-banner">
                <div className="hf-vip-content">
                  <span className="hf-vip-badge">DIRECT COMMERCIAL DESK</span>
                  <h3 className="hf-vip-title">Looking For Custom Orders or Wholesale Partnerships?</h3>
                  <p className="hf-vip-desc">
                    Whether procuring for retail chains, corporate gifting, or individual bespoke orders, our trade desk delivers tailored solutions.
                  </p>
                </div>
                <div className="hf-vip-actions">
                  <a 
                    href="https://wa.me/${siteConfig.whatsappNumber}" 
                    target="_blank" 
                    rel="noreferrer"
                    className="hf-vip-btn-gold"
                  >
                    <span>Instant WhatsApp Chat</span>
                  </a>
                  <a 
                    href={`mailto:${siteConfig.email}`}
                    className="hf-vip-btn-outline"
                  >
                    <span>Email {siteConfig.email}</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: CONTACT MKB VENTURES GLOBAL LLC (ON HOME PAGE) */}
          <section id="contact-section" className="section-wrapper" style={{ padding: '60px 24px 70px' }}>
            <div style={{ maxWidth: '980px', margin: '0 auto' }}>
              <div className="section-header-center">
                <span className="hf-eyebrow-badge">GET IN TOUCH</span>
                <h2 className="section-heading-clean" style={{ textAlign: 'center', marginTop: '10px' }}>
                  Contact {siteConfig.companyName}
                </h2>
                <p className="hf-section-subtitle">
                  We are at your service for catalog requests, wholesale bulk pricing, partnership discussions, or general inquiries.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '32px', marginTop: '40px' }} className="contact-grid-responsive">
                <div style={{ background: '#241b14', color: '#fff', padding: '36px', borderRadius: '20px', border: '1px solid rgba(140, 95, 36, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '20px', color: '#f5efe6' }}>Direct Coordinates</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.95rem' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <Mail size={20} color="#c59b3f" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div>
                          <div style={{ color: '#b8aba0', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</div>
                          <a href={`mailto:${siteConfig.email}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>
                            {siteConfig.email}
                          </a>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <Phone size={20} color="#c59b3f" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div>
                          <div style={{ color: '#b8aba0', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</div>
                          <div>Direct: <a href={`tel:${siteConfig.phoneDirectTel}`} style={{ color: '#fff', textDecoration: 'none' }}>{siteConfig.phoneDirect}</a></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <MapPin size={20} color="#c59b3f" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div>
                          <div style={{ color: '#b8aba0', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Official Registered Address</div>
                          <div style={{ color: '#fff', fontWeight: '600' }}>{siteConfig.address.line1}</div>
                          <div style={{ color: '#cbd5e1' }}>{siteConfig.address.line2}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <MessageSquare size={20} color="#25d366" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div>
                          <div style={{ color: '#b8aba0', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>WhatsApp Direct</div>
                          <a 
                            href="https://wa.me/${siteConfig.whatsappNumber}" 
                            target="_blank" 
                            rel="noreferrer"
                            style={{ color: '#25d366', fontWeight: '700', textDecoration: 'none' }}
                          >
                            {siteConfig.phoneDirect} (Instant)
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', color: '#b8aba0' }}>
                    Managed by <strong>{siteConfig.companyName}</strong> • USA & Global Distribution
                  </div>
                </div>

                <div style={{ background: '#fff', padding: '36px', borderRadius: '20px', border: '1px solid #eae2d6', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '18px', color: '#241b14', fontWeight: '700' }}>Send Us a Message</h3>
                  <form onSubmit={handleFormSubmit} className="modal-form">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input type="text" required placeholder="Your name" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input type="email" required placeholder="your.email@example.com" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input type="text" placeholder="Wholesale Inquiry / Catalog / Order" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message *</label>
                      <textarea rows={4} placeholder="How can we assist you today?" required className="form-textarea"></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="btn-submit-modal"
                      style={{ background: 'linear-gradient(135deg, #a67635 0%, #8c5f24 100%)', color: '#fff', fontWeight: '700' }}
                    >
                      Send Message
                    </button>
                  </form>

                  {formSubmitted && (
                    <div style={{ marginTop: '16px', padding: '12px', background: '#ecfdf5', color: '#065f46', borderRadius: '8px', fontSize: '0.9rem' }}>
                      ✓ Thank you! Your message has been received by {siteConfig.companyName}. We will reply within 24 hours.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* VIEW: PRODUCT DETAIL PAGE */}
      {activeTab === 'product-detail' && activeProduct && (
        <div className="product-detail-page">
          <div className="detail-container">
            
            {/* Top Breadcrumbs & Back Button */}
            <div className="detail-top-nav">
              <button 
                className="btn-back-catalog" 
                onClick={() => navigateTo('home')}
              >
                <ArrowLeft size={16} />
                <span>Back to Wholesale Catalog</span>
              </button>
              <div className="detail-breadcrumbs">
                <span onClick={() => navigateTo('home')} className="crumb-link">Home</span>
                <span className="crumb-sep">/</span>
                <span 
                  onClick={() => { setSelectedCategory(activeProduct.category); navigateTo('home'); }} 
                  className="crumb-link"
                >
                  {activeProduct.categoryName}
                </span>
                <span className="crumb-sep">/</span>
                <span className="crumb-current">{activeProduct.name}</span>
              </div>
            </div>

            {/* Main Product Showcase Grid */}
            <div className="detail-showcase-grid">
              
              {/* Left Column: Visual Showcase & Quality Badges */}
              <div className="detail-gallery-col">
                <div className="detail-img-card">
                  <img 
                    src={activeProduct.image} 
                    alt={activeProduct.name} 
                    className="detail-hero-img" 
                  />
                  <div className="detail-badge-float">{activeProduct.categoryName}</div>
                  <div className="detail-verified-badge">
                    <ShieldCheck size={16} />
                    <span>100% Genuine Wholesale Batch</span>
                  </div>
                </div>

                {/* Quality & Assurance Badges */}
                <div className="detail-assurance-strip">
                  <div className="assurance-item">
                    <Truck size={18} className="assurance-icon" />
                    <div>
                      <strong>Fast B2B Dispatch</strong>
                      <span>{siteConfig.hubs.originText}</span>
                    </div>
                  </div>
                  <div className="assurance-item">
                    <Award size={18} className="assurance-icon" />
                    <div>
                      <strong>Quality Inspected</strong>
                      <span>Verified under {siteConfig.companyName} management</span>
                    </div>
                  </div>
                  <div className="assurance-item">
                    <Building2 size={18} className="assurance-icon" />
                    <div>
                      <strong>Wyoming LLC Registered</strong>
                      <span>Official Corporate Wholesale Entity #68445</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Commercial Product Information & Add to Cart */}
              <div className="detail-info-col">
                <div className="detail-meta-row">
                  <span className="detail-sku-badge">SKU: {activeProduct.sku}</span>
                  <span className="detail-stock-badge">
                    <span className="stock-pulsing-dot"></span>
                    {activeProduct.availability} ({activeProduct.stockUnits?.toLocaleString() || '1,000+'} units available)
                  </span>
                </div>

                <h1 className="detail-product-title">{activeProduct.name}</h1>

                <div className="detail-reviews-row">
                  <div className="star-rating">★★★★★</div>
                  <span className="rating-score">{activeProduct.rating}</span>
                  <span className="review-count">({activeProduct.reviewCount || 35} verified B2B partner reviews)</span>
                </div>

                <div className="detail-price-panel">
                  <div className="detail-price-row">
                    <div className="detail-unit-price">
                      <span className="price-currency">{activeProduct.price}</span>
                      <span className="price-per">/ unit</span>
                    </div>
                    <div className="detail-price-note">
                      <span className="tax-tag">Wholesale Net</span>
                      <span>{activeProduct.priceNote}</span>
                    </div>
                  </div>
                  <div className="detail-moq-row">
                    <span>Minimum Wholesale Order (MOQ):</span>
                    <strong>{activeProduct.minOrder}</strong>
                  </div>
                </div>

                {/* Wholesale Volume Tier Table */}
                {activeProduct.tiers && activeProduct.tiers.length > 0 && (
                  <div className="wholesale-tiers-box">
                    <div className="tiers-title">Wholesale Volume Pricing Tiers:</div>
                    <div className="tiers-grid">
                      {activeProduct.tiers.map((tier, idx) => (
                        <div key={idx} className="tier-card">
                          <div className="tier-qty">{tier.range}</div>
                          <div className="tier-price">{tier.price} <small>/ unit</small></div>
                          <div className="tier-discount">{tier.discount}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="detail-lead-summary">{activeProduct.description}</p>

                {/* Key Features Bullet Points */}
                {activeProduct.features && (
                  <div className="detail-features-box">
                    <h3 className="features-title">Product Highlights:</h3>
                    <ul className="features-list">
                      {activeProduct.features.map((feat, idx) => (
                        <li key={idx}>
                          <Check size={16} className="feature-check" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Purchase & Cart Actions */}
                <div className="detail-purchase-panel">
                  <div className="qty-row">
                    <label className="qty-label">Wholesale Quantity:</label>
                    <div className="qty-stepper">
                      <button 
                        type="button" 
                        className="stepper-btn"
                        onClick={() => setDetailQuantity(q => Math.max(1, q - 1))}
                      >
                        <Minus size={16} />
                      </button>
                      <input 
                        type="number" 
                        min="1" 
                        value={detailQuantity} 
                        onChange={(e) => setDetailQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="stepper-input"
                      />
                      <button 
                        type="button" 
                        className="stepper-btn"
                        onClick={() => setDetailQuantity(q => q + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="subtotal-preview">
                      Subtotal: <strong>{siteConfig.currencySymbol || "$"} {(activeProduct.priceNumeric * detailQuantity).toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="detail-actions-grid">
                    <button 
                      className="btn-detail-add-cart"
                      onClick={() => addToCart(activeProduct, detailQuantity, true)}
                    >
                      <ShoppingCart size={18} />
                      <span>Add to Cart ({detailQuantity} Units)</span>
                    </button>

                    <a 
                      href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(`Hello ${siteConfig.companyName}, I want to order ${detailQuantity}x ${activeProduct.name} (SKU: ${activeProduct.sku}, Total: ${siteConfig.currencySymbol || "$"}${(activeProduct.priceNumeric * detailQuantity).toLocaleString()}).`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-detail-whatsapp"
                    >
                      <MessageSquare size={18} />
                      <span>WhatsApp Direct Order</span>
                    </a>
                  </div>

                  <div className="detail-secondary-actions">
                    <button 
                      className="btn-detail-rfq"
                      onClick={() => handleOpenQuote(activeProduct)}
                    >
                      <span>Request Formal Wholesale Quote / Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Contact Help Strip */}
                <div className="detail-help-strip">
                  <span>Questions about bulk orders?</span>
                  <a href={`tel:${siteConfig.phonePrimaryTel}`} className="help-link">
                    <Phone size={14} /> {siteConfig.phonePrimary}
                  </a>
                  <span className="sep">•</span>
                  <a href={`mailto:${siteConfig.email}`} className="help-link">
                    <Mail size={14} /> {siteConfig.email}
                  </a>
                </div>

              </div>
            </div>

            {/* Tabbed Detailed Specifications */}
            <div className="detail-tabs-section">
              <div className="detail-tabs-header">
                <button 
                  className={`detail-tab-btn ${activeDetailTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveDetailTab('description')}
                >
                  Product Details & Overview
                </button>
                <button 
                  className={`detail-tab-btn ${activeDetailTab === 'specs' ? 'active' : ''}`}
                  onClick={() => setActiveDetailTab('specs')}
                >
                  Technical Specifications & Packaging
                </button>
                <button 
                  className={`detail-tab-btn ${activeDetailTab === 'shipping' ? 'active' : ''}`}
                  onClick={() => setActiveDetailTab('shipping')}
                >
                  Wholesale Logistics & Terms
                </button>
              </div>

              <div className="detail-tab-content">
                {activeDetailTab === 'description' && (
                  <div className="tab-pane">
                    <h3 className="tab-title">Product Description</h3>
                    <p className="tab-lead-text">{activeProduct.longDescription || activeProduct.description}</p>
                    <div className="tab-features-grid">
                      <div className="tab-feature-card">
                        <h4>Commercial Quality Standard</h4>
                        <p>Specially manufactured and selected for sustained commercial and retail performance, offering high durability and verified consumer satisfaction.</p>
                      </div>
                      <div className="tab-feature-card">
                        <h4>Packaging & Presentation</h4>
                        <p>All units come in shelf-ready retail packaging with standard barcoding, regulatory ingredient/material markings, and protective outer wrap.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeDetailTab === 'specs' && (
                  <div className="tab-pane">
                    <h3 className="tab-title">Technical Specifications & Dimensions</h3>
                    {activeProduct.specs && activeProduct.specs.length > 0 ? (
                      <table className="specs-table">
                        <tbody>
                          {activeProduct.specs.map((item, idx) => (
                            <tr key={idx}>
                              <td className="spec-label">{item.label}</td>
                              <td className="spec-value">{item.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>Standard export specifications apply. Contact our desk for complete COA / spec sheets.</p>
                    )}
                  </div>
                )}

                {activeDetailTab === 'shipping' && (
                  <div className="tab-pane">
                    <h3 className="tab-title">Wholesale Logistics & Dispatch Terms</h3>
                    <div className="shipping-info-grid">
                      <div className="ship-card">
                        <h4>Order Processing & Lead Time</h4>
                        <p>Orders are dispatched within 24 to 48 business hours upon confirmation. Tracking numbers and freight waybills are provided immediately.</p>
                      </div>
                      <div className="ship-card">
                        <h4>Shipping Hubs & Carriers</h4>
                        <p>{siteConfig.hubs.dispatchNote}</p>
                      </div>
                      <div className="ship-card">
                        <h4>Pallet & Container Loads</h4>
                        <p>Full Container Load (FCL) and Less than Container Load (LCL) consolidation available for cross-border wholesale buyers.</p>
                      </div>
                      <div className="ship-card">
                        <h4>Payment Methods</h4>
                        <p>We accept Wire Transfer (T/T), Commercial ACH, Letter of Credit (LC for qualifying volumes), and verified bank deposits.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Products Strip */}
            <div className="detail-related-section">
              <div className="related-header">
                <span className="section-tag">CATALOG ASSORTMENT</span>
                <h2 className="related-title">Other Products from {siteConfig.shortName}</h2>
              </div>

              <div className="products-grid">
                {products.filter(p => p.id !== activeProduct.id).map(prod => (
                  <div 
                    key={prod.id} 
                    className="product-card" 
                    onClick={() => viewProductDetail(prod)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="product-img-wrap">
                      <img src={prod.image} alt={prod.name} className="product-img" loading="lazy" />
                      <span className="product-badge">{prod.categoryName}</span>
                    </div>
                    <div className="product-body">
                      <div className="product-header-row">
                        <span className="product-sku">SKU: {prod.sku}</span>
                        <span className="stock-tag">● {prod.availability}</span>
                      </div>
                      <h3 className="product-title">
                        <button 
                          onClick={(e) => { e.stopPropagation(); viewProductDetail(prod); }}
                          className="product-title-btn"
                        >
                          {prod.name}
                        </button>
                      </h3>
                      <div className="product-price-box">
                        <span className="product-price-val">{prod.price}</span>
                        <span className="product-price-sub">Wholesale Tiered</span>
                      </div>
                      <p className="product-excerpt">{prod.description}</p>
                      <div className="product-actions-row">
                        <button 
                          className="btn-add-cart"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(prod, 1, true);
                          }}
                        >
                          <ShoppingCart size={15} />
                          <span>Add to cart</span>
                        </button>
                        <button 
                          className="btn-view-details"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewProductDetail(prod);
                          }}
                        >
                          <Eye size={15} />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW: ABOUT US */}
      {activeTab === 'about' && (
        <div className="section-wrapper" style={{ padding: '60px 24px' }}>
          <div style={{ maxWidth: '850px', margin: '0 auto', background: '#fff', padding: '48px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <span className="section-tag">COMPANY OVERVIEW</span>
            <h1 className="section-title" style={{ marginBottom: '20px' }}>About {siteConfig.companyName}</h1>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.8, marginBottom: '20px' }}>
              <strong>MKB VENTURES GLOBAL LLC</strong> operates from our registered headquarters at <strong>{siteConfig.address.full}</strong>. Our mission is to bridge the gap between quality manufacturers and consumers worldwide across Automotive Essentials, Baby Care, Personal Care, Grocery, and Home Living.
            </p>
            <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.8, marginBottom: '20px' }}>
              We pride ourselves on thoughtful sourcing — choosing products that deliver genuine performance, high customer satisfaction, and dependable quality for retail and wholesale partners worldwide.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', margin: '36px 0' }}>
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ color: '#102a3a', fontSize: '1.1rem', marginBottom: '8px' }}>Integrity First</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Transparent pricing, transparent communication, and verified product authenticity.</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ color: '#102a3a', fontSize: '1.1rem', marginBottom: '8px' }}>Logistics Agility</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Fast customs turnaround, reliable carrier contracts, and multi-hub fulfillment.</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ color: '#102a3a', fontSize: '1.1rem', marginBottom: '8px' }}>Partner Centric</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Dedicated trade managers ready to accommodate customer requirements and custom schedules.</p>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button className="btn-hero-primary" onClick={() => navigateTo('contact')}>
                Contact Management Desk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: OUR BUSINESS */}
      {activeTab === 'business' && (
        <div className="section-wrapper" style={{ padding: '60px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="section-header-center">
              <span className="section-tag">CAPABILITIES & OPERATIONS</span>
              <h1 className="section-title">Our Business Model</h1>
              <p style={{ color: '#64748b', maxWidth: '650px', margin: '12px auto 0' }}>
                Supplying verified retail and commercial sectors through streamlined supply chains and B2B excellence.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '40px' }}>
              <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#1e7087', marginBottom: '14px' }}><Layers size={36} /></div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Wholesale Distribution</h3>
                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Direct supply of Everyday Essentials, Personal Care, and Household products to retail chains, convenience stores, and e-commerce merchants.
                </p>
              </div>
              <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#1e7087', marginBottom: '14px' }}><Truck size={36} /></div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Import & Export</h3>
                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  International trade routes connecting high-demand markets with premier suppliers across North America, the Middle East, and Asia.
                </p>
              </div>
              <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#1e7087', marginBottom: '14px' }}><Building2 size={36} /></div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Commercial Procurement</h3>
                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Specialized contracts for offices, hotels, cleaning service companies, and institutional facilities requiring continuous recurring supplies.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '40px', background: '#102a3a', color: '#fff', padding: '36px', borderRadius: '20px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '12px' }}>Ready to Scale Your Inventory?</h2>
              <p style={{ color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 24px' }}>
                Let us build a customized supply plan tailored to your volume requirements and distribution schedule.
              </p>
              <button className="btn-hero-primary" onClick={() => handleOpenPartner('partner')}>
                Inquire For Wholesale Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: PRODUCT CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="section-wrapper" style={{ padding: '60px 24px' }}>
          <div className="section-header-center">
            <span className="section-tag">CATALOG OVERVIEW</span>
            <h1 className="section-title">All Product Categories</h1>
            <p style={{ color: '#64748b', maxWidth: '600px', margin: '10px auto 0' }}>
              Explore our core catalog sectors thoughtfully curated for reliable turnover and high quality.
            </p>
          </div>

          <div className="categories-grid" style={{ marginBottom: '50px' }}>
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="category-card"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  navigateTo('home');
                  setTimeout(() => {
                    const el = document.getElementById('featured-products-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                <img src={cat.image} alt={cat.name} className="category-card-img" />
                <div className="category-card-overlay">
                  <h3 className="category-title">{cat.name}</h3>
                  <p className="category-desc">{cat.description}</p>
                  <button className="btn-category-pill">
                    {cat.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: WHOLESALE PARTNERSHIPS */}
      {activeTab === 'partnerships' && (
        <div className="section-wrapper" style={{ padding: '60px 24px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <span className="section-tag">EXPAND WITH US</span>
            <h1 className="section-title" style={{ marginBottom: '16px' }}>Wholesale Partnerships</h1>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '24px' }}>
              Whether you are an independent supermarket, a chain retailer, or an online merchant, {siteConfig.legalName} provides flexible minimums, volume price tiers, and dependable fulfillment.
            </p>

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Contact Name *</label>
                  <input type="text" required placeholder="Your full name" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Company / Business Name *</label>
                  <input type="text" required placeholder="Business entity name" className="form-input" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input type="email" required placeholder="business@example.com" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input type="tel" required placeholder="(+966) / (+1) Phone" className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Business Type</label>
                <select className="form-select">
                  <option>Brick & Mortar Retailer</option>
                  <option>E-commerce / Marketplace Seller</option>
                  <option>Regional Distributor</option>
                  <option>Institutional / Facility Buyer</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Estimated Monthly Purchase Volume</label>
                <select className="form-select">
                  <option>$5,000 - $25,000</option>
                  <option>$25,000 - $100,000</option>
                  <option>$100,000+</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message & Products of Interest</label>
                <textarea rows={4} placeholder="Tell us which products and categories you are looking to purchase..." className="form-textarea" required></textarea>
              </div>
              <button type="submit" className="btn-submit-modal">
                Submit Wholesale Application
              </button>
            </form>

            {formSubmitted && (
              <div style={{ marginTop: '20px', padding: '16px', background: '#ecfdf5', color: '#065f46', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={24} color="#059669" />
                <div>
                  <strong>Application Submitted Successfully!</strong>
                  <p style={{ fontSize: '0.88rem' }}>Our wholesale accounts director from {siteConfig.companyName} will review your details and contact you shortly.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: SUPPLIER INQUIRIES (WITH EXACT TEXT PROVIDED BY USER) */}
      {activeTab === 'supplier' && (
        <div className="section-wrapper" style={{ padding: '60px 24px' }}>
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div className="section-header-center">
              <span className="section-tag">SUPPLIER INQUIRIES</span>
              <h1 className="section-title">Supplier Inquiries</h1>
              <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '680px', margin: '14px auto 0' }}>
                Tell us about your products and wholesale inquiry; our team will review your message.
              </p>
            </div>

            {/* Quick Contact Info Strip with exact address and phone */}
            <div style={{
              background: '#102a3a',
              color: '#ffffff',
              padding: '24px 30px',
              borderRadius: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={20} color="#38bdf8" />
                <a href={`mailto:${siteConfig.email}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>
                  {siteConfig.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={20} color="#38bdf8" />
                <a href={`tel:${siteConfig.phonePrimaryTel}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>
                  {siteConfig.phonePrimary}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={20} color="#38bdf8" />
                <span>{siteConfig.address.full}</span>
              </div>
            </div>

            <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '24px', borderLeft: '4px solid #1e7087', paddingLeft: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#102a3a', marginBottom: '8px' }}>Supplier Inquiries</h3>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  Tell us about your business and the products you’re looking to source. Share product details, brand information, and your preferred order quantities. Our team will review your inquiry and follow up about potential next steps.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="modal-form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Company / Factory Name *</label>
                    <input type="text" required placeholder="Manufacturing or trading entity" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Representative Name *</label>
                    <input type="text" required placeholder="Your name" className="form-input" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Direct Email *</label>
                    <input type="email" required placeholder="rep@brand.com" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Direct Phone / WhatsApp *</label>
                    <input type="tel" required placeholder="{siteConfig.phonePrimary} or US phone" className="form-input" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Order Quantities / MOQs</label>
                  <input type="text" placeholder="e.g. LCL, FCL, Pallets, Master Cartons" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Share Product Details & Brand Information *</label>
                  <textarea rows={4} placeholder="Describe your product lines, certifications (FDA, ISO, GMP), brand catalog link, and manufacturing location..." className="form-textarea" required></textarea>
                </div>
                <button type="submit" className="btn-submit-modal">
                  Submit Supplier Inquiry
                </button>
              </form>

              {formSubmitted && (
                <div style={{ marginTop: '20px', padding: '16px', background: '#ecfdf5', color: '#065f46', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={24} color="#059669" />
                  <div>
                    <strong>Supplier Inquiry Received!</strong>
                    <p style={{ fontSize: '0.88rem' }}>Our team will review your inquiry and follow up about potential next steps.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CONTACT US */}
      {activeTab === 'contact' && (
        <div className="section-wrapper" style={{ padding: '60px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="section-header-center">
              <span className="section-tag">GET IN TOUCH</span>
              <h1 className="section-title">Contact MKB Ventures Global LLC</h1>
              <p style={{ color: '#64748b', maxWidth: '600px', margin: '10px auto 0' }}>
                We are at your service for catalog requests, partnership discussions, or general inquiries.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px', marginTop: '40px' }}>
              <div style={{ background: '#241b14', color: '#fff', padding: '36px', borderRadius: '20px', border: '1px solid rgba(140, 95, 36, 0.3)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '16px', color: '#f5efe6' }}>Direct Coordinates</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Mail size={20} color="#c59b3f" />
                    <div>
                      <div style={{ color: '#b8aba0', fontSize: '0.8rem', textTransform: 'uppercase' }}>Email</div>
                      <a href={`mailto:${siteConfig.email}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Phone size={20} color="#c59b3f" />
                    <div>
                      <div style={{ color: '#b8aba0', fontSize: '0.8rem', textTransform: 'uppercase' }}>Phone Number</div>
                      <div>Direct: <a href={`tel:${siteConfig.phoneDirectTel}`} style={{ color: '#fff' }}>{siteConfig.phoneDirect}</a></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <MapPin size={20} color="#c59b3f" />
                    <div>
                      <div style={{ color: '#b8aba0', fontSize: '0.8rem', textTransform: 'uppercase' }}>Official Registered Address</div>
                      <div style={{ color: '#fff', fontWeight: '600' }}>30 N Gould St # 68445</div>
                      <div style={{ color: '#fff' }}>{siteConfig.address.line2}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <MessageSquare size={20} color="#25d366" />
                    <div>
                      <div style={{ color: '#b8aba0', fontSize: '0.8rem', textTransform: 'uppercase' }}>WhatsApp Chat</div>
                      <a 
                        href="https://wa.me/${siteConfig.whatsappNumber}" 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ color: '#25d366', fontWeight: '600', textDecoration: 'none' }}
                      >
                        {siteConfig.phoneDirect} (Instant)
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Building2 size={20} color="#c59b3f" />
                    <div>
                      <div style={{ color: '#b8aba0', fontSize: '0.8rem', textTransform: 'uppercase' }}>Management</div>
                      <div style={{ color: '#fff' }}>MKB Ventures Global LLC</div>
                      <div style={{ color: '#b8aba0', fontSize: '0.85rem' }}>Management & Operations</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', padding: '36px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '18px' }}>Send Us a Message</h3>
                <form onSubmit={handleFormSubmit} className="modal-form">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" required placeholder="Your name" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" required placeholder="your.email@example.com" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input type="text" placeholder="Wholesale Inquiry / Catalog" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea rows={4} placeholder="How can we assist you today?" required className="form-textarea"></textarea>
                  </div>
                  <button type="submit" className="btn-submit-modal">
                    Send Message
                  </button>
                </form>

                {formSubmitted && (
                  <div style={{ marginTop: '16px', padding: '12px', background: '#ecfdf5', color: '#065f46', borderRadius: '8px', fontSize: '0.9rem' }}>
                    Thank you! Your message has been received by {siteConfig.companyName}. We will reply within 24 hours.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FOOTER AS EXACTLY SPECIFIED BY USER */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <img src={siteConfig.logo || logoImg} alt={`${siteConfig.companyName} Logo`} className="footer-logo-img" />
            <h3>{siteConfig.companyName}</h3>
            <p>
              Quality products online. Sourcing and distribution dedicated to supplying top tier merchandise with transparent global logistics.
            </p>
            <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <div><strong>Registered Address:</strong> {siteConfig.address.full}</div>
              <div><strong>Management:</strong> MKB Ventures Global LLC</div>
              <div><strong>Trade Desk Hotline:</strong> {siteConfig.phoneDirect} • {siteConfig.email}</div>
            </div>
          </div>

          <div className="footer-col">
            <h4>Menu</h4>
            <ul>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a></li>
              <li><a href="#shop" onClick={(e) => { e.preventDefault(); navigateTo('home'); const el = document.getElementById('featured-products-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>Shop</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>About</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contacts</h4>
            <ul style={{ marginBottom: '20px' }}>
              <li>
                <a href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.phoneDirectTel}`}>
                  {siteConfig.phoneDirect}
                </a>
              </li>
            </ul>

            <h4 style={{ marginTop: '16px' }}>Socials</h4>
            <ul className="footer-social-links">
              <li><a href="https://facebook.com/" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://tiktok.com/" target="_blank" rel="noreferrer">TikTok</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Subscribe to our newsletter</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '14px', color: '#cbd5e1' }}>
              Receive exclusive price updates, catalog drops, and seasonal availability lists.
            </p>
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>EMAIL *</label>
              <input 
                type="email" 
                required 
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  padding: '11px 14px',
                  borderRadius: '6px',
                  border: '1px solid #334155',
                  background: '#152433',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button 
                type="submit" 
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #c59b3f 100%)',
                  color: '#0c2338',
                  padding: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '6px',
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 14px rgba(197, 155, 63, 0.25)'
                }}
              >
                Subscribe
              </button>
            </form>

            {newsletterSuccess && (
              <div style={{ marginTop: '10px', color: '#4ade80', fontSize: '0.82rem' }}>
                ✓ Thank you for subscribing to our wholesale bulletin!
              </div>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} <strong>{siteConfig.legalName}</strong>. All rights reserved.
          </div>
          <div style={{ color: '#64748b' }}>
            Managed by MKB Ventures Global LLC • {siteConfig.address.full}
          </div>
        </div>
      </footer>

      {/* CART DRAWER SLIDE-OVER */}
      {cartOpen && (
        <div className="cart-backdrop" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <div className="cart-header-title">
                <ShoppingBag size={20} color="#1e7087" />
                <h3>Your Wholesale Cart</h3>
                <span className="cart-count-pill">{totalCartItems} units</span>
              </div>
              <button className="cart-close-btn" onClick={() => setCartOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="cart-drawer-body">
              {cart.length === 0 ? (
                <div className="cart-empty-state">
                  <div className="empty-cart-icon">
                    <ShoppingCart size={48} strokeWidth={1.5} color="#94a3b8" />
                  </div>
                  <h4>Your Cart is Empty</h4>
                  <p>Browse our catalog and add wholesale products to calculate tiered totals or place direct orders.</p>
                  <button 
                    className="btn-hero-primary" 
                    style={{ marginTop: '16px' }}
                    onClick={() => {
                      setCartOpen(false);
                      navigateTo('home');
                    }}
                  >
                    Explore Wholesale Catalog
                  </button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <div key={item.product.id} className="cart-item-card">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="cart-item-thumb"
                        onClick={() => {
                          viewProductDetail(item.product);
                          setCartOpen(false);
                        }}
                      />
                      <div className="cart-item-details">
                        <div className="cart-item-meta">
                          <span className="cart-item-sku">SKU: {item.product.sku}</span>
                          <button 
                            className="btn-remove-item"
                            onClick={() => removeFromCart(item.product.id)}
                            title="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <h4 
                          className="cart-item-title"
                          onClick={() => {
                            viewProductDetail(item.product);
                            setCartOpen(false);
                          }}
                        >
                          {item.product.name}
                        </h4>
                        <div className="cart-item-price-row">
                          <span className="cart-unit-price">{item.product.price} / unit</span>
                          <span className="cart-line-total">{siteConfig.currencySymbol || "$"} {(item.product.priceNumeric * item.quantity).toLocaleString()}</span>
                        </div>
                        <div className="cart-stepper-row">
                          <div className="cart-qty-stepper">
                            <button 
                              onClick={() => updateCartQuantity(item.product.id, -1)}
                              className="cart-step-btn"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="cart-step-val">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.product.id, 1)}
                              className="cart-step-btn"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button 
                            className="cart-view-link"
                            onClick={() => {
                              viewProductDetail(item.product);
                              setCartOpen(false);
                            }}
                          >
                            View details →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-summary-box">
                  <div className="summary-row">
                    <span>Total Quantity:</span>
                    <strong>{totalCartItems} units</strong>
                  </div>
                  <div className="summary-row subtotal">
                    <span>Estimated Subtotal:</span>
                    <strong className="summary-amount">{siteConfig.currencySymbol || "$"} {cartSubtotal.toLocaleString()}</strong>
                  </div>
                  <p className="summary-note">Wholesale tiered rates and freight confirmed upon order dispatch.</p>
                </div>

                <div className="cart-footer-actions">
                  <a 
                    href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                      `Hello ${siteConfig.companyName}, I want to place an order:\n\n` +
                      cart.map(i => `• ${i.product.name} (SKU: ${i.product.sku}) - Qty: ${i.quantity} x ${i.product.price} = ${siteConfig.currencySymbol || "$"}${(i.product.priceNumeric * i.quantity).toLocaleString()}`).join('\n') +
                      `\n\nTotal Estimated: ${siteConfig.currencySymbol || "$"}${cartSubtotal.toLocaleString()}\nTotal Units: ${totalCartItems}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-cart-whatsapp"
                  >
                    <MessageSquare size={18} />
                    <span>Instant Checkout via WhatsApp</span>
                  </a>

                  <button 
                    className="btn-cart-checkout"
                    onClick={() => {
                      setCartOpen(false);
                      handleOpenPartner('checkout');
                    }}
                  >
                    <span>Proceed to Wholesale Checkout</span>
                    <ArrowRight size={18} />
                  </button>
                </div>

                <div className="cart-clear-row">
                  <button onClick={clearCart} className="btn-clear-cart">
                    Clear Entire Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="cart-toast">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODAL: QUOTE REQUEST, PARTNER INQUIRY, OR CHECKOUT */}
      {modalType && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={18} />
            </button>

            {modalType === 'quote' && selectedProduct && (
              <>
                <h3 className="modal-title">Request Wholesale Quote</h3>
                <p className="modal-subtitle">
                  Inquiring for: <strong>{selectedProduct.name}</strong> (SKU: {selectedProduct.sku})
                </p>
                <form onSubmit={handleFormSubmit} className="modal-form">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" required placeholder="Your name" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Email *</label>
                    <input type="email" required placeholder="buyer@company.com" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number / WhatsApp *</label>
                    <input type="tel" required placeholder="(+966) / (+1) Phone" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Requested Quantity (Minimum: {selectedProduct.minOrder})</label>
                    <input type="text" placeholder={`e.g. 20 Cases / 1 Pallet`} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Destination Port / Delivery Zip Code</label>
                    <input type="text" placeholder="City, State / Country" className="form-input" required />
                  </div>
                  <button type="submit" className="btn-submit-modal">
                    Submit Quote Request
                  </button>
                </form>
              </>
            )}

            {modalType === 'partner' && (
              <>
                <h3 className="modal-title">Wholesale Partnership Today</h3>
                <p className="modal-subtitle">
                  Connect with {siteConfig.companyName} executive desk.
                </p>
                <form onSubmit={handleFormSubmit} className="modal-form">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" required placeholder="Your name" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business / Company Name *</label>
                    <input type="text" required placeholder="Company LLC" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input type="email" required placeholder="contact@company.com" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp *</label>
                    <input type="tel" required placeholder="{siteConfig.phoneDirect} or US line" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Categories of Interest</label>
                    <select className="form-select">
                      <option>All Product Categories</option>
                      {categories.map((c) => (
                        <option key={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes / Expected Order Size</label>
                    <textarea rows={3} placeholder="Tell us about your distribution needs..." className="form-textarea"></textarea>
                  </div>
                  <button type="submit" className="btn-submit-modal">
                    Connect With {siteConfig.shortName}
                  </button>
                </form>
              </>
            )}

            {modalType === 'checkout' && (
              <>
                <h3 className="modal-title">Wholesale Checkout / Purchase Order</h3>
                <p className="modal-subtitle">
                  Submitting order for: <strong>{totalCartItems} units • Total: {siteConfig.currencySymbol || "$"} {cartSubtotal.toLocaleString()}</strong>
                </p>
                <form onSubmit={handleFormSubmit} className="modal-form">
                  <div className="form-group">
                    <label className="form-label">Buyer / Contact Name *</label>
                    <input type="text" required placeholder="Your name" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company / Business Name *</label>
                    <input type="text" required placeholder="Company / Organization" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Email *</label>
                    <input type="email" required placeholder="procurement@company.com" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">WhatsApp / Phone Number *</label>
                    <input type="tel" required placeholder="(+966) / (+1) Phone" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Delivery / Destination Address *</label>
                    <input type="text" required placeholder="Warehouse address, City, Country" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Order Notes / Custom Pallet Instructions</label>
                    <textarea rows={2} placeholder="Optional delivery instructions, dock requirements..." className="form-textarea"></textarea>
                  </div>
                  <button type="submit" className="btn-submit-modal">
                    Confirm & Place Purchase Order ({siteConfig.currencySymbol || "$"} {cartSubtotal.toLocaleString()})
                  </button>
                </form>
              </>
            )}

            {formSubmitted && (
              <div style={{ marginTop: '20px', padding: '16px', background: '#ecfdf5', color: '#065f46', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={24} color="#059669" />
                <div>
                  <strong>Order / Inquiry Dispatched!</strong>
                  <p style={{ fontSize: '0.85rem' }}>{siteConfig.companyName} and our logistics desk will confirm your order and send invoice details via WhatsApp and email promptly.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

