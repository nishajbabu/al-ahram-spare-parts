import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { BulkSkuOrderModal } from './components/BulkSkuOrderModal';
import { CatalogSection } from './components/CatalogSection';
import { ChassisExplorer } from './components/ChassisExplorer';
import { CompareDockAndModal } from './components/CompareModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { HeroSection } from './components/HeroSection';
import { ActivePage, Navbar } from './components/Navbar';
import { OffersAndFaqSection } from './components/OffersAndFaqSection';
import { ProductDetailView } from './components/ProductDetailView';
import { QuoteDrawer } from './components/QuoteDrawer';
import { ShowroomPage } from './components/ShowroomPage';
import { TestimonialsSection } from './components/TestimonialsSection';
import { TrustAndBrandsStrip } from './components/TrustAndBrandsStrip';
import { TrustAndContactFooter } from './components/TrustAndContactFooter';
import { WholesaleExportPage } from './components/WholesaleExportPage';
import { isPartCompatible, SPARE_PARTS } from './data/catalog';
import {
  CatalogSortOption,
  CategoryId,
  CurrencyCode,
  DispatchLane,
  PricingMode,
  QuoteBagItem,
  SavedVehicle,
  SparePart,
  VariantType,
  VehicleFitment,
} from './types';

const STORAGE_KEY = 'alahram_auto_parts_state_v1';

interface PersistedState {
  fitment?: VehicleFitment;
  currency?: CurrencyCode;
  pricingMode?: PricingMode;
  dispatchLane?: DispatchLane;
  bagItems?: QuoteBagItem[];
  savedVehicles?: SavedVehicle[];
  savedPartIds?: string[];
  comparePartIds?: string[];
}

function loadPersistedState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PersistedState;
  } catch {
    return {};
  }
}

function parseHashRoute(): { page: ActivePage; partId: string | null } {
  const hash = window.location.hash || '';
  if (hash === '#/wholesale') return { page: 'wholesale', partId: null };
  if (hash === '#/showroom') return { page: 'showroom', partId: null };
  if (hash.startsWith('#/part/')) {
    const id = hash.slice('#/part/'.length).trim();
    if (id && SPARE_PARTS.some((p) => p.id === id)) {
      return { page: 'part', partId: id };
    }
  }
  return { page: 'home', partId: null };
}

export default function App() {
  const initial = useMemo(() => loadPersistedState(), []);
  const initialRoute = useMemo(() => parseHashRoute(), []);

  const [activePage, setActivePage] = useState<ActivePage>(initialRoute.page);
  const [activePartId, setActivePartId] = useState<string | null>(initialRoute.partId);
  const [selectedVariant, setSelectedVariant] = useState<VariantType>('standard_oem');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [onlyFastMoving, setOnlyFastMoving] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [sortBy, setSortBy] = useState<CatalogSortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [fitment, setFitment] = useState<VehicleFitment>(
    initial.fitment || { make: '', model: '', year: '' }
  );
  const [currency, setCurrency] = useState<CurrencyCode>(initial.currency || 'AED');
  const [pricingMode, setPricingMode] = useState<PricingMode>(
    initial.pricingMode || 'retail'
  );
  const [dispatchLane, setDispatchLane] = useState<DispatchLane>(
    initial.dispatchLane || 'uae_same_day'
  );
  const [bagItems, setBagItems] = useState<QuoteBagItem[]>(
    Array.isArray(initial.bagItems) ? initial.bagItems : []
  );
  const [savedVehicles, setSavedVehicles] = useState<SavedVehicle[]>(
    Array.isArray(initial.savedVehicles) ? initial.savedVehicles : []
  );
  const [savedPartIds, setSavedPartIds] = useState<string[]>(
    Array.isArray(initial.savedPartIds) ? initial.savedPartIds : []
  );
  const [comparePartIds, setComparePartIds] = useState<string[]>(
    Array.isArray(initial.comparePartIds) ? initial.comparePartIds.slice(0, 3) : []
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isBulkOrderOpen, setIsBulkOrderOpen] = useState(false);

  useEffect(() => {
    try {
      const payload: PersistedState = {
        fitment,
        currency,
        pricingMode,
        dispatchLane,
        bagItems,
        savedVehicles,
        savedPartIds,
        comparePartIds,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota / private-browsing errors
    }
  }, [
    fitment,
    currency,
    pricingMode,
    dispatchLane,
    bagItems,
    savedVehicles,
    savedPartIds,
    comparePartIds,
  ]);

  const catalogMap = useMemo(() => {
    return SPARE_PARTS.reduce<Record<string, SparePart>>((acc, part) => {
      acc[part.id] = part;
      return acc;
    }, {});
  }, []);

  const activePart = activePartId ? catalogMap[activePartId] ?? null : null;

  const compatibleCount = useMemo(
    () => SPARE_PARTS.filter((part) => isPartCompatible(part, fitment)).length,
    [fitment]
  );

  const totalBagCount = useMemo(
    () => bagItems.reduce((sum, item) => sum + item.quantity, 0),
    [bagItems]
  );

  const compareParts = useMemo(
    () =>
      comparePartIds
        .map((id) => catalogMap[id])
        .filter((p): p is SparePart => Boolean(p)),
    [comparePartIds, catalogMap]
  );

  useEffect(() => {
    const handleHashChange = () => {
      const next = parseHashRoute();
      setActivePage(next.page);
      setActivePartId(next.partId);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const syncHash = useCallback((nextHash: string) => {
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  }, []);

  const scrollToElement = (elementId: string) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const handleNavigateHome = () => {
    setActivePartId(null);
    setActivePage('home');
    syncHash('#/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePage = (page: 'wholesale' | 'showroom') => {
    setActivePartId(null);
    setActivePage(page);
    syncHash(`#/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    if (activePage !== 'home' || activePartId !== null) {
      setActivePartId(null);
      setActivePage('home');
      syncHash('#/');
      setTimeout(() => scrollToElement(sectionId), 150);
    } else {
      scrollToElement(sectionId);
    }
  };

  const handleSelectPart = (part: SparePart) => {
    setSelectedVariant('standard_oem');
    setActivePartId(part.id);
    setActivePage('part');
    syncHash(`#/part/${part.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInspectPartById = (partId: string) => {
    const found = catalogMap[partId];
    if (found) {
      handleSelectPart(found);
    }
  };

  const handleSelectCategoryFromExplorer = (categoryId: CategoryId) => {
    setSelectedCategory(categoryId);
    setOnlyFastMoving(false);
    setActivePage('home');
    setActivePartId(null);
    syncHash('#/');
    scrollToElement('catalog');
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setOnlyFastMoving(false);
    setOnlySaved(false);
    setSortBy('featured');
    setSearchQuery('');
    setFitment({ make: '', model: '', year: '', vin: undefined });
  };

  const handleSaveCurrentVehicle = () => {
    if (!fitment.make) return;
    const label = [fitment.year, fitment.make, fitment.model].filter(Boolean).join(' ');
    const id = `${fitment.make}-${fitment.model}-${fitment.year}-${fitment.vin || ''}`.toLowerCase();
    setSavedVehicles((prev) => {
      if (prev.some((v) => v.id === id)) return prev;
      return [{ id, label, fitment: { ...fitment } }, ...prev].slice(0, 5);
    });
  };

  const handleRemoveSavedVehicle = (id: string) => {
    setSavedVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const handleToggleSavePart = (partId: string) => {
    setSavedPartIds((prev) =>
      prev.includes(partId) ? prev.filter((id) => id !== partId) : [...prev, partId]
    );
  };

  const handleToggleComparePart = (partId: string) => {
    setComparePartIds((prev) => {
      if (prev.includes(partId)) {
        return prev.filter((id) => id !== partId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), partId];
      }
      return [...prev, partId];
    });
  };

  const handleAddToBag = (
    partId: string,
    variantId: VariantType,
    quantity: number
  ) => {
    setBagItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.partId === partId && item.variantId === variantId
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          fitment: fitment.make ? { ...fitment } : updated[existingIndex].fitment,
        };
        return updated;
      }
      return [
        ...prev,
        {
          partId,
          variantId,
          quantity,
          fitment: fitment.make ? { ...fitment } : undefined,
        },
      ];
    });
    setIsDrawerOpen(true);
  };

  const handleAddBulkLines = (
    entries: Array<{ partId: string; variantId: VariantType; quantity: number }>
  ) => {
    setBagItems((prev) => {
      const next = [...prev];
      for (const entry of entries) {
        const idx = next.findIndex(
          (i) => i.partId === entry.partId && i.variantId === entry.variantId
        );
        if (idx >= 0) {
          next[idx] = {
            ...next[idx],
            quantity: next[idx].quantity + entry.quantity,
            fitment: fitment.make ? { ...fitment } : next[idx].fitment,
          };
        } else {
          next.push({
            partId: entry.partId,
            variantId: entry.variantId,
            quantity: entry.quantity,
            fitment: fitment.make ? { ...fitment } : undefined,
          });
        }
      }
      return next;
    });
    setIsDrawerOpen(true);
  };

  const handleAddBundleToBag = (
    bundleItems: Array<{ partId: string; variantId: VariantType }>
  ) => {
    const qty = pricingMode === 'bulk' ? 5 : 1;
    handleAddBulkLines(bundleItems.map((b) => ({ ...b, quantity: qty })));
  };

  const handleUpdateQuantity = (
    partId: string,
    variantId: VariantType,
    qty: number
  ) => {
    setBagItems((prev) =>
      prev.map((item) =>
        item.partId === partId && item.variantId === variantId
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const handleRemoveItem = (partId: string, variantId: VariantType) => {
    setBagItems((prev) =>
      prev.filter(
        (item) => !(item.partId === partId && item.variantId === variantId)
      )
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#0B0B0D] text-[#F4F5F7] flex flex-col">
        <Navbar
          bagCount={totalBagCount}
          activePage={activePage}
          onNavigateHome={handleNavigateHome}
          onNavigateSection={handleNavigateSection}
          onNavigatePage={handleNavigatePage}
          onOpenBag={() => setIsDrawerOpen(true)}
        />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            {activePage === 'part' && activePart ? (
              <ProductDetailView
                key={activePart.id}
                part={activePart}
                fitment={fitment}
                currency={currency}
                pricingMode={pricingMode}
                selectedVariant={selectedVariant}
                isSaved={savedPartIds.includes(activePart.id)}
                isCompared={comparePartIds.includes(activePart.id)}
                onVariantChange={setSelectedVariant}
                onPricingModeChange={setPricingMode}
                onCurrencyChange={setCurrency}
                onToggleSave={() => handleToggleSavePart(activePart.id)}
                onToggleCompare={() => handleToggleComparePart(activePart.id)}
                onBack={handleNavigateHome}
                onAddToBag={handleAddToBag}
              />
            ) : activePage === 'wholesale' ? (
              <WholesaleExportPage
                key="wholesale-page"
                currency={currency}
                onCurrencyChange={setCurrency}
                onBackHome={handleNavigateHome}
                onOpenBulkOrder={() => setIsBulkOrderOpen(true)}
                onSelectDispatchLane={setDispatchLane}
                onGoToCatalogBulk={() => {
                  setPricingMode('bulk');
                  handleNavigateSection('catalog');
                }}
              />
            ) : activePage === 'showroom' ? (
              <ShowroomPage
                key="showroom-page"
                onBackHome={handleNavigateHome}
                onExploreCatalog={() => handleNavigateSection('catalog')}
              />
            ) : (
              <div key="gallery-home">
                <HeroSection
                  fitment={fitment}
                  currency={currency}
                  compatibleCount={compatibleCount}
                  savedVehicles={savedVehicles}
                  onFitmentChange={setFitment}
                  onCurrencyChange={setCurrency}
                  onSaveVehicle={handleSaveCurrentVehicle}
                  onRemoveSavedVehicle={handleRemoveSavedVehicle}
                  onExploreCatalog={() => scrollToElement('catalog')}
                  onSearchOem={(query) => {
                    setSearchQuery(query);
                    scrollToElement('catalog');
                  }}
                />

                <TrustAndBrandsStrip
                  activeMake={fitment.make}
                  onSelectMake={(make) => {
                    setFitment((prev) => ({
                      ...prev,
                      make: prev.make === make ? '' : make,
                      model: '',
                    }));
                  }}
                />

                <ChassisExplorer
                  fitment={fitment}
                  currency={currency}
                  pricingMode={pricingMode}
                  onSelectCategory={handleSelectCategoryFromExplorer}
                  onInspectPart={handleInspectPartById}
                />

                <CatalogSection
                  selectedCategory={selectedCategory}
                  onlyFastMoving={onlyFastMoving}
                  onlySaved={onlySaved}
                  sortBy={sortBy}
                  searchQuery={searchQuery}
                  fitment={fitment}
                  currency={currency}
                  pricingMode={pricingMode}
                  savedPartIds={savedPartIds}
                  comparePartIds={comparePartIds}
                  onCategoryChange={setSelectedCategory}
                  onFastMovingChange={setOnlyFastMoving}
                  onOnlySavedChange={setOnlySaved}
                  onSortChange={setSortBy}
                  onSearchChange={setSearchQuery}
                  onPricingModeChange={setPricingMode}
                  onSelectPart={handleSelectPart}
                  onToggleSavePart={handleToggleSavePart}
                  onToggleComparePart={handleToggleComparePart}
                  onQuickAddPart={(partId, variantId) =>
                    handleAddToBag(partId, variantId, pricingMode === 'bulk' ? 5 : 1)
                  }
                  onOpenBulkOrder={() => setIsBulkOrderOpen(true)}
                  onAddBundle={handleAddBundleToBag}
                  onResetFilters={handleResetFilters}
                />

                <OffersAndFaqSection
                  currency={currency}
                  pricingMode={pricingMode}
                  onSelectPart={handleSelectPart}
                  onQuickAddPart={(partId, variantId) =>
                    handleAddToBag(partId, variantId, pricingMode === 'bulk' ? 5 : 1)
                  }
                />
              </div>
            )}
          </AnimatePresence>
        </main>

        <TestimonialsSection />

        <TrustAndContactFooter onNavigatePage={handleNavigatePage} />

        <QuoteDrawer
          isOpen={isDrawerOpen}
          items={bagItems}
          catalogMap={catalogMap}
          currency={currency}
          pricingMode={pricingMode}
          dispatchLane={dispatchLane}
          fitment={fitment}
          onClose={() => setIsDrawerOpen(false)}
          onPricingModeChange={setPricingMode}
          onCurrencyChange={setCurrency}
          onDispatchLaneChange={setDispatchLane}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearBag={() => setBagItems([])}
        />

        <CompareDockAndModal
          compareParts={compareParts}
          isOpen={isCompareModalOpen}
          currency={currency}
          pricingMode={pricingMode}
          onOpenModal={() => setIsCompareModalOpen(true)}
          onCloseModal={() => setIsCompareModalOpen(false)}
          onRemovePart={(partId) =>
            setComparePartIds((prev) => prev.filter((id) => id !== partId))
          }
          onClearCompare={() => {
            setComparePartIds([]);
            setIsCompareModalOpen(false);
          }}
          onSelectPart={handleSelectPart}
          onAddToBag={handleAddToBag}
        />

        <BulkSkuOrderModal
          isOpen={isBulkOrderOpen}
          currency={currency}
          pricingMode={pricingMode}
          onClose={() => setIsBulkOrderOpen(false)}
          onAddBulkLines={handleAddBulkLines}
        />

        <FloatingWhatsApp
          activePart={activePart}
          selectedVariant={selectedVariant}
          fitment={fitment}
          currency={currency}
          pricingMode={pricingMode}
        />
      </div>
    </MotionConfig>
  );
}
