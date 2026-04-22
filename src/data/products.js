// Mock Product Data for Shop - Pakistani Rupees (PKR)

export const CATEGORIES = [
    { id: 'new-arrivals', name: 'New Arrivals', icon: '✨' },
    { id: 'home-decor', name: 'Home Decor', icon: '🏠' },
    { id: 'textiles', name: 'Textiles', icon: '🧵' },
    { id: 'jewelry', name: 'Jewelry', icon: '💍' },
];

export const FILTERS = {
    priceRanges: [
        { id: 'under-5000', label: 'Under Rs. 5,000', min: 0, max: 5000 },
        { id: '5000-15000', label: 'Rs. 5,000 - 15,000', min: 5000, max: 15000 },
        { id: '15000-30000', label: 'Rs. 15,000 - 30,000', min: 15000, max: 30000 },
        { id: 'over-30000', label: 'Rs. 30,000+', min: 30000, max: Infinity },
    ],
    styles: [
        { id: 'classic', label: 'Classic' },
        { id: 'modern', label: 'Modern' },
        { id: 'vintage', label: 'Vintage' },
        { id: 'bohemian', label: 'Bohemian' },
    ],
    sortOptions: [
        { id: 'newest', label: 'Newest First' },
        { id: 'oldest', label: 'Oldest First' },
        { id: 'price-low', label: 'Price: Low to High' },
        { id: 'price-high', label: 'Price: High to Low' },
        { id: 'popular', label: 'Most Popular' },
    ],
};

export const PRODUCTS = [
    // New Arrivals
    { id: 1, name: 'Hand-Woven Silk Scarf', price: 8500, category: 'new-arrivals', style: 'modern', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400', artisan: 'Fatima Zahra', rating: 4.8, isNew: true },
    { id: 2, name: 'Embroidered Cushion Cover', price: 4500, category: 'new-arrivals', style: 'bohemian', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', artisan: 'Ali Hassan', rating: 4.6, isNew: true },
    { id: 3, name: 'Ceramic Tea Set', price: 12000, category: 'new-arrivals', style: 'classic', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400', artisan: 'Zainab Malik', rating: 4.9, isNew: true },
    { id: 4, name: 'Brass Candle Holder', price: 6500, category: 'new-arrivals', style: 'vintage', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400', artisan: 'Usman Khan', rating: 4.7, isNew: true },
    { id: 5, name: 'Handmade Leather Journal', price: 5500, category: 'new-arrivals', style: 'classic', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400', artisan: 'Sara Ahmed', rating: 4.5, isNew: true },

    // Home Decor
    { id: 6, name: 'Carved Wooden Mirror Frame', price: 18000, category: 'home-decor', style: 'vintage', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400', artisan: 'Malik Ahmed', rating: 4.9, isNew: false },
    { id: 7, name: 'Hand-Painted Vase', price: 9500, category: 'home-decor', style: 'bohemian', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400', artisan: 'Ayesha Bibi', rating: 4.7, isNew: false },
    { id: 8, name: 'Moroccan Lantern', price: 14500, category: 'home-decor', style: 'classic', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400', artisan: 'Hassan Ali', rating: 4.8, isNew: false },
    { id: 9, name: 'Woven Wall Hanging', price: 7500, category: 'home-decor', style: 'bohemian', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', artisan: 'Nadia Khan', rating: 4.6, isNew: false },
    { id: 10, name: 'Terracotta Planter Set', price: 6000, category: 'home-decor', style: 'modern', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', artisan: 'Imran Shah', rating: 4.4, isNew: false },

    // Textiles
    { id: 11, name: 'Pashmina Shawl', price: 22000, category: 'textiles', style: 'classic', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400', artisan: 'Rashida Begum', rating: 5.0, isNew: false },
    { id: 12, name: 'Block Print Tablecloth', price: 8500, category: 'textiles', style: 'vintage', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400', artisan: 'Fatima Khatun', rating: 4.7, isNew: false },
    { id: 13, name: 'Handloom Cotton Rug', price: 16500, category: 'textiles', style: 'bohemian', image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400', artisan: 'Amir Hussain', rating: 4.8, isNew: true },
    { id: 14, name: 'Embroidered Bedspread', price: 19500, category: 'textiles', style: 'classic', image: 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=400', artisan: 'Salma Bibi', rating: 4.9, isNew: false },
    { id: 15, name: 'Silk Dupatta', price: 11000, category: 'textiles', style: 'modern', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', artisan: 'Hina Parveen', rating: 4.6, isNew: false },

    // Jewelry
    { id: 16, name: 'Oxidized Silver Jhumkas', price: 4500, category: 'jewelry', style: 'vintage', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', artisan: 'Meena Kumari', rating: 4.8, isNew: false },
    { id: 17, name: 'Kundan Necklace Set', price: 28000, category: 'jewelry', style: 'classic', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', artisan: 'Laila Sheikh', rating: 4.9, isNew: true },
    { id: 18, name: 'Beaded Anklet Pair', price: 3500, category: 'jewelry', style: 'bohemian', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400', artisan: 'Reshma Ali', rating: 4.5, isNew: false },
    { id: 19, name: 'Brass Cuff Bracelet', price: 5500, category: 'jewelry', style: 'modern', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400', artisan: 'Jamila Hassan', rating: 4.7, isNew: false },
    { id: 20, name: 'Pearl Drop Earrings', price: 7500, category: 'jewelry', style: 'classic', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', artisan: 'Sana Mirza', rating: 4.8, isNew: true },
];
