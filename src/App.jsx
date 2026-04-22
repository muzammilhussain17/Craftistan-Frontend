import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ArtisanDashboard } from './pages/ArtisanDashboard';
import { ArtisanOrders } from './pages/ArtisanOrders';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { Checkout } from './pages/Checkout';
import { Confirmation } from './pages/Confirmation';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Creators } from './pages/Creators';
import { About, Contact, Help, TrackOrder, ShippingReturns } from './pages/StaticPages';
import { ProfileSettings } from './pages/ProfileSettings';
import { OrderHistory } from './pages/OrderHistory';
import { ArtisanProducts } from './pages/ArtisanProducts';
import { Wishlist } from './pages/Wishlist';
import { MyReports } from './pages/MyReports';
import ForgotPassword from './pages/ForgotPassword';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminArtisans } from './pages/admin/AdminArtisans';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminReports } from './pages/admin/AdminReports';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartSlideOver } from './components/cart/CartSlideOver';
import { ChatWidget } from './components/chat/ChatWidget';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ROLES } from './data/authData';
import { BetaWelcomeModal } from './components/ui/BetaWelcomeModal';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <Routes>
                            <Route path="/" element={<Home />} />

                            {/* Artisan Routes */}
                            <Route
                                path="/artisan"
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.ARTISAN]}>
                                        <ArtisanDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/artisan/products"
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.ARTISAN]}>
                                        <ArtisanProducts />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/artisan/orders"
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.ARTISAN]}>
                                        <ArtisanOrders />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Buyer Routes */}
                            <Route
                                path="/buyer"
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.BUYER]}>
                                        <BuyerDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/orders"
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.BUYER, ROLES.ARTISAN]}>
                                        <OrderHistory />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Profile - All logged in users */}
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.BUYER, ROLES.ARTISAN]}>
                                        <ProfileSettings />
                                    </ProtectedRoute>
                                }
                            />
                            
                            {/* Support/Reports - Logged in users */}
                            <Route
                                path="/reports"
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.BUYER, ROLES.ARTISAN]}>
                                        <MyReports />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Checkout */}
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/confirmation" element={<Confirmation />} />

                            {/* Shop Pages */}
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/shop/:category" element={<Shop />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/creators" element={<Creators />} />
                            <Route path="/wishlist" element={<Wishlist />} />

                            {/* Admin Routes - ADMIN only */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/artisans"
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                                        <AdminArtisans />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/users"
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                                        <AdminUsers />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/products"
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                                        <AdminProducts />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/reports"
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                                        <AdminReports />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Static Pages */}
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/help" element={<Help />} />
                            <Route path="/track-order" element={<TrackOrder />} />
                            <Route path="/shipping-returns" element={<ShippingReturns />} />
                        </Routes>
                        <CartSlideOver />
                        <ChatWidget />
                        <BetaWelcomeModal />
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
