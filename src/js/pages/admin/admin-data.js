// Admin Panel Sample Data
// Generates sample data for development/demo purposes

export function getSampleTours() {
    return [
        {
            id: 1,
            title: "Gobustan Group Tour",
            description: "Explore ancient rock art and mud volcanoes in this fascinating archaeological site.",
            type: "group",
            price: 38,
            duration: "8 hours",
            status: "active",
            bookings: 45,
            activity: "moderate",
            guide: "professional",
            highlights: ["Petroglyphs", "Mud Volcanoes", "Fire Temple"],
            destinations: ["gobustan"],
            image: "../../img/page-card-img/gobustan.jpg",
            gallery: [
                "../../img/page-card-img/gobustan-1.jpg",
                "../../img/page-card-img/gobustan-2.jpg",
                "../../img/page-card-img/gobustan-3.jpg",
                "../../img/page-card-img/mud-volcano-1.jpg",
                "../../img/page-card-img/mud-volcano-2.jpg"
            ],
            transport: "Comfortable bus",
            cancellationPolicy: "Free cancellation 24h before",
            phone: "+994 50 444 12 34",
            email: "info@oldcitytours.az",
            workingHours: "Daily 9:00-20:00",
            meetingPoint: "Fountain Square, Baku",
            meetingTime: "15 minutes before departure",
            pickupContact: "+994 50 444 12 34 (WhatsApp)",
            pickupLocations: [
                "Hotel pickup (city center)",
                "Fountain Square meeting point",
                "Port area pickup"
            ],
            languages: ["RU", "EN", "AZ"],
            included: [
                "Professional guide",
                "Transportation on comfortable bus",
                "Entrance tickets to Gobustan",
                "Meeting and transfer",
                "Mud volcano visit"
            ],
            notIncluded: [
                "Lunch (15-20$)",
                "Personal expenses",
                "Optional activities"
            ],
            startTimes: [
                "09:00 (morning group)",
                "14:00 (afternoon group)"
            ],
            itinerary: [
                {
                    title: "Departure from Baku",
                    description: "Group gathering and departure to Gobustan",
                    details: "45 minutes • Comfortable bus"
                },
                {
                    title: "Gobustan National Park",
                    description: "Detailed tour of the archaeological site",
                    details: "2 hours • Entrance ticket included"
                },
                {
                    title: "Mud Volcanoes",
                    description: "Visit to unique mud volcanoes",
                    details: "1 hour • Natural phenomenon"
                },
                {
                    title: "Fire Temple",
                    description: "Visit to ancient fire temple",
                    details: "1 hour • Entrance ticket included"
                },
                {
                    title: "Return to Baku",
                    description: "Return journey with discussion of impressions",
                    details: "45 minutes • Drop-off in center"
                }
            ]
        },
        {
            id: 2,
            title: "Private Old City Tour",
            description: "Discover the historic heart of Baku with a private guide.",
            type: "private",
            price: 26,
            duration: "2-4 hours (flexible)",
            status: "active",
            bookings: 38,
            activity: "easy",
            guide: "historian",
            highlights: ["Maiden Tower", "Shirvanshah Palace", "Historic Streets"],
            destinations: ["baku"],
            image: "../../img/page-card-img/oldcity.jpg",
            transport: "Walking tour",
            cancellationPolicy: "Free cancellation 12h before",
            included: [
                "Professional historian guide",
                "Entrance tickets to museums",
                "Maiden Tower ticket",
                "Shirvanshah Palace ticket"
            ],
            notIncluded: [
                "Personal expenses",
                "Souvenirs",
                "Additional museum visits"
            ],
            startTimes: [
                "10:00 (morning group)",
                "15:00 (afternoon group)"
            ],
        },
        {
            id: 3,
            title: "Qabala & Shamakhi Tour",
            description: "Experience mountain beauty and cultural heritage in northern Azerbaijan.",
            type: "group",
            price: 49,
            childPrice: 25,
            duration: "10 hours",
            status: "active",
            bookings: 32,
            highlights: ["Cable Car", "Nohur Lake", "Juma Mosque"],
            destinations: ["qabala", "shamakhi"],
            transport: "Comfortable bus",
            cancellationPolicy: "Free cancellation 24h before",
            included: [
                "Professional guide",
                "Transportation on comfortable bus",
                "Most entrance tickets",
                "Meeting and transfer"
            ],
            notIncluded: [
                "Cable car (15-20$)",
                "Lunch (15-20$)",
                "Personal expenses"
            ],
            startTimes: [
                "08:00 (full day tour)"
            ],
            recommendations: [
                "Warm clothes",
                "Camera",
                "Comfortable shoes",
                "Snacks"
            ]
        },
        {
            id: 4,
            title: "Fire Temple & Burning Mountain",
            description: "Immerse yourself in the mystical world of fire worship and ancient traditions.",
            type: "group",
            price: 29,
            childPrice: 15,
            duration: "4.5 hours",
            status: "active",
            bookings: 28,
            highlights: ["Fire Temple", "Burning Mountain", "Zoroastrian History"],
            destinations: ["baku"],
            transport: "Comfortable bus",
            cancellationPolicy: "Free cancellation 24h before",
            included: [
                "Professional guide",
                "Transportation on comfortable bus",
                "Entrance tickets to both sites",
                "Meeting and transfer"
            ],
            notIncluded: [
                "Personal expenses",
                "Souvenirs",
                "Additional activities"
            ],
            startTimes: [
                "14:00 (day tour)",
                "17:00 (evening tour)"
            ],
            recommendations: [
                "Camera",
                "Comfortable clothes"
            ]
        },
        {
            id: 5,
            title: "Azerbaijan 5-Day Package",
            description: "Comprehensive tour covering all major attractions.",
            type: "package",
            price: 229,
            duration: "5 days",
            status: "active",
            bookings: 15,
            activity: "moderate",
            guide: "professional",
            accommodation: "Hotel 3-4*",
            highlights: ["Multiple Cities", "Cultural Sites", "Natural Wonders"],
            destinations: ["baku", "gobustan", "qabala", "shamakhi"],
            transport: "Private car + comfortable bus",
            cancellationPolicy: "Free cancellation 48h before",
            included: [
                "4 nights in 3-4* hotel",
                "Hotel breakfasts",
                "All transfers",
                "Guided excursions",
                "Transportation for all trips",
                "Entrance tickets"
            ],
            notIncluded: [
                "Lunches and dinners",
                "Personal expenses",
                "Optional activities",
                "Airport transfers"
            ],
            startTimes: [
                "09:00 (daily departure)"
            ],
            recommendations: [
                "Comfortable clothes",
                "Camera",
                "Travel documents",
                "Personal items"
            ]
        }
    ];
}

export function getSampleBookings() {
    return [
        {
            id: 1,
            customerName: "Sarah Johnson",
            customerEmail: "sarah.johnson@email.com",
            customerPhone: "+1-555-0123",
            tourId: 1,
            tourName: "Gobustan Group Tour",
            date: "2024-12-15",
            time: "09:00",
            adults: 2,
            children: 1,
            total: 95,
            status: "confirmed",
            notes: "Vegetarian meal required"
        },
        {
            id: 2,
            customerName: "Marco Rossi",
            customerEmail: "marco.rossi@email.com",
            customerPhone: "+39-555-0456",
            tourId: 4,
            tourName: "Baku Night Tour",
            date: "2024-12-14",
            time: "19:00",
            adults: 1,
            children: 0,
            total: 30,
            status: "pending",
            notes: ""
        },
        {
            id: 3,
            customerName: "Elena Kozlova",
            customerEmail: "elena.kozlova@email.com",
            customerPhone: "+7-555-0789",
            tourId: 3,
            tourName: "Qabala & Shamakhi Tour",
            date: "2024-12-13",
            time: "08:00",
            adults: 3,
            children: 0,
            total: 147,
            status: "completed",
            notes: "Excellent tour!"
        }
    ];
}

export function getSampleReviews() {
    return [
        {
            id: 1,
            customerName: "Sarah Johnson",
            tourName: "Gobustan Group Tour",
            rating: 5,
            comment: "Amazing tour! The guide was excellent and very knowledgeable about the history.",
            date: "2024-12-10",
            status: "approved"
        },
        {
            id: 2,
            customerName: "Marco Rossi",
            tourName: "Baku Night Tour",
            rating: 5,
            comment: "Perfect organization and beautiful sights. Highly recommended!",
            date: "2024-12-08",
            status: "approved"
        },
        {
            id: 3,
            customerName: "Elena Kozlova",
            tourName: "Qabala & Shamakhi Tour",
            rating: 4,
            comment: "Great experience, beautiful nature and interesting cultural sites.",
            date: "2024-12-05",
            status: "pending"
        }
    ];
}

export function getSamplePromoCodes() {
    return [
        {
            id: 1,
            code: "WELCOME10",
            discountType: "percentage",
            discountValue: 10,
            usageLimit: 100,
            usedCount: 45,
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            description: "Welcome discount for new customers",
            status: "active"
        },
        {
            id: 2,
            code: "SAVE20",
            discountType: "percentage",
            discountValue: 20,
            usageLimit: 50,
            usedCount: 32,
            startDate: "2024-11-01",
            endDate: "2024-12-31",
            description: "Holiday season special discount",
            status: "active"
        },
        {
            id: 3,
            code: "FIRST5",
            discountType: "fixed",
            discountValue: 5,
            usageLimit: 200,
            usedCount: 156,
            startDate: "2024-06-01",
            endDate: "2024-12-31",
            description: "Fixed discount for first-time visitors",
            status: "active"
        }
    ];
}

export function getSampleCustomers() {
    return [
        {
            id: 1,
            name: "Sarah Johnson",
            email: "sarah.johnson@email.com",
            phone: "+1-555-0123",
            country: "USA",
            totalBookings: 3,
            totalSpent: 285,
            lastBooking: "2024-12-15"
        },
        {
            id: 2,
            name: "Marco Rossi",
            email: "marco.rossi@email.com",
            phone: "+39-555-0456",
            country: "Italy",
            totalBookings: 2,
            totalSpent: 180,
            lastBooking: "2024-12-14"
        },
        {
            id: 3,
            name: "Elena Kozlova",
            email: "elena.kozlova@email.com",
            phone: "+7-555-0789",
            country: "Russia",
            totalBookings: 1,
            totalSpent: 147,
            lastBooking: "2024-12-13"
        }
    ];
}

export function getSampleDestinations() {
    return [
        {
            id: 'gobustan',
            name: 'Gobustan National Park',
            region: 'Gobustan',
            type: 'Historical',
            description: 'Ancient rock art and mud volcanoes dating back thousands of years.',
            distanceFromBaku: '60 km',
            visitDuration: '2-3 hours',
            image: 'img/page-card-img/qobustan-1.jpg',
            highlights: ['Rock Art', 'Mud Volcanoes', 'UNESCO Site'],
            bestTimeToVisit: 'Year-round',
            activities: ['Museum Visit', 'Rock Art Tour', 'Mud Volcano Experience']
        },
        {
            id: 'qabala',
            name: 'Gabala Mountain Resort',
            region: 'Qabala',
            type: 'Natural',
            description: 'Premier mountain destination with cable car, skiing, and pristine nature.',
            distanceFromBaku: '225 km',
            visitDuration: 'Full day',
            image: 'img/page-card-img/qabala-destinations-1.jpg',
            highlights: ['Cable Car', 'Nohur Lake', 'Tufandag Resort'],
            bestTimeToVisit: 'Year-round',
            activities: ['Cable Car Ride', 'Skiing', 'Lake Activities', 'Hiking']
        },
        {
            id: 'shamakhi',
            name: 'Shamakhi & Juma Mosque',
            region: 'Shamakhi',
            type: 'Cultural',
            description: 'Ancient city with historic mosque and traditional architecture.',
            distanceFromBaku: '120 km',
            visitDuration: '1-2 hours',
            image: 'img/page-card-img/shamakhi-destination.jpg',
            highlights: ['Juma Mosque', 'Historical City', 'Traditional Architecture'],
            bestTimeToVisit: 'Year-round',
            activities: ['Mosque Visit', 'City Tour', 'Cultural Experience']
        },
        {
            id: 'sheki',
            name: 'Sheki Khan Palace',
            region: 'Sheki',
            type: 'Historical',
            description: 'Magnificent palace with stunning stained glass windows and royal history.',
            distanceFromBaku: '300 km',
            visitDuration: '2-3 hours',
            image: 'img/page-card-img/saray-1.jpg',
            highlights: ['Khan Palace', 'Stained Glass', 'Royal History'],
            bestTimeToVisit: 'Apr-Oct',
            activities: ['Palace Tour', 'Museum Visit', 'City Walk']
        },
        {
            id: 'quba',
            name: 'Quba & Xinaliq Village',
            region: 'Quba',
            type: 'Cultural',
            description: 'Highest village in Azerbaijan with unique culture and mountain views.',
            distanceFromBaku: '200 km',
            visitDuration: '3-4 hours',
            image: 'img/page-card-img/xinalig-1.jpg',
            highlights: ['Highest Village', 'Unique Culture', 'Mountain Views'],
            bestTimeToVisit: 'May-Sep',
            activities: ['Village Tour', 'Cultural Experience', 'Mountain Views']
        },
        {
            id: 'yanardag',
            name: 'Yanardag (Fire Mountain)',
            region: 'Baku',
            type: 'Natural',
            description: 'Natural gas fire burning continuously for centuries.',
            distanceFromBaku: '25 km',
            visitDuration: '30 minutes',
            image: 'img/page-card-img/burning-mountain.jpg',
            highlights: ['Eternal Fire', 'Natural Gas', 'Unique Phenomenon'],
            bestTimeToVisit: 'Year-round',
            activities: ['Fire Viewing', 'Photography', 'Nature Walk']
        }
    ];
}

export function getSampleContent() {
    return [
        {
            id: 'welcome-page',
            title: 'Welcome to BakuGo Tour',
            excerpt: 'Discover the beauty of Azerbaijan with our guided tours...',
            type: 'page',
            author: 'Admin',
            createdDate: '2024-01-15',
            status: 'published',
            content: 'Welcome to BakuGo Tour, your gateway to exploring the rich culture and stunning landscapes of Azerbaijan...'
        },
        {
            id: 'gobustan-guide',
            title: 'Complete Guide to Gobustan National Park',
            excerpt: 'Everything you need to know about visiting Gobustan...',
            type: 'blog',
            author: 'Tour Guide',
            createdDate: '2024-01-20',
            status: 'published',
            content: 'Gobustan National Park is one of Azerbaijan\'s most fascinating destinations...'
        },
        {
            id: 'new-tours-announcement',
            title: 'New Tour Packages Available',
            excerpt: 'Check out our latest tour offerings for 2024...',
            type: 'announcement',
            author: 'Marketing Team',
            createdDate: '2024-02-01',
            status: 'published',
            content: 'We\'re excited to announce our new tour packages...'
        },
        {
            id: 'winter-tourism-news',
            title: 'Winter Tourism in Azerbaijan',
            excerpt: 'Exploring Azerbaijan\'s winter destinations...',
            type: 'news',
            author: 'Travel Writer',
            createdDate: '2024-02-10',
            status: 'draft',
            content: 'Winter in Azerbaijan offers unique experiences...'
        }
    ];
}

/**
 * Mixin function to add data methods to AdminPanel
 */
export function mixinDataMethods(AdminPanelClass) {
    AdminPanelClass.prototype.getSampleTours = getSampleTours;
    AdminPanelClass.prototype.getSampleDestinations = getSampleDestinations;
    AdminPanelClass.prototype.getSampleContent = getSampleContent;
    AdminPanelClass.prototype.getSampleBookings = getSampleBookings;
    AdminPanelClass.prototype.getSampleReviews = getSampleReviews;
    AdminPanelClass.prototype.getSamplePromoCodes = getSamplePromoCodes;
    AdminPanelClass.prototype.getSampleCustomers = getSampleCustomers;
}

