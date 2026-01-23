
// Simulated data for trends
const MOCK_DATA = {
    youtube: [
        {
            id: 1,
            title: 'Travel Vlog: Japan',
            views: '3.1M',
            growth: '+200%',
            category: 'Travel',
            history: [
                { month: 'Jan', value: 40 }, { month: 'Feb', value: 50 }, { month: 'Mar', value: 65 },
                { month: 'Apr', value: 80 }, { month: 'May', value: 100 }, { month: 'Jun', value: 120 },
                { month: 'Jul', value: 150 }, { month: 'Aug', value: 180 }, { month: 'Sep', value: 200 },
                { month: 'Oct', value: 220 }, { month: 'Nov', value: 210 }, { month: 'Dec', value: 200 }
            ]
        },
        {
            id: 2,
            title: 'AI Tools 2024',
            views: '2.5M',
            growth: '+150%',
            category: 'Tech',
            history: [
                { month: 'Jan', value: 20 }, { month: 'Feb', value: 35 }, { month: 'Mar', value: 60 },
                { month: 'Apr', value: 80 }, { month: 'May', value: 110 }, { month: 'Jun', value: 130 },
                { month: 'Jul', value: 140 }, { month: 'Aug', value: 135 }, { month: 'Sep', value: 150 },
                { month: 'Oct', value: 160 }, { month: 'Nov', value: 170 }, { month: 'Dec', value: 180 }
            ]
        },
        {
            id: 3,
            title: 'Healthy Meal Prep',
            views: '1.2M',
            growth: '+80%',
            category: 'Food',
            history: [
                { month: 'Jan', value: 80 }, { month: 'Feb', value: 75 }, { month: 'Mar', value: 70 },
                { month: 'Apr', value: 85 }, { month: 'May', value: 90 }, { month: 'Jun', value: 95 },
                { month: 'Jul', value: 90 }, { month: 'Aug', value: 85 }, { month: 'Sep', value: 100 },
                { month: 'Oct', value: 110 }, { month: 'Nov', value: 105 }, { month: 'Dec', value: 95 }
            ]
        },
        {
            id: 4,
            title: 'Minimalist Setup Tour',
            views: '850K',
            growth: '+45%',
            category: 'Lifestyle',
            history: [
                { month: 'Jan', value: 30 }, { month: 'Feb', value: 40 }, { month: 'Mar', value: 45 },
                { month: 'Apr', value: 50 }, { month: 'May', value: 60 }, { month: 'Jun', value: 65 },
                { month: 'Jul', value: 70 }, { month: 'Aug', value: 75 }, { month: 'Sep', value: 80 },
                { month: 'Oct', value: 85 }, { month: 'Nov', value: 90 }, { month: 'Dec', value: 85 }
            ]
        },
    ],
    youtube_music: [
        { id: 1, title: 'Seven', artist: 'Jung Kook', uses: '500M+ Views' },
        { id: 2, title: 'Vampire', artist: 'Olivia Rodrigo', uses: '200M+ Views' },
        { id: 3, title: 'Cruel Summer', artist: 'Taylor Swift', uses: '900M+ Views' },
        { id: 4, title: 'Flowers', artist: 'Miley Cyrus', uses: '850M+ Views' },
        { id: 5, title: 'Anti-Hero', artist: 'Taylor Swift', uses: '400M+ Views' }
    ],
    tiktok: [
        {
            id: 1,
            topic: '#GrimaceShake',
            posts: '500K',
            trend_score: 98,
            generated_idea: "For this trend: Prepare a purple-colored drink (like a blackberry milkshake) and fall to the ground after drinking it with a funny editing style as if you 'fainted' or 'transformed'. Don't forget to add that suspenseful music in the background!",
            history: [
                { month: 'Jan', value: 10 }, { month: 'Feb', value: 20 }, { month: 'Mar', value: 50 },
                { month: 'Apr', value: 100 }, { month: 'May', value: 150 }, { month: 'Jun', value: 200 },
                { month: 'Jul', value: 250 }, { month: 'Aug', value: 220 }, { month: 'Sep', value: 180 },
                { month: 'Oct', value: 100 }, { month: 'Nov', value: 50 }, { month: 'Dec', value: 20 }
            ]
        },
        {
            id: 2,
            topic: '#RomanEmpire',
            posts: '1.2M',
            trend_score: 95,
            generated_idea: "Go to your partner, father, or brother and ask this question while recording: 'How often do you think about the Roman Empire?'. Record the answer and show your surprise.",
            history: [
                { month: 'Jan', value: 5 }, { month: 'Feb', value: 10 }, { month: 'Mar', value: 15 },
                { month: 'Apr', value: 20 }, { month: 'May', value: 50 }, { month: 'Jun', value: 100 },
                { month: 'Jul', value: 150 }, { month: 'Aug', value: 200 }, { month: 'Sep', value: 250 },
                { month: 'Oct', value: 300 }, { month: 'Nov', value: 280 }, { month: 'Dec', value: 250 }
            ]
        },
        {
            id: 3,
            topic: 'Dance Challenge X',
            posts: '750K',
            trend_score: 88,
            generated_idea: "Shoot a 'tutorial' video focusing on the footwork of this dance. Show it step-by-step by slowing down the speed, as people save these types of videos a lot to learn.",
            history: [
                { month: 'Jan', value: 80 }, { month: 'Feb', value: 90 }, { month: 'Mar', value: 100 },
                { month: 'Apr', value: 120 }, { month: 'May', value: 150 }, { month: 'Jun', value: 140 },
                { month: 'Jul', value: 130 }, { month: 'Aug', value: 120 }, { month: 'Sep', value: 110 },
                { month: 'Oct', value: 100 }, { month: 'Nov', value: 200 }, { month: 'Dec', value: 150 }
            ]
        },
    ],
    tiktok_music: [
        { id: 1, title: 'Paint The Town Red', artist: 'Doja Cat', uses: '2.1M' },
        { id: 2, title: 'Strangers', artist: 'Kenya Grace', uses: '1.5M' },
        { id: 3, title: 'Water', artist: 'Tyla', uses: '800K' },
        { id: 4, title: 'Prada', artist: 'cassö, RAYE, D-Block Europe', uses: '600K' },
        { id: 5, title: 'Greedy', artist: 'Tate McRae', uses: '450K' }
    ],
    twitter: [
        {
            id: 1,
            hashtag: '#TechNews',
            volume: '120K Tweets',
            description: 'Most tweets about this topic are positive. People are eagerly waiting for this development. You can prepare a thread expressing your views on this topic.',
            sentiment: { positive: 70, neutral: 20, negative: 10 },
            rt_analysis: [
                45, 50, 55, 60, 40, 35, 30, 45, 60, 80, 100, 120,
                110, 90, 85, 95, 130, 150, 140, 120, 100, 90, 80, 70
            ],
            history: [
                { month: 'Jan', value: 100 }, { month: 'Feb', value: 120 }, { month: 'Mar', value: 150 },
                { month: 'Apr', value: 130 }, { month: 'May', value: 140 }, { month: 'Jun', value: 160 },
                { month: 'Jul', value: 180 }, { month: 'Aug', value: 200 }, { month: 'Sep', value: 220 },
                { month: 'Oct', value: 240 }, { month: 'Nov', value: 260 }, { month: 'Dec', value: 280 }
            ]
        },
        {
            id: 2,
            hashtag: '#MondayMotivation',
            volume: '80K Tweets',
            description: 'High energy for the start of the week. Great time to share motivational visuals and short quotes. You can also create your own hashtag.',
            sentiment: { positive: 90, neutral: 5, negative: 5 },
            rt_analysis: [
                20, 25, 30, 35, 40, 45, 50, 60, 70, 65, 60, 55,
                50, 45, 40, 50, 60, 75, 80, 70, 60, 50, 40, 30
            ],
            history: [
                { month: 'Jan', value: 80 }, { month: 'Feb', value: 85 }, { month: 'Mar', value: 90 },
                { month: 'Apr', value: 80 }, { month: 'May', value: 85 }, { month: 'Jun', value: 80 },
                { month: 'Jul', value: 75 }, { month: 'Aug', value: 80 }, { month: 'Sep', value: 85 },
                { month: 'Oct', value: 90 }, { month: 'Nov', value: 95 }, { month: 'Dec', value: 100 }
            ]
        },
        {
            id: 3,
            hashtag: '#NewRelease',
            volume: '250K Tweets',
            description: 'Discussions about new content releases are heated. You can create a review post or a poll without giving spoilers.',
            sentiment: { positive: 45, neutral: 30, negative: 25 },
            rt_analysis: [
                80, 90, 100, 120, 140, 160, 180, 200, 220, 240, 250, 230,
                210, 190, 170, 150, 140, 130, 120, 110, 100, 90, 80, 70
            ],
            history: [
                { month: 'Jan', value: 50 }, { month: 'Feb', value: 60 }, { month: 'Mar', value: 100 },
                { month: 'Apr', value: 150 }, { month: 'May', value: 200 }, { month: 'Jun', value: 180 },
                { month: 'Jul', value: 160 }, { month: 'Aug', value: 140 }, { month: 'Sep', value: 200 },
                { month: 'Oct', value: 250 }, { month: 'Nov', value: 300 }, { month: 'Dec', value: 280 }
            ]
        },
    ],
    twitter_suggestions: [
        { id: 1, type: 'Thread', content: 'Prepare a 5-tweet thread explaining tech trends.', icon: 'Type' },
        { id: 2, type: 'Poll', content: 'Start a "Do you think AI will take our jobs?" poll.', icon: 'CheckSquare' },
        { id: 3, type: 'Media', content: 'Share a short video showing your office setup.', icon: 'Image' }
    ],
    instagram: [
        {
            id: 1,
            type: 'reels',
            title: 'Summer Vibes',
            views: '1.5M',
            audio: 'Trending Audio #4',
            history: [
                { month: 'Jan', value: 20 }, { month: 'Feb', value: 30 }, { month: 'Mar', value: 45 },
                { month: 'Apr', value: 60 }, { month: 'May', value: 80 }, { month: 'Jun', value: 95 },
                { month: 'Jul', value: 100 }, { month: 'Aug', value: 90 }, { month: 'Sep', value: 75 },
                { month: 'Oct', value: 60 }, { month: 'Nov', value: 50 }, { month: 'Dec', value: 40 }
            ]
        },
        {
            id: 2,
            type: 'story',
            title: 'Poll: Coffee vs Tea',
            interactions: '45K',
            template: 'Versus',
            history: [
                { month: 'Jan', value: 40 }, { month: 'Feb', value: 45 }, { month: 'Mar', value: 50 },
                { month: 'Apr', value: 55 }, { month: 'May', value: 60 }, { month: 'Jun', value: 65 },
                { month: 'Jul', value: 70 }, { month: 'Aug', value: 80 }, { month: 'Sep', value: 85 },
                { month: 'Oct', value: 90 }, { month: 'Nov', value: 95 }, { month: 'Dec', value: 100 }
            ]
        }
    ],
    linkedin: [
        {
            id: 1,
            topic: 'Remote Work Harmony',
            industry: 'Business',
            growth: '+40%',
            engagement_rate: '3.2%',
            top_demographic: 'HR Managers',
            history: [
                { month: 'Oca', value: 20 },
                { month: 'Feb', value: 35 },
                { month: 'Mar', value: 45 },
                { month: 'Apr', value: 40 },
                { month: 'May', value: 60 },
                { month: 'Jun', value: 85 },
                { month: 'Tem', value: 80 },
                { month: 'Aug', value: 75 },
                { month: 'Eyl', value: 90 },
                { month: 'Oct', value: 95 },
                { month: 'Nov', value: 88 },
                { month: 'Dec', value: 92 }
            ]
        },
        {
            id: 2,
            topic: 'AI Ethics in 2024',
            industry: 'Tech',
            growth: '+150%',
            engagement_rate: '5.8%',
            top_demographic: 'Developers',
            history: [
                { month: 'Oca', value: 10 },
                { month: 'Feb', value: 25 },
                { month: 'Mar', value: 50 },
                { month: 'Apr', value: 80 },
                { month: 'May', value: 95 },
                { month: 'Jun', value: 100 },
                { month: 'Tem', value: 90 },
                { month: 'Aug', value: 85 },
                { month: 'Eyl', value: 92 },
                { month: 'Oct', value: 98 },
                { month: 'Nov', value: 100 },
                { month: 'Dec', value: 100 }
            ]
        },
        {
            id: 3,
            topic: 'Sustainable Leadership',
            industry: 'Management',
            growth: '+60%',
            engagement_rate: '4.1%',
            top_demographic: 'Execs',
            history: [
                { month: 'Oca', value: 30 },
                { month: 'Feb', value: 40 },
                { month: 'Mar', value: 45 },
                { month: 'Apr', value: 55 },
                { month: 'May', value: 65 },
                { month: 'Jun', value: 75 },
                { month: 'Tem', value: 60 },
                { month: 'Aug', value: 50 },
                { month: 'Eyl', value: 70 },
                { month: 'Oct', value: 85 },
                { month: 'Nov', value: 90 },
                { month: 'Dec', value: 95 }
            ]
        }
    ],
    pinterest: [
        {
            id: 1,
            topic: 'Minimalist Home Office',
            category: 'Interior Design',
            pins: '50K+',
            saves: '12K',
            impression_growth: '+85%',
            history: [
                { month: 'Jan', value: 20 }, { month: 'Feb', value: 30 }, { month: 'Mar', value: 50 },
                { month: 'Apr', value: 70 }, { month: 'May', value: 80 }, { month: 'Jun', value: 90 },
                { month: 'Jul', value: 95 }, { month: 'Aug', value: 90 }, { month: 'Sep', value: 85 },
                { month: 'Oct', value: 80 }, { month: 'Nov', value: 75 }, { month: 'Dec', value: 70 }
            ]
        },
        {
            id: 2,
            topic: 'Healthy Bento Box',
            category: 'Food',
            pins: '120K+',
            saves: '45K',
            impression_growth: '+110%',
            history: [
                { month: 'Jan', value: 60 }, { month: 'Feb', value: 70 }, { month: 'Mar', value: 80 },
                { month: 'Apr', value: 90 }, { month: 'May', value: 100 }, { month: 'Jun', value: 110 },
                { month: 'Jul', value: 120 }, { month: 'Aug', value: 130 }, { month: 'Sep', value: 125 },
                { month: 'Oct', value: 120 }, { month: 'Nov', value: 115 }, { month: 'Dec', value: 110 }
            ]
        },
        {
            id: 3,
            topic: 'Capsule Wardrobe Spring',
            category: 'Fashion',
            pins: '80K+',
            saves: '28K',
            impression_growth: '+60%',
            history: [
                { month: 'Jan', value: 40 }, { month: 'Feb', value: 50 }, { month: 'Mar', value: 60 },
                { month: 'Apr', value: 80 }, { month: 'May', value: 100 }, { month: 'Jun', value: 90 },
                { month: 'Jul', value: 80 }, { month: 'Aug', value: 70 }, { month: 'Sep', value: 60 },
                { month: 'Oct', value: 50 }, { month: 'Nov', value: 40 }, { month: 'Dec', value: 30 }
            ]
        }
    ],
    pinterest_colors: [
        { name: 'Peach Fuzz', hex: '#FFBE98' },
        { name: 'Mint Green', hex: '#98FF98' },
        { name: 'Deep Burgundy', hex: '#800020' },
        { name: 'Sky Blue', hex: '#87CEEB' }
    ],
    instagram_categories: [
        {
            id: 1,
            category: 'Fashion',
            topic: 'Outfit Videos',
            history: [
                { month: 'Jan', value: 30 }, { month: 'Feb', value: 40 }, { month: 'Mar', value: 50 },
                { month: 'Apr', value: 70 }, { month: 'May', value: 85 }, { month: 'Jun', value: 95 },
                { month: 'Jul', value: 100 }, { month: 'Aug', value: 90 }, { month: 'Sep', value: 80 },
                { month: 'Oct', value: 70 }, { month: 'Nov', value: 60 }, { month: 'Dec', value: 50 }
            ]
        },
        {
            id: 2,
            category: 'Food',
            topic: 'Quick Recipes',
            history: [
                { month: 'Jan', value: 50 }, { month: 'Feb', value: 55 }, { month: 'Mar', value: 60 },
                { month: 'Apr', value: 65 }, { month: 'May', value: 70 }, { month: 'Jun', value: 80 },
                { month: 'Jul', value: 85 }, { month: 'Aug', value: 90 }, { month: 'Sep', value: 95 },
                { month: 'Oct', value: 100 }, { month: 'Nov', value: 90 }, { month: 'Dec', value: 80 }
            ]
        },
        {
            id: 3,
            category: 'Travel',
            topic: 'Hidden Spots',
            history: [
                { month: 'Jan', value: 20 }, { month: 'Feb', value: 30 }, { month: 'Mar', value: 40 },
                { month: 'Apr', value: 60 }, { month: 'May', value: 80 }, { month: 'Jun', value: 100 },
                { month: 'Jul', value: 100 }, { month: 'Aug', value: 100 }, { month: 'Sep', value: 90 },
                { month: 'Oct', value: 60 }, { month: 'Nov', value: 40 }, { month: 'Dec', value: 30 }
            ]
        },
        {
            id: 4,
            category: 'Humor',
            topic: 'Office Life',
            history: [
                { month: 'Jan', value: 60 }, { month: 'Feb', value: 65 }, { month: 'Mar', value: 70 },
                { month: 'Apr', value: 75 }, { month: 'May', value: 80 }, { month: 'Jun', value: 85 },
                { month: 'Jul', value: 90 }, { month: 'Aug', value: 85 }, { month: 'Sep', value: 95 },
                { month: 'Oct', value: 100 }, { month: 'Nov', value: 90 }, { month: 'Dec', value: 95 }
            ]
        },
        {
            id: 5,
            category: 'Tech',
            topic: 'Daily Hacks',
            history: [
                { month: 'Jan', value: 40 }, { month: 'Feb', value: 50 }, { month: 'Mar', value: 60 },
                { month: 'Apr', value: 70 }, { month: 'May', value: 80 }, { month: 'Jun', value: 90 },
                { month: 'Jul', value: 95 }, { month: 'Aug', value: 90 }, { month: 'Sep', value: 85 },
                { month: 'Oct', value: 80 }, { month: 'Nov', value: 75 }, { month: 'Dec', value: 70 }
            ]
        },
        {
            id: 6,
            category: 'Sports',
            topic: '15 Min Workout',
            history: [
                { month: 'Jan', value: 100 }, { month: 'Feb', value: 90 }, { month: 'Mar', value: 80 },
                { month: 'Apr', value: 70 }, { month: 'May', value: 85 }, { month: 'Jun', value: 95 },
                { month: 'Jul', value: 90 }, { month: 'Aug', value: 85 }, { month: 'Sep', value: 80 },
                { month: 'Oct', value: 70 }, { month: 'Nov', value: 60 }, { month: 'Dec', value: 90 }
            ]
        },
        {
            id: 7,
            category: 'Books',
            topic: 'Staff Pick',
            history: [
                { month: 'Jan', value: 50 }, { month: 'Feb', value: 55 }, { month: 'Mar', value: 50 },
                { month: 'Apr', value: 45 }, { month: 'May', value: 50 }, { month: 'Jun', value: 60 },
                { month: 'Jul', value: 70 }, { month: 'Aug', value: 75 }, { month: 'Sep', value: 80 },
                { month: 'Oct', value: 85 }, { month: 'Nov', value: 90 }, { month: 'Dec', value: 95 }
            ]
        },
        {
            id: 8,
            category: 'Motivation',
            topic: 'Quote of the Day',
            history: [
                { month: 'Jan', value: 80 }, { month: 'Feb', value: 85 }, { month: 'Mar', value: 80 },
                { month: 'Apr', value: 75 }, { month: 'May', value: 80 }, { month: 'Jun', value: 85 },
                { month: 'Jul', value: 80 }, { month: 'Aug', value: 75 }, { month: 'Sep', value: 85 },
                { month: 'Oct', value: 90 }, { month: 'Nov', value: 95 }, { month: 'Dec', value: 90 }
            ]
        },
        {
            id: 9,
            category: 'Art',
            topic: 'Sketch Sharing',
            history: [
                { month: 'Jan', value: 30 }, { month: 'Feb', value: 35 }, { month: 'Mar', value: 40 },
                { month: 'Apr', value: 50 }, { month: 'May', value: 55 }, { month: 'Jun', value: 60 },
                { month: 'Jul', value: 65 }, { month: 'Aug', value: 70 }, { month: 'Sep', value: 75 },
                { month: 'Oct', value: 80 }, { month: 'Nov', value: 85 }, { month: 'Dec', value: 90 }
            ]
        }
    ],
    hashtags: [
        { id: 1, tag: '#ArtificialIntelligence', volume: '2.1M', growth: '+300%' },
        { id: 2, tag: '#SummerFlavors', volume: '500K', growth: '+45%' },
        { id: 4, tag: '#ViralDance', volume: '850K', growth: '+90%' },
        { id: 5, tag: '#Entrepreneurship', volume: '300K', growth: '+25%' }
    ]

};

export const TrendService = {
    getPlatformTrends: async (platform, timeframe = 'monthly') => {
        // Helper to parse '2.5M', '500K' to numbers
        const parseValue = (str) => {
            if (!str) return 0;
            const s = str.toString().toUpperCase();
            if (s.includes('M')) return parseFloat(s.replace('M', '')) * 1000000;
            if (s.includes('K')) return parseFloat(s.replace('K', '')) * 1000;
            return parseFloat(s) || 0;
        };

        // Helper to adjust data based on timeframe
        const adjustByTimeframe = (item, timeframe) => {
            const modifiers = {
                'hourly': { scale: 0.05, growthScale: 0.1, suffix: ' (1h)' },
                'daily': { scale: 0.2, growthScale: 0.3, suffix: ' (24h)' },
                'weekly': { scale: 0.5, growthScale: 0.6, suffix: ' (7d)' },
                'monthly': { scale: 1, growthScale: 1, suffix: '' }
            };

            const mod = modifiers[timeframe] || modifiers['monthly'];
            const newItem = { ...item };

            // Adjust values if they exist
            if (newItem.views) {
                const val = parseValue(newItem.views) * mod.scale;
                newItem.views = val > 1000000 ? (val / 1000000).toFixed(1) + 'M' : (val / 1000).toFixed(0) + 'K';
            }
            if (newItem.posts) {
                const val = parseValue(newItem.posts) * mod.scale;
                newItem.posts = val > 1000000 ? (val / 1000000).toFixed(1) + 'M' : (val / 1000).toFixed(0) + 'K';
            }
            if (newItem.volume) {
                const val = parseValue(newItem.volume) * mod.scale;
                newItem.volume = val > 1000000 ? (val / 1000000).toFixed(1) + 'M' : (val / 1000).toFixed(0) + 'K';
                if (newItem.volume.includes('K')) newItem.volume += ' Tweets';
            }
            if (newItem.pins) {
                const val = parseValue(newItem.pins) * mod.scale;
                newItem.pins = val > 1000000 ? (val / 1000000).toFixed(1) + 'M+' : (val / 1000).toFixed(0) + 'K+';
            }
            if (newItem.saves) {
                const val = parseValue(newItem.saves) * mod.scale;
                newItem.saves = val > 1000000 ? (val / 1000000).toFixed(1) + 'M' : (val / 1000).toFixed(0) + 'K';
            }

            // Adjust growth percentages
            if (newItem.growth && typeof newItem.growth === 'string') {
                const gVal = parseInt(newItem.growth.replace('+', '').replace('%', ''));
                newItem.growth = `+${Math.round(gVal * mod.growthScale)}%`;
            }
            if (newItem.impression_growth && typeof newItem.impression_growth === 'string') {
                const gVal = parseInt(newItem.impression_growth.replace('+', '').replace('%', ''));
                newItem.impression_growth = `+${Math.round(gVal * mod.growthScale)}%`;
            }

            return newItem;
        };

        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                let data = (MOCK_DATA[platform] || []).map(item => adjustByTimeframe(item, timeframe));

                // Sort logic based on platform
                if (platform === 'youtube') {
                    data.sort((a, b) => parseValue(b.views) - parseValue(a.views));
                } else if (platform === 'tiktok') {
                    data.sort((a, b) => parseValue(b.posts) - parseValue(a.posts));
                } else if (platform === 'twitter') {
                    data.sort((a, b) => parseValue(b.volume) - parseValue(a.volume));
                } else if (platform === 'instagram') {
                    data.sort((a, b) => parseValue(b.views || b.interactions) - parseValue(a.views || a.interactions));
                }

                resolve(data);
            }, 500);
        });
    },

    getAllTrends: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_DATA);
            }, 800);
        });
    },

    getTimeframeHighlights: async (timeframe) => {
        // timeframe: 'daily' (24h) or 'weekly' (7d)
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = [];
                const platforms = ['youtube', 'tiktok', 'twitter', 'instagram', 'linkedin', 'pinterest'];

                platforms.forEach(p => {
                    const platformData = (MOCK_DATA[p] || []).slice(0, 1); // Get top 1 from each
                    platformData.forEach(item => {
                        // Simulate data adjustment for timeframe
                        const scale = timeframe === 'daily' ? 0.2 : 0.5;
                        const newItem = { ...item, platform: p };

                        // Pick a display value based on platform
                        if (p === 'youtube') newItem.displayValue = item.views;
                        else if (p === 'tiktok') newItem.displayValue = item.posts;
                        else if (p === 'twitter') newItem.displayValue = item.volume;
                        else if (p === 'instagram') newItem.displayValue = item.views || item.interactions;
                        else if (p === 'linkedin') newItem.displayValue = item.growth;
                        else if (p === 'pinterest') newItem.displayValue = item.impression_growth;

                        results.push(newItem);
                    });
                });

                resolve(results);
            }, 400);
        });
    },

    getTrendingHashtags: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_DATA.hashtags || []);
            }, 300);
        })
    },

    generateIdea: (trend) => {
        const templates = [
            `Create a "How-to" video about ${trend.title || trend.topic}`,
            `React to ${trend.title || trend.topic} with your unique perspective`,
            `Short form content: 5 facts about ${trend.title || trend.topic}`,
            `Behind the scenes look at ${trend.title || trend.topic}`
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    },

    getContentIdeas: async (platform) => {
        const IDEAS = {
            youtube: [
                { id: 1, title: 'Vlog: Weekly Summary', desc: 'Shoot a video commenting on the most talked-about trends of this week.', difficulty: 'Easy' },
                { id: 2, title: 'Shorts: Behind the Scenes', desc: 'Show your content production process in a fast-forwarded way.', difficulty: 'Medium' },
                { id: 3, title: 'Livestream Q&A', desc: 'Do an AMA (Ask Me Anything) to increase interaction with your followers.', difficulty: 'Hard' }
            ],
            tiktok: [
                { id: 1, title: 'Trend Adaptation', desc: 'Adapt a viral sound from the agenda to your niche.', difficulty: 'Easy' },
                { id: 2, title: 'Duet Video', desc: 'React to a popular video or interact with it.', difficulty: 'Easy' },
                { id: 3, title: 'Educational Series', desc: 'Start a 3-part mini information series.', difficulty: 'Medium' }
            ],
            twitter: [
                { id: 1, title: 'Info Thread', desc: 'List 5 unknown facts about your industry.', difficulty: 'Medium' },
                { id: 2, title: 'Start a Poll', desc: 'Ask a controversial but fun question that will split your followers into two.', difficulty: 'Easy' },
                { id: 3, title: 'Agenda Comment', desc: 'Express a brief and concise opinion about the #Hashtag in the trend list.', difficulty: 'Easy' }
            ],
            instagram: [
                { id: 1, title: 'Reels: Transition Video', desc: 'Shoot a dynamic Reels with clothing or location change transitions.', difficulty: 'Hard' },
                { id: 2, title: 'Story: Poll', desc: 'Use interactive stickers asking followers about their plans for the day.', difficulty: 'Easy' },
                { id: 3, title: 'Post: Carousel', desc: 'Share a story or info with a sliding post.', difficulty: 'Medium' }
            ],
            linkedin: [
                { id: 1, title: 'Industrial Analysis', desc: 'Comment on the most important business development of the week.', difficulty: 'Hard' },
                { id: 2, title: 'Behind the Scenes', desc: 'A sincere post introducing your workspace or team.', difficulty: 'Easy' },
                { id: 3, title: 'Success Story', desc: 'Tell how you overcame a challenge you faced.', difficulty: 'Medium' }
            ],
            pinterest: [
                { id: 1, title: 'Infographic', desc: 'Prepare a long pin explaining a complex topic with simple visuals.', difficulty: 'Hard' },
                { id: 2, title: 'Moodboard', desc: 'Create an inspiration board containing next month\'s color palette.', difficulty: 'Easy' },
                { id: 3, title: 'Step-by-Step Guide', desc: 'Show a DIY project step by step with photos.', difficulty: 'Medium' }
            ]
        };

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(IDEAS[platform] || []);
            }, 400);
        });
    },

    searchTrends: async (query, platformContext = null) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = [];
                const q = query.toLowerCase();

                // Helper to enrich data with lifecycle
                const enrich = (item, platform) => {
                    // Random lifecycle generation for demo
                    const statuses = ['Rising', 'Peak', 'Falling'];
                    const status = statuses[Math.floor(Math.random() * statuses.length)];

                    let score, summary;
                    let endDate = new Date();
                    const startDate = new Date();
                    startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 3));

                    if (status === 'Rising') {
                        score = 85 + Math.floor(Math.random() * 15);
                        endDate.setMonth(endDate.getMonth() + 2);
                        summary = "This trend hasn't reached saturation yet. A great time to be an early adopter!";
                    } else if (status === 'Peak') {
                        score = 90 + Math.floor(Math.random() * 10);
                        endDate.setMonth(endDate.getMonth() + 1);
                        summary = "Everyone is talking about this now. High views guaranteed if you create content, but competition is fierce.";
                    } else {
                        score = 30 + Math.floor(Math.random() * 30);
                        endDate.setDate(endDate.getDate() + 7);
                        summary = "This trend is about to go out of style. We recommend focusing on other topics.";
                    }

                    return {
                        ...item,
                        platform,
                        lifecycle: {
                            status,
                            validityScore: score,
                            startDate: startDate.toLocaleDateString('en-US'),
                            endDate: endDate.toLocaleDateString('en-US'),
                            summary
                        }
                    };
                };

                // Helper to check match
                const isMatch = (item) => {
                    const text = item.title || item.topic || item.hashtag || item.description || '';
                    return text.toLowerCase().includes(q);
                };

                if (platformContext && MOCK_DATA[platformContext]) {
                    // Search specific platform
                    MOCK_DATA[platformContext].forEach(item => {
                        if (isMatch(item)) results.push(enrich(item, platformContext));
                    });
                } else {
                    // Search all
                    Object.keys(MOCK_DATA).forEach(key => {
                        if (Array.isArray(MOCK_DATA[key])) {
                            MOCK_DATA[key].forEach(item => {
                                if (isMatch(item)) results.push(enrich(item, key));
                            });
                        }
                    });
                }

                resolve(results);
            }, 600);
        });
    }
};


