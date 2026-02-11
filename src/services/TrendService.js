
// Simulated data for trends
const MOCK_DATA = {
    youtube: [
        {
            id: 'yt-1',
            title: 'I Built a 100% Sustainable House in 24h',
            views: '12M',
            growth: '+450%',
            category: 'Challenges',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 50 + Math.random() * 200 }))
        },
        {
            id: 'yt-2',
            title: 'Is This the End of Generative AI?',
            views: '5.2M',
            growth: '+120%',
            category: 'Tech/Documentary',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 80 + Math.random() * 150 }))
        },
        {
            id: 'yt-3',
            title: 'Top 10 Hidden Gem Destinations for 2026',
            views: '2.1M',
            growth: '+85%',
            category: 'Travel',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 30 + Math.random() * 100 }))
        }
    ],
    tiktok: [
        {
            id: 'tk-1',
            topic: '#SilentReview',
            volume: '8.5M',
            growth: '+99%',
            generated_idea: "Ürünleri hiç konuşmadan sadece jest ve mimiklerle incelediğin bir video çek. Arka plana 'Lo-fi beats' eklemeyi unutma!",
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 100 + Math.random() * 300 }))
        },
        {
            id: 'tk-2',
            topic: '#AestheticMorningRoutine',
            volume: '4.2M',
            growth: '+96%',
            generated_idea: "Sabah rutinini 'cinematic' açılarla çek. Kahve yapımı ve gün doğumu görüntüleri etkileşimi artıracaktır.",
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 50 + Math.random() * 200 }))
        }
    ],
    twitter: [
        {
            id: 'tw-1',
            hashtag: '#NewSpaceRace',
            volume: '450K Tweets',
            description: "Mars yolculuğu ve özel uzay şirketleri hakkındaki tartışmalar hızla artıyor. Teknoloji meraklıları için harika bir 'thread' konusu.",
            sentiment: { positive: 65, neutral: 25, negative: 10 },
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 200 + Math.random() * 500 }))
        },
        {
            id: 'tw-2',
            hashtag: '#WFHRevolution',
            volume: '120K Tweets',
            description: "Uzaktan çalışma modelleri ve ofis hayatına dönüş çatışması yeniden gündemde. Çalışan hakları odağında yorum yapabilirsin.",
            sentiment: { positive: 40, neutral: 40, negative: 20 },
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 100 + Math.random() * 300 }))
        }
    ],
    instagram: [
        {
            id: 'ig-1',
            type: 'reels',
            title: 'Minimalist Fashion Haul',
            views: '4.1M',
            audio: 'Cinematic Piano #2',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 60 + Math.random() * 200 }))
        },
        {
            id: 'ig-2',
            type: 'reels',
            title: '15 Min Home Workout',
            views: '2.8M',
            audio: 'Upbeat Tech-House',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 80 + Math.random() * 150 }))
        }
    ],
    linkedin: [
        {
            id: 'li-1',
            topic: 'AI Ethics in Leadership',
            industry: 'Corporate',
            growth: '+140%',
            engagement_rate: '6.2%',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 40 + Math.random() * 100 }))
        },
        {
            id: 'li-2',
            topic: 'The Future of Sustainable Energy',
            industry: 'Energy',
            growth: '+95%',
            engagement_rate: '4.5%',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 30 + Math.random() * 120 }))
        },
        {
            id: 'li-3',
            topic: 'Workplace Wellness 2026',
            industry: 'HR/Management',
            growth: '+110%',
            engagement_rate: '5.8%',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 45 + Math.random() * 90 }))
        },
        {
            id: 'li-4',
            topic: 'Decentralized Finance Growth',
            industry: 'Fintech',
            growth: '+165%',
            engagement_rate: '7.1%',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 55 + Math.random() * 110 }))
        },
        {
            id: 'li-5',
            topic: 'Skills Over Degrees Trend',
            industry: 'Education',
            growth: '+80%',
            engagement_rate: '4.9%',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 35 + Math.random() * 85 }))
        },
        {
            id: 'li-6',
            topic: 'Hybrid Work Culture 2.0',
            industry: 'HR/Management',
            growth: '+105%',
            engagement_rate: '6.5%',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 50 + Math.random() * 110 }))
        },
        {
            id: 'li-7',
            topic: 'Generative AI in Marketing',
            industry: 'Marketing',
            growth: '+200%',
            engagement_rate: '8.1%',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 60 + Math.random() * 150 }))
        }
    ],
    pinterest: [
        {
            id: 'pin-1',
            topic: 'Modern Japandi Living Room',
            category: 'Home Decor',
            pins: '250K+',
            impression_growth: '+320%',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 50 + Math.random() * 200 }))
        },
        {
            id: 'pin-2',
            topic: 'Digital Nomad Travel Gear',
            category: 'Tech/Travel',
            pins: '120K+',
            impression_growth: '+110%',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 40 + Math.random() * 150 }))
        },
        {
            id: 'pin-3',
            topic: 'Sustainable Fashion DIY',
            category: 'Fashion',
            pins: '180K+',
            impression_growth: '+210%',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 60 + Math.random() * 180 }))
        },
        {
            id: 'pin-4',
            topic: 'Plant-Based Party Snacks',
            category: 'Food',
            pins: '300K+',
            impression_growth: '+150%',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 70 + Math.random() * 220 }))
        },
        {
            id: 'pin-5',
            topic: 'Cyberpunk Aesthetic Art',
            category: 'Art/Design',
            pins: '90K+',
            impression_growth: '+130%',
            history: Array(12).fill(0).map((_, i) => ({ month: i, value: 45 + Math.random() * 140 }))
        }
    ],
    hashtags: [
        { id: 1, tag: '#FutureOfTech', volume: '1.2M', growth: '+250%' },
        { id: 2, tag: '#HealthyLiving', volume: '850K', growth: '+120%' },
        { id: 3, tag: '#DigitalMarketing2026', volume: '600K', growth: '+90%' },
        { id: 4, tag: '#Sustainability', volume: '2.1M', growth: '+300%' }
    ],
    tiktok_music: [
        { id: 'tm-1', title: 'Summer Breeze', artist: 'Lofi Girl', uses: '1.2M' },
        { id: 'tm-2', title: 'Neon Nights', artist: 'Synth Wave', uses: '850K' },
        { id: 'tm-3', title: 'Coffee Shop', artist: 'Chill Beats', uses: '600K' }
    ],
    youtube_music: [
        { id: 'ym-1', title: 'Global Anthem', artist: 'Top Artist', uses: '10M' },
        { id: 'ym-2', title: 'Acoustic Soul', artist: 'Indie Star', uses: '5M' },
        { id: 'ym-3', title: 'Upbeat Dance', artist: 'DJ Mix', uses: '2M' }
    ],
    instagram_categories: [
        { id: 'ic-1', category: 'Travel', topic: 'Hidden Gems', history: Array(12).fill(0).map((_, i) => ({ month: i, value: 50 + Math.random() * 50 })) },
        { id: 'ic-2', category: 'Food', topic: 'Vegan Recipes', history: Array(12).fill(0).map((_, i) => ({ month: i, value: 60 + Math.random() * 40 })) },
        { id: 'ic-3', category: 'Tech', topic: 'AI Gadgets', history: Array(12).fill(0).map((_, i) => ({ month: i, value: 70 + Math.random() * 30 })) }
    ],
    pinterest_colors: [
        { name: 'Peach Fuzz', hex: '#FFBE98' },
        { name: 'Sky Blue', hex: '#87CEEB' },
        { name: 'Sage Green', hex: '#B2AC88' },
        { name: 'Lavender', hex: '#E6E6FA' }
    ],
    linkedin_discussions: [
        { id: 'ld-1', topic: 'Future of Remote Work', growth: '+45%', engagement_rate: '5.2%', industry: 'Technology', history: Array(12).fill(0).map((_, i) => ({ month: i, value: 40 + Math.random() * 60 })) },
        { id: 'ld-2', topic: 'Sustainability in Supply Chain', growth: '+30%', engagement_rate: '4.1%', industry: 'Logistics', history: Array(12).fill(0).map((_, i) => ({ month: i, value: 30 + Math.random() * 70 })) },
        { id: 'ld-3', topic: 'The Great Resignation 2.0', growth: '+55%', engagement_rate: '6.8%', industry: 'Business', history: Array(12).fill(0).map((_, i) => ({ month: i, value: 45 + Math.random() * 80 })) },
        { id: 'ld-4', topic: 'AI in Recruitment', growth: '+70%', engagement_rate: '5.9%', industry: 'HR', history: Array(12).fill(0).map((_, i) => ({ month: i, value: 35 + Math.random() * 90 })) },
        { id: 'ld-5', topic: 'Mental Health at Work', growth: '+90%', engagement_rate: '7.5%', industry: 'Health', history: Array(12).fill(0).map((_, i) => ({ month: i, value: 50 + Math.random() * 100 })) }
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
            if (newItem.posts || newItem.volume) {
                const key = newItem.posts ? 'posts' : 'volume';
                const val = parseValue(newItem[key]) * mod.scale;
                newItem[key] = val > 1000000 ? (val / 1000000).toFixed(1) + 'M' : (val / 1000).toFixed(0) + 'K';
                if (key === 'volume' && platform === 'twitter' && newItem[key].includes('K')) newItem[key] += ' Tweets';
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
        return new Promise(async (resolve) => {
            // Try to fetch real trends for context (with timeout)
            let realTrends = [];
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

                const res = await fetch('/api/trends', { signal: controller.signal });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const json = await res.json();
                    if (json.success) {
                        realTrends = json.data;
                        console.log(`Successfully fetched ${realTrends.length} real trends for ${platform}`);
                    }
                }
            } catch (e) {
                console.warn(`TrendService: real trends fetch for ${platform} failed/timed out`, e.message);
            }

            // Ensure we resolve WITHIN the outer promise
            setTimeout(() => {
                try {
                    let data = (MOCK_DATA[platform] || []).map(item => adjustByTimeframe(item, timeframe));

                    if (realTrends && realTrends.length > 0) {
                        if (platform === 'twitter') {
                            const realTwitter = realTrends.slice(0, 5).map((t, i) => ({
                                id: `real-t-${i}`,
                                hashtag: `#${t.title.replace(/\s+/g, '')}`,
                                volume: t.traffic,
                                description: `Gündem: ${t.title}. ${t.news?.[0]?.news_item_title || ''}`,
                                sentiment: { positive: 60 + Math.random() * 30, neutral: 10, negative: 10 },
                                rt_analysis: Array(24).fill(0).map(() => Math.floor(Math.random() * 100)),
                                history: Array(12).fill(0).map((_, idx) => ({ month: idx, value: Math.floor(Math.random() * 200) }))
                            }));
                            data = [...realTwitter, ...data];
                        } else if (platform === 'youtube') {
                            const realYt = realTrends.slice(0, 5).map((t, i) => ({
                                id: `real-y-${i}`,
                                title: t.title,
                                views: t.traffic,
                                growth: '+New',
                                category: 'Gündem',
                                history: Array(12).fill(0).map((_, idx) => ({ month: idx, value: Math.floor(Math.random() * 200) }))
                            }));
                            data = [...realYt, ...data];
                        } else if (platform === 'tiktok') {
                            const realTiktok = realTrends.slice(0, 5).map((t, i) => ({
                                id: `real-tk-${i}`,
                                topic: t.title,
                                volume: t.traffic,
                                growth: '+New',
                                generated_idea: `Bugünün gündemi ${t.title} hakkında içerik üretmelisin.`,
                                history: Array(12).fill(0).map((_, idx) => ({ month: idx, value: Math.floor(Math.random() * 200) }))
                            }));
                            data = [...realTiktok, ...data];
                        }
                    }
                    resolve(data);
                } catch (err) {
                    console.error(`TrendService: error constructing ${platform} data:`, err);
                    resolve(MOCK_DATA[platform] || []);
                }
            }, 500);
        });
    },

    getAllTrends: async () => {
        return new Promise(async (resolve) => {
            try {
                // Try to fetch real trends (with timeout)
                let realTrends = [];
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

                    const res = await fetch('/api/trends', { signal: controller.signal });
                    clearTimeout(timeoutId);

                    if (res.ok) {
                        const json = await res.json();
                        if (json.success) realTrends = json.data;
                    }
                } catch (e) {
                    console.warn('Real trends fetch failed or timed out', e);
                }

                setTimeout(() => {
                    try {
                        // Clone mock data
                        const finalData = JSON.parse(JSON.stringify(MOCK_DATA));

                        if (realTrends.length > 0) {
                            // Update Hashtags
                            finalData.hashtags = realTrends.map((t, i) => ({
                                id: `real-tag-${i}`,
                                tag: `#${t.title.replace(/\s+/g, '')}`,
                                volume: t.traffic,
                                growth: '🔥 Hot'
                            }));

                            // Inject into platforms
                            finalData.youtube = [
                                ...realTrends.slice(0, 3).map(t => ({
                                    id: `real-yt-${t.id}`,
                                    title: t.title,
                                    views: t.traffic,
                                    growth: '+New',
                                    category: 'Gündem',
                                })),
                                ...finalData.youtube
                            ];

                            finalData.twitter = [
                                ...realTrends.slice(0, 3).map(t => ({
                                    id: `real-tw-${t.id}`,
                                    hashtag: `#${t.title.replace(/\s+/g, '')}`,
                                    volume: t.traffic,
                                })),
                                ...finalData.twitter
                            ];

                            finalData.tiktok = [
                                ...realTrends.slice(0, 3).map(t => ({
                                    id: `real-tk-${t.id}`,
                                    topic: t.title,
                                    posts: t.traffic,
                                    trend_score: 99
                                })),
                                ...finalData.tiktok
                            ];
                        }
                        resolve(finalData);
                    } catch (innerError) {
                        console.error("Dashboard data construction failed:", innerError);
                        resolve(MOCK_DATA);
                    }
                }, 800);
            } catch (outerError) {
                console.error("getAllTrends promise failed:", outerError);
                resolve(MOCK_DATA);
            }
        });
    },

    getTimeframeHighlights: async (timeframe) => {
        // timeframe: 'daily' (24h) or 'weekly' (7d)
        return new Promise(async (resolve) => {
            try {
                let realTrends = [];
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

                    const res = await fetch('/api/trends', { signal: controller.signal });
                    clearTimeout(timeoutId);

                    if (res.ok) {
                        const json = await res.json();
                        if (json.success) realTrends = json.data;
                    }
                } catch (e) {
                    console.warn('Real trends highlights fetch failed or timed out', e);
                }

                setTimeout(() => {
                    const results = [];
                    const platforms = ['youtube', 'tiktok', 'twitter', 'instagram', 'linkedin', 'pinterest'];

                    platforms.forEach((p, idx) => {
                        // Start with mock
                        let platformData = (MOCK_DATA[p] || []).slice(0, 1);

                        // If we have real trends, randomly assign one to a platform for variety
                        if (realTrends.length > idx) {
                            const t = realTrends[idx];
                            // Construct a "real" item
                            const realItem = {
                                id: `real-hl-${t.id}`,
                                title: t.title,
                                topic: t.title,
                                hashtag: `#${t.title.replace(/\s+/g, '')}`,
                                views: t.traffic,
                                posts: t.traffic,
                                volume: t.traffic,
                                growth: '+100%',
                                impression_growth: '+100%'
                            };
                            // Override/Prepend
                            platformData = [realItem];
                        }

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
            } catch (outerError) {
                console.error("getTimeframeHighlights failed:", outerError);
                resolve([]);
            }
        });
    },

    getTrendingHashtags: async () => {
        return new Promise(async (resolve) => {
            try {
                let realTrends = [];
                try {
                    const res = await fetch('/api/trends');
                    if (res.ok) {
                        const json = await res.json();
                        if (json.success) realTrends = json.data;
                    }
                } catch (e) {
                    console.warn("Hashtags real-fetch failed", e.message);
                }

                setTimeout(() => {
                    try {
                        let tags = JSON.parse(JSON.stringify(MOCK_DATA.hashtags || []));
                        if (realTrends.length > 0) {
                            const realTags = realTrends.map((t, i) => ({
                                id: `real-tags-${i}`,
                                tag: `#${t.title.replace(/\s+/g, '')}`,
                                volume: t.traffic,
                                growth: '🔥 Hot'
                            }));
                            tags = [...realTags, ...tags];
                        }
                        resolve(tags);
                    } catch (e) {
                        resolve(MOCK_DATA.hashtags || []);
                    }
                }, 300);
            } catch (err) {
                resolve(MOCK_DATA.hashtags || []);
            }
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
            try {
                setTimeout(() => {
                    resolve(IDEAS[platform] || []);
                }, 400);
            } catch (e) {
                console.error("getContentIdeas error:", e);
                resolve([]);
            }
        });
    },

    searchTrends: async (query, platformContext = null) => {
        console.log(`Searching for "${query}" in context: ${platformContext}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const results = [];
                    const q = query.toLowerCase().trim();

                    if (q.length < 2) return resolve([]);

                    // Helper to enrich data with lifecycle
                    const enrich = (item, platform) => {
                        const statuses = ['Rising', 'Peak', 'Falling'];
                        const status = statuses[Math.floor(Math.random() * statuses.length)];

                        let score, summary;
                        let endDate = new Date();
                        const startDate = new Date();
                        startDate.setMonth(startDate.getMonth() - 2);

                        if (status === 'Rising') {
                            score = 85 + Math.floor(Math.random() * 10);
                            endDate.setMonth(endDate.getMonth() + 2);
                            summary = "Bu trend henüz doyuma ulaşmadı. Erken katılım için harika bir zaman!";
                        } else if (status === 'Peak') {
                            score = 90 + Math.floor(Math.random() * 5);
                            endDate.setMonth(endDate.getMonth() + 1);
                            summary = "Şu an herkes bunu konuşuyor. İçerik üretirseniz yüksek izlenme garantili!";
                        } else {
                            score = 40 + Math.floor(Math.random() * 20);
                            endDate.setDate(endDate.getDate() + 10);
                            summary = "Bu trendin modası geçmek üzere. Diğer konulara odaklanmanızı öneririz.";
                        }

                        return {
                            ...item,
                            platform,
                            lifecycle: {
                                status,
                                validityScore: score,
                                startDate: startDate.toLocaleDateString('tr-TR'),
                                endDate: endDate.toLocaleDateString('tr-TR'),
                                summary
                            }
                        };
                    };

                    const isMatch = (item) => {
                        const text = (item.title || item.topic || item.hashtag || item.description || '').toLowerCase();
                        return text.includes(q);
                    };

                    // Search logic
                    Object.keys(MOCK_DATA).forEach(key => {
                        if (Array.isArray(MOCK_DATA[key])) {
                            MOCK_DATA[key].forEach(item => {
                                if (isMatch(item)) results.push(enrich(item, key));
                            });
                        }
                    });

                    console.log(`Found ${results.length} results for "${q}"`);
                    resolve(results);
                } catch (e) {
                    console.error("Search evaluation failed:", e);
                    resolve([]);
                }
            }, 300);
        });
    }
};


