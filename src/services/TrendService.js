
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
                { month: 'Oca', value: 40 }, { month: 'Şub', value: 50 }, { month: 'Mar', value: 65 },
                { month: 'Nis', value: 80 }, { month: 'May', value: 100 }, { month: 'Haz', value: 120 },
                { month: 'Tem', value: 150 }, { month: 'Ağu', value: 180 }, { month: 'Eyl', value: 200 },
                { month: 'Eki', value: 220 }, { month: 'Kas', value: 210 }, { month: 'Ara', value: 200 }
            ]
        },
        {
            id: 2,
            title: 'AI Tools 2024',
            views: '2.5M',
            growth: '+150%',
            category: 'Tech',
            history: [
                { month: 'Oca', value: 20 }, { month: 'Şub', value: 35 }, { month: 'Mar', value: 60 },
                { month: 'Nis', value: 80 }, { month: 'May', value: 110 }, { month: 'Haz', value: 130 },
                { month: 'Tem', value: 140 }, { month: 'Ağu', value: 135 }, { month: 'Eyl', value: 150 },
                { month: 'Eki', value: 160 }, { month: 'Kas', value: 170 }, { month: 'Ara', value: 180 }
            ]
        },
        {
            id: 3,
            title: 'Healthy Meal Prep',
            views: '1.2M',
            growth: '+80%',
            category: 'Food',
            history: [
                { month: 'Oca', value: 80 }, { month: 'Şub', value: 75 }, { month: 'Mar', value: 70 },
                { month: 'Nis', value: 85 }, { month: 'May', value: 90 }, { month: 'Haz', value: 95 },
                { month: 'Tem', value: 90 }, { month: 'Ağu', value: 85 }, { month: 'Eyl', value: 100 },
                { month: 'Eki', value: 110 }, { month: 'Kas', value: 105 }, { month: 'Ara', value: 95 }
            ]
        },
        {
            id: 4,
            title: 'Minimalist Setup Tour',
            views: '850K',
            growth: '+45%',
            category: 'Lifestyle',
            history: [
                { month: 'Oca', value: 30 }, { month: 'Şub', value: 40 }, { month: 'Mar', value: 45 },
                { month: 'Nis', value: 50 }, { month: 'May', value: 60 }, { month: 'Haz', value: 65 },
                { month: 'Tem', value: 70 }, { month: 'Ağu', value: 75 }, { month: 'Eyl', value: 80 },
                { month: 'Eki', value: 85 }, { month: 'Kas', value: 90 }, { month: 'Ara', value: 85 }
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
            generated_idea: "Bu akım için: Mor renkli bir içecek hazırla (böğürtlenli milkshake gibi) ve içtikten sonra birden 'bayılmış' veya 'değişmiş' gibi komik bir kurguyla yere yığıl. Arkaya o gerilim müziğini eklemeyi unutma!",
            history: [
                { month: 'Oca', value: 10 }, { month: 'Şub', value: 20 }, { month: 'Mar', value: 50 },
                { month: 'Nis', value: 100 }, { month: 'May', value: 150 }, { month: 'Haz', value: 200 },
                { month: 'Tem', value: 250 }, { month: 'Ağu', value: 220 }, { month: 'Eyl', value: 180 },
                { month: 'Eki', value: 100 }, { month: 'Kas', value: 50 }, { month: 'Ara', value: 20 }
            ]
        },
        {
            id: 2,
            topic: '#RomanEmpire',
            posts: '1.2M',
            trend_score: 95,
            generated_idea: "Partnerine, babana veya erkek kardeşine git ve videoya kaybederek şu soruyu sor: 'Roma İmparatorluğu'nu ne sıklıkla düşünüyorsun?'. Cevabı videoya çek ve şaşkınlığını göster.",
            history: [
                { month: 'Oca', value: 5 }, { month: 'Şub', value: 10 }, { month: 'Mar', value: 15 },
                { month: 'Nis', value: 20 }, { month: 'May', value: 50 }, { month: 'Haz', value: 100 },
                { month: 'Tem', value: 150 }, { month: 'Ağu', value: 200 }, { month: 'Eyl', value: 250 },
                { month: 'Eki', value: 300 }, { month: 'Kas', value: 280 }, { month: 'Ara', value: 250 }
            ]
        },
        {
            id: 3,
            topic: 'Dance Challenge X',
            posts: '750K',
            trend_score: 88,
            generated_idea: "Bu dansın ayak hareketlerine odaklanan bir 'tutorial' (öğretici) videosu çek. Hızı yavaşlatarak adım adım göster, çünkü insanlar öğrenmek için bu tarz videoları çok kaydediyor.",
            history: [
                { month: 'Oca', value: 80 }, { month: 'Şub', value: 90 }, { month: 'Mar', value: 100 },
                { month: 'Nis', value: 120 }, { month: 'May', value: 150 }, { month: 'Haz', value: 140 },
                { month: 'Tem', value: 130 }, { month: 'Ağu', value: 120 }, { month: 'Eyl', value: 110 },
                { month: 'Eki', value: 100 }, { month: 'Kas', value: 200 }, { month: 'Ara', value: 150 }
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
            description: 'Bu konu hakkında atılan tweetlerin çoğu olumlu. İnsanlar bu gelişmeyi heyecanla bekliyor. Bu konuda görüş belirten bir flood hazırlayabilirsin.',
            sentiment: { positive: 70, neutral: 20, negative: 10 },
            rt_analysis: [
                45, 50, 55, 60, 40, 35, 30, 45, 60, 80, 100, 120,
                110, 90, 85, 95, 130, 150, 140, 120, 100, 90, 80, 70
            ],
            history: [
                { month: 'Oca', value: 100 }, { month: 'Şub', value: 120 }, { month: 'Mar', value: 150 },
                { month: 'Nis', value: 130 }, { month: 'May', value: 140 }, { month: 'Haz', value: 160 },
                { month: 'Tem', value: 180 }, { month: 'Ağu', value: 200 }, { month: 'Eyl', value: 220 },
                { month: 'Eki', value: 240 }, { month: 'Kas', value: 260 }, { month: 'Ara', value: 280 }
            ]
        },
        {
            id: 2,
            hashtag: '#MondayMotivation',
            volume: '80K Tweets',
            description: 'Haftaya başlangıç enerjisi yüksek. Motivasyon verici görseller ve kısa sözler paylaşmak için harika bir zaman. Kendi hashtag\'ini de oluşturabilirsin.',
            sentiment: { positive: 90, neutral: 5, negative: 5 },
            rt_analysis: [
                20, 25, 30, 35, 40, 45, 50, 60, 70, 65, 60, 55,
                50, 45, 40, 50, 60, 75, 80, 70, 60, 50, 40, 30
            ],
            history: [
                { month: 'Oca', value: 80 }, { month: 'Şub', value: 85 }, { month: 'Mar', value: 90 },
                { month: 'Nis', value: 80 }, { month: 'May', value: 85 }, { month: 'Haz', value: 80 },
                { month: 'Tem', value: 75 }, { month: 'Ağu', value: 80 }, { month: 'Eyl', value: 85 },
                { month: 'Eki', value: 90 }, { month: 'Kas', value: 95 }, { month: 'Ara', value: 100 }
            ]
        },
        {
            id: 3,
            hashtag: '#NewRelease',
            volume: '250K Tweets',
            description: 'Yeni çıkan içerikler hakkında tartışmalar alevli. Spoiler vermeden inceleme yazısı veya anket oluşturabilirsin.',
            sentiment: { positive: 45, neutral: 30, negative: 25 },
            rt_analysis: [
                80, 90, 100, 120, 140, 160, 180, 200, 220, 240, 250, 230,
                210, 190, 170, 150, 140, 130, 120, 110, 100, 90, 80, 70
            ],
            history: [
                { month: 'Oca', value: 50 }, { month: 'Şub', value: 60 }, { month: 'Mar', value: 100 },
                { month: 'Nis', value: 150 }, { month: 'May', value: 200 }, { month: 'Haz', value: 180 },
                { month: 'Tem', value: 160 }, { month: 'Ağu', value: 140 }, { month: 'Eyl', value: 200 },
                { month: 'Eki', value: 250 }, { month: 'Kas', value: 300 }, { month: 'Ara', value: 280 }
            ]
        },
    ],
    twitter_suggestions: [
        { id: 1, type: 'Thread', content: 'Teknoloji trendlerini anlatan 5 tweetlik bir flood hazırla.', icon: 'Type' },
        { id: 2, type: 'Poll', content: '"Sizce YZ işleri elimizden alacak mı?" anketi başlat.', icon: 'CheckSquare' },
        { id: 3, type: 'Media', content: 'Ofis kurulumunu gösteren kısa bir video paylaş.', icon: 'Image' }
    ],
    instagram: [
        {
            id: 1,
            type: 'reels',
            title: 'Summer Vibes',
            views: '1.5M',
            audio: 'Trending Audio #4',
            history: [
                { month: 'Oca', value: 20 }, { month: 'Şub', value: 30 }, { month: 'Mar', value: 45 },
                { month: 'Nis', value: 60 }, { month: 'May', value: 80 }, { month: 'Haz', value: 95 },
                { month: 'Tem', value: 100 }, { month: 'Ağu', value: 90 }, { month: 'Eyl', value: 75 },
                { month: 'Eki', value: 60 }, { month: 'Kas', value: 50 }, { month: 'Ara', value: 40 }
            ]
        },
        {
            id: 2,
            type: 'story',
            title: 'Poll: Coffee vs Tea',
            interactions: '45K',
            template: 'Versus',
            history: [
                { month: 'Oca', value: 40 }, { month: 'Şub', value: 45 }, { month: 'Mar', value: 50 },
                { month: 'Nis', value: 55 }, { month: 'May', value: 60 }, { month: 'Haz', value: 65 },
                { month: 'Tem', value: 70 }, { month: 'Ağu', value: 80 }, { month: 'Eyl', value: 85 },
                { month: 'Eki', value: 90 }, { month: 'Kas', value: 95 }, { month: 'Ara', value: 100 }
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
                { month: 'Şub', value: 35 },
                { month: 'Mar', value: 45 },
                { month: 'Nis', value: 40 },
                { month: 'May', value: 60 },
                { month: 'Haz', value: 85 },
                { month: 'Tem', value: 80 },
                { month: 'Ağu', value: 75 },
                { month: 'Eyl', value: 90 },
                { month: 'Eki', value: 95 },
                { month: 'Kas', value: 88 },
                { month: 'Ara', value: 92 }
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
                { month: 'Şub', value: 25 },
                { month: 'Mar', value: 50 },
                { month: 'Nis', value: 80 },
                { month: 'May', value: 95 },
                { month: 'Haz', value: 100 },
                { month: 'Tem', value: 90 },
                { month: 'Ağu', value: 85 },
                { month: 'Eyl', value: 92 },
                { month: 'Eki', value: 98 },
                { month: 'Kas', value: 100 },
                { month: 'Ara', value: 100 }
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
                { month: 'Şub', value: 40 },
                { month: 'Mar', value: 45 },
                { month: 'Nis', value: 55 },
                { month: 'May', value: 65 },
                { month: 'Haz', value: 75 },
                { month: 'Tem', value: 60 },
                { month: 'Ağu', value: 50 },
                { month: 'Eyl', value: 70 },
                { month: 'Eki', value: 85 },
                { month: 'Kas', value: 90 },
                { month: 'Ara', value: 95 }
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
                { month: 'Oca', value: 20 }, { month: 'Şub', value: 30 }, { month: 'Mar', value: 50 },
                { month: 'Nis', value: 70 }, { month: 'May', value: 80 }, { month: 'Haz', value: 90 },
                { month: 'Tem', value: 95 }, { month: 'Ağu', value: 90 }, { month: 'Eyl', value: 85 },
                { month: 'Eki', value: 80 }, { month: 'Kas', value: 75 }, { month: 'Ara', value: 70 }
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
                { month: 'Oca', value: 60 }, { month: 'Şub', value: 70 }, { month: 'Mar', value: 80 },
                { month: 'Nis', value: 90 }, { month: 'May', value: 100 }, { month: 'Haz', value: 110 },
                { month: 'Tem', value: 120 }, { month: 'Ağu', value: 130 }, { month: 'Eyl', value: 125 },
                { month: 'Eki', value: 120 }, { month: 'Kas', value: 115 }, { month: 'Ara', value: 110 }
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
                { month: 'Oca', value: 40 }, { month: 'Şub', value: 50 }, { month: 'Mar', value: 60 },
                { month: 'Nis', value: 80 }, { month: 'May', value: 100 }, { month: 'Haz', value: 90 },
                { month: 'Tem', value: 80 }, { month: 'Ağu', value: 70 }, { month: 'Eyl', value: 60 },
                { month: 'Eki', value: 50 }, { month: 'Kas', value: 40 }, { month: 'Ara', value: 30 }
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
            category: 'Moda',
            topic: 'Kombin Videoları',
            history: [
                { month: 'Oca', value: 30 }, { month: 'Şub', value: 40 }, { month: 'Mar', value: 50 },
                { month: 'Nis', value: 70 }, { month: 'May', value: 85 }, { month: 'Haz', value: 95 },
                { month: 'Tem', value: 100 }, { month: 'Ağu', value: 90 }, { month: 'Eyl', value: 80 },
                { month: 'Eki', value: 70 }, { month: 'Kas', value: 60 }, { month: 'Ara', value: 50 }
            ]
        },
        {
            id: 2,
            category: 'Yemek',
            topic: 'Hızlı Tarifler',
            history: [
                { month: 'Oca', value: 50 }, { month: 'Şub', value: 55 }, { month: 'Mar', value: 60 },
                { month: 'Nis', value: 65 }, { month: 'May', value: 70 }, { month: 'Haz', value: 80 },
                { month: 'Tem', value: 85 }, { month: 'Ağu', value: 90 }, { month: 'Eyl', value: 95 },
                { month: 'Eki', value: 100 }, { month: 'Kas', value: 90 }, { month: 'Ara', value: 80 }
            ]
        },
        {
            id: 3,
            category: 'Gezi',
            topic: 'Gizli Mekanlar',
            history: [
                { month: 'Oca', value: 20 }, { month: 'Şub', value: 30 }, { month: 'Mar', value: 40 },
                { month: 'Nis', value: 60 }, { month: 'May', value: 80 }, { month: 'Haz', value: 100 },
                { month: 'Tem', value: 100 }, { month: 'Ağu', value: 100 }, { month: 'Eyl', value: 90 },
                { month: 'Eki', value: 60 }, { month: 'Kas', value: 40 }, { month: 'Ara', value: 30 }
            ]
        },
        {
            id: 4,
            category: 'Mizah',
            topic: 'Ofis Halleri',
            history: [
                { month: 'Oca', value: 60 }, { month: 'Şub', value: 65 }, { month: 'Mar', value: 70 },
                { month: 'Nis', value: 75 }, { month: 'May', value: 80 }, { month: 'Haz', value: 85 },
                { month: 'Tem', value: 90 }, { month: 'Ağu', value: 85 }, { month: 'Eyl', value: 95 },
                { month: 'Eki', value: 100 }, { month: 'Kas', value: 90 }, { month: 'Ara', value: 95 }
            ]
        },
        {
            id: 5,
            category: 'Teknoloji',
            topic: 'Günlük Hack\'ler',
            history: [
                { month: 'Oca', value: 40 }, { month: 'Şub', value: 50 }, { month: 'Mar', value: 60 },
                { month: 'Nis', value: 70 }, { month: 'May', value: 80 }, { month: 'Haz', value: 90 },
                { month: 'Tem', value: 95 }, { month: 'Ağu', value: 90 }, { month: 'Eyl', value: 85 },
                { month: 'Eki', value: 80 }, { month: 'Kas', value: 75 }, { month: 'Ara', value: 70 }
            ]
        },
        {
            id: 6,
            category: 'Spor',
            topic: '15 Dk Egzersiz',
            history: [
                { month: 'Oca', value: 100 }, { month: 'Şub', value: 90 }, { month: 'Mar', value: 80 },
                { month: 'Nis', value: 70 }, { month: 'May', value: 85 }, { month: 'Haz', value: 95 },
                { month: 'Tem', value: 90 }, { month: 'Ağu', value: 85 }, { month: 'Eyl', value: 80 },
                { month: 'Eki', value: 70 }, { month: 'Kas', value: 60 }, { month: 'Ara', value: 90 }
            ]
        },
        {
            id: 7,
            category: 'Kitap',
            topic: 'Ayın Önerisi',
            history: [
                { month: 'Oca', value: 50 }, { month: 'Şub', value: 55 }, { month: 'Mar', value: 50 },
                { month: 'Nis', value: 45 }, { month: 'May', value: 50 }, { month: 'Haz', value: 60 },
                { month: 'Tem', value: 70 }, { month: 'Ağu', value: 75 }, { month: 'Eyl', value: 80 },
                { month: 'Eki', value: 85 }, { month: 'Kas', value: 90 }, { month: 'Ara', value: 95 }
            ]
        },
        {
            id: 8,
            category: 'Motivasyon',
            topic: 'Günün Sözü',
            history: [
                { month: 'Oca', value: 80 }, { month: 'Şub', value: 85 }, { month: 'Mar', value: 80 },
                { month: 'Nis', value: 75 }, { month: 'May', value: 80 }, { month: 'Haz', value: 85 },
                { month: 'Tem', value: 80 }, { month: 'Ağu', value: 75 }, { month: 'Eyl', value: 85 },
                { month: 'Eki', value: 90 }, { month: 'Kas', value: 95 }, { month: 'Ara', value: 90 }
            ]
        },
        {
            id: 9,
            category: 'Sanat',
            topic: 'Eskiz Paylaşımı',
            history: [
                { month: 'Oca', value: 30 }, { month: 'Şub', value: 35 }, { month: 'Mar', value: 40 },
                { month: 'Nis', value: 50 }, { month: 'May', value: 55 }, { month: 'Haz', value: 60 },
                { month: 'Tem', value: 65 }, { month: 'Ağu', value: 70 }, { month: 'Eyl', value: 75 },
                { month: 'Eki', value: 80 }, { month: 'Kas', value: 85 }, { month: 'Ara', value: 90 }
            ]
        }
    ],
    hashtags: [
        { id: 1, tag: '#YapayZeka', volume: '2.1M', growth: '+300%' },
        { id: 2, tag: '#YazLezzetleri', volume: '500K', growth: '+45%' },
        { id: 3, tag: '#Teknoloji', volume: '1.2M', growth: '+120%' },
        { id: 4, tag: '#ViralDans', volume: '850K', growth: '+90%' },
        { id: 5, tag: '#Girişimcilik', volume: '300K', growth: '+25%' }
    ]
};

export const TrendService = {
    getPlatformTrends: async (platform) => {
        // Helper to parse '2.5M', '500K' to numbers
        const parseValue = (str) => {
            if (!str) return 0;
            const s = str.toString().toUpperCase();
            if (s.includes('M')) return parseFloat(s.replace('M', '')) * 1000000;
            if (s.includes('K')) return parseFloat(s.replace('K', '')) * 1000;
            return parseFloat(s) || 0;
        };

        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                let data = [...(MOCK_DATA[platform] || [])];

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
                { id: 1, title: 'Vlog: Haftalık Özet', desc: 'Bu haftanın en çok konuşulan trendlerini yorumladığın bir video çek.', difficulty: 'Kolay' },
                { id: 2, title: 'Shorts: Perde Arkası', desc: 'İçerik üretim sürecini hızlandırılmış şekilde göster.', difficulty: 'Orta' },
                { id: 3, title: 'Canlı Yayın Soru-Cevap', desc: 'Takipçilerinle etkileşimi artırmak için bir AMA (Bana İstediğini Sor) yap.', difficulty: 'Zor' }
            ],
            tiktok: [
                { id: 1, title: 'Akım Uyarlaması', desc: 'Gündemdeki viral sesi kendi nişine uyarlayarak kullan.', difficulty: 'Kolay' },
                { id: 2, title: 'Düet Videosu', desc: 'Popüler bir videoya tepki ver veya onunla etkileşime gir.', difficulty: 'Kolay' },
                { id: 3, title: 'Eğitici Seri', desc: '3 partlık mini bir bilgi serisi başlat.', difficulty: 'Orta' }
            ],
            twitter: [
                { id: 1, title: 'Bilgi Flood\'u', desc: 'Sektörünle ilgili bilinmeyen 5 gerçeği sırala.', difficulty: 'Orta' },
                { id: 2, title: 'Anket Başlat', desc: 'Takipçilerini ikiye bölecek tartışmalı ama eğlenceli bir soru sor.', difficulty: 'Kolay' },
                { id: 3, title: 'Gündem Yorumu', desc: 'Trend listesindeki #Hashtag hakkında kısa ve öz bir görüş belirt.', difficulty: 'Kolay' }
            ],
            instagram: [
                { id: 1, title: 'Reels: Geçiş Videosu', desc: 'Kıyafet veya mekan değiştirme geçişleriyle dinamik bir Reels çek.', difficulty: 'Zor' },
                { id: 2, title: 'Hikaye: Anket', desc: 'Takipçilerine günün planını soran interaktif stickerlar kullan.', difficulty: 'Kolay' },
                { id: 3, title: 'Post: Carousel', desc: 'Kaydırmalı post ile bir hikaye veya bilgi paylaş.', difficulty: 'Orta' }
            ],
            linkedin: [
                { id: 1, title: 'Sektörel Analiz', desc: 'Haftanın en önemli iş dünyası gelişmesini yorumla.', difficulty: 'Zor' },
                { id: 2, title: 'Kulse Arkası', desc: 'Çalışma ortamını veya ekibini tanıtan samimi bir post.', difficulty: 'Kolay' },
                { id: 3, title: 'Başarı Hikayesi', desc: 'Karşılaştığın bir zorluğu nasıl aştığını anlat.', difficulty: 'Orta' }
            ],
            pinterest: [
                { id: 1, title: 'İnfografik', desc: 'Karmaşık bir konuyu basit görsellerle anlatan uzun bir pin hazırla.', difficulty: 'Zor' },
                { id: 2, title: 'Moodboard', desc: 'Gelecek ayın renk paletini içeren bir ilham panosu oluştur.', difficulty: 'Kolay' },
                { id: 3, title: 'Adım Adım Rehber', desc: 'DIY projesini fotoğraflarla adım adım göster.', difficulty: 'Orta' }
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
                    const statuses = ['Yükselişte', 'Zirvede', 'Düşüşte'];
                    const status = statuses[Math.floor(Math.random() * statuses.length)];

                    let score, summary;
                    let endDate = new Date();
                    const startDate = new Date();
                    startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 3));

                    if (status === 'Yükselişte') {
                        score = 85 + Math.floor(Math.random() * 15);
                        endDate.setMonth(endDate.getMonth() + 2);
                        summary = "Bu trend henüz doygunluğa ulaşmadı. Erken benimseyenlerden olmak için harika bir zaman!";
                    } else if (status === 'Zirvede') {
                        score = 90 + Math.floor(Math.random() * 10);
                        endDate.setMonth(endDate.getMonth() + 1);
                        summary = "Şu an herkes bunu konuşuyor. İçerik üretirseniz yüksek izlenme garantili ama rekabet çok.";
                    } else {
                        score = 30 + Math.floor(Math.random() * 30);
                        endDate.setDate(endDate.getDate() + 7);
                        summary = "Bu trendin modası geçmek üzere. Başka konulara odaklanmanızı öneririz.";
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
