const API_KEY = 'e5793e223d249f394f488e5d34676679'; // GNews API Key
const NEWS_SOURCE = 'https://gnews.io/api/v4/top-headlines?category=';
const DIRECT_LINK = 'https://www.profitablecpmratenetwork.com/bc7v0ndj?key=ea32948bd442a90ca9e16a82dc31cf86'; 

// --- MOCK DATA (BACKUP NEWS) ---
const MOCK_ARTICLES = [
    {
        title: "Global Tech Summit 2026: The Future of AI in Daily Life",
        description: "Leading experts gather to discuss how artificial intelligence is reshaping industries from healthcare to finance in the coming decade.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        url: "#",
        source: { name: "TECH INSIDER" },
        publishedAt: new Date().toISOString()
    },
    {
        title: "Sustainable Cities: Innovative Urban Planning for a Greener Future",
        description: "New architectural breakthroughs are allowing cities to breathe again with vertical forests and 100% renewable energy grids.",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
        url: "#",
        source: { name: "URBAN BEAT" },
        publishedAt: new Date().toISOString()
    },
    {
        title: "SpaceX Mars Mission: First Humans Set to Land by 2029",
        description: "The dream of becoming a multi-planetary species is closer than ever as the latest Starship tests exceed all performance expectations.",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
        url: "#",
        source: { name: "COSMOS DAILY" },
        publishedAt: new Date().toISOString()
    },
    {
        title: "Breakthrough in Clean Energy: Fusion Power Becomes Viable",
        description: "Scientists achieve a net energy gain in nuclear fusion, marking the start of a new era of limitless, carbon-free electricity.",
        image: "https://images.unsplash.com/photo-1509041318473-f860c4e0677a?auto=format&fit=crop&w=800&q=80",
        url: "#",
        source: { name: "ENERGY NEWS" },
        publishedAt: new Date().toISOString()
    },
    {
        title: "The Rise of Digital Nomads: Working from Paradise",
        description: "How high-speed satellite internet is allowing millions to ditch the office for beaches and mountains around the world.",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
        url: "#",
        source: { name: "LIFESTYLE" },
        publishedAt: new Date().toISOString()
    },
    {
        title: "New Health Discovery: The Secret to Longevity",
        description: "A comprehensive study of blue zones reveals that it's not just diet, but community and purpose that add decades to life.",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
        url: "#",
        source: { name: "HEALTH HUB" },
        publishedAt: new Date().toISOString()
    },
    {
        title: "Financial Markets Rally as Global Inflation Cools Down",
        description: "Stock markets hit record highs as central banks signal the end of rate hikes, sparking optimism for the new year.",
        image: "https://images.unsplash.com/photo-1611974714024-462cd297c8a0?auto=format&fit=crop&w=800&q=80",
        url: "#",
        source: { name: "MARKET WATCH" },
        publishedAt: new Date().toISOString()
    },
    {
        title: "Electric Vehicles Surpass Gasoline Car Sales in Record Month",
        description: "A major tipping point reached in the automotive industry as consumer preference shifts permanently toward electric power.",
        image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
        url: "#",
        source: { name: "AUTO TECH" },
        publishedAt: new Date().toISOString()
    },
    {
        title: "Discovery of Ancient City Rewrites Human History",
        description: "Archaeologists uncover a lost civilization in the Amazon that was far more advanced than previously thought possible.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        url: "#",
        source: { name: "HISTORY" },
        publishedAt: new Date().toISOString()
    },
    {
        title: "Ocean Cleanup Project Removes 10 Million Pounds of Plastic",
        description: "The world's largest initiative to save our oceans reaches a massive milestone, giving hope to marine ecosystems.",
        image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=800&q=80",
        url: "#",
        source: { name: "ECO WORLD" },
        publishedAt: new Date().toISOString()
    }
];

// Helper function to handle all mining/ad clicks
function goToAds(event) {
    if (event) event.preventDefault();
    window.open(DIRECT_LINK, '_blank');
}

// --- ELEMENTS ---
const heroSection = document.getElementById('hero-content');
const heroLoader = document.getElementById('hero-loader');
const newsGrid = document.getElementById('news-grid');
const gridLoader = document.getElementById('grid-loader');
const trendingList = document.getElementById('trending-list');
const recommendedList = document.getElementById('sidebar-recommended');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// --- FETCH NEWS ---
async function fetchNews(category = 'general', event = null) {
    if (event) event.preventDefault();
    
    try {
        // Reset UI
        newsGrid.innerHTML = '';
        heroSection.classList.add('hidden');
        heroLoader.classList.remove('hidden');
        gridLoader.classList.remove('hidden');

        // Scroll to top when changing categories
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const response = await fetch(`${NEWS_SOURCE}${category}&lang=en&country=us&max=10&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.articles) {
            // FILTERING: GNews structure uses 'image'
            const filteredArticles = data.articles.filter(article => 
                article.title && 
                article.description && 
                article.image
            );

            if (filteredArticles.length > 0) {
                renderNews(filteredArticles);
            } else {
                showEmpty();
            }
        } else {
            console.warn("API Error or Limit Reached. Using Mock Data fallback.");
            renderNews(MOCK_ARTICLES);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        renderNews(MOCK_ARTICLES);
    } finally {
        heroLoader.classList.add('hidden');
        gridLoader.classList.add('hidden');
    }
}

// --- RENDER NEWS ---
function renderNews(articles) {
    // 1. Render Hero Section (First Article)
    const hero = articles[0];
    if (hero) {
        heroSection.innerHTML = `
            <div class="group cursor-pointer" onclick="window.open('${hero.url}', '_blank')">
                <div class="relative w-full aspect-video overflow-hidden mb-6 border border-gray-100 dark:border-slate-800 bg-gray-100 dark:bg-slate-800">
                    <img src="${hero.image}" alt="${hero.title}" class="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700">
                    <div class="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                        Featured
                    </div>
                </div>
                <h1 class="text-3xl md:text-5xl font-extrabold leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                    ${hero.title}
                </h1>
                <p class="text-slate-500 text-lg leading-relaxed mb-6 line-clamp-3">
                    ${hero.description}
                </p>
                <div class="flex items-center gap-4">
                    <button onclick="goToAds(event)" class="bg-blue-600 hover:bg-slate-900 text-white text-xs font-bold py-4 px-10 transition-colors uppercase tracking-widest">
                        Read More
                    </button>
                    <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        ${new Date(hero.publishedAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        `;
        heroSection.classList.remove('hidden');
    }

    // 2. Render Remaining Articles in Grid
    const remaining = articles.slice(1);
    remaining.forEach((article, index) => {
        // Render news card
        newsGrid.appendChild(createNewsCard(article));

        // AGGRESSIVE: Inject Ad Card every 3 articles
        if ((index + 1) % 3 === 0) {
            const adCard = document.createElement('div');
            adCard.className = 'border border-gray-200 dark:border-slate-800 p-2 bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center min-h-[350px] relative';
            adCard.innerHTML = `
                <span class="text-[10px] text-gray-400 dark:text-slate-600 font-medium absolute top-2 left-2">SPONSORED</span>
                <script type="text/javascript">
                    atOptions = {
                        'key' : 'b914679eb4c2c40c64517a030b073abc',
                        'format' : 'iframe',
                        'height' : 250,
                        'width' : 300,
                        'params' : {}
                    };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/b914679eb4c2c40c64517a030b073abc/invoke.js"></script>
                <button onclick="goToAds(event)" class="mt-4 w-full py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-900 transition-colors">
                    Unlock Content
                </button>
            `;
            newsGrid.appendChild(adCard);
        }
    });

    // 3. Render Trending Sidebar (articles 6-10)
    renderTrending(articles.slice(6, 10));

    // 4. Render Recommended Sidebar (articles 3-8)
    renderSidebarRecommended(articles.slice(3, 8));
}

function renderSidebarRecommended(articles) {
    if (!recommendedList) return;
    recommendedList.innerHTML = '';

    articles.forEach(article => {
        const div = document.createElement('div');
        div.className = 'group cursor-pointer';
        div.onclick = goToAds; // Set to ad link for mining
        
        div.innerHTML = `
            <div class="flex gap-4 items-start">
                <div class="w-20 h-20 flex-shrink-0 overflow-hidden border border-gray-100 dark:border-slate-800 bg-gray-100 dark:bg-slate-800">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                </div>
                <div>
                    <h4 class="text-xs font-bold dark:text-white leading-tight line-clamp-3 group-hover:text-blue-600 transition-colors">
                        ${article.title}
                    </h4>
                    <span class="text-[9px] text-slate-400 uppercase mt-1 inline-block">Sponsored</span>
                </div>
            </div>
        `;
        recommendedList.appendChild(div);
    });
}

function renderTrending(articles) {
    if (!trendingList) return;
    trendingList.innerHTML = '';
    
    articles.forEach((article, index) => {
        const li = document.createElement('li');
        if (index > 0) li.className = 'border-t border-gray-100 pt-4';
        
        const categoryLabel = article.source.name.toUpperCase().substring(0, 15);
        
        li.innerHTML = `
            <a href="javascript:void(0)" onclick="goToAds(event)" class="group block">
                <span class="text-xs font-bold text-blue-600 block mb-1">${categoryLabel}</span>
                <h4 class="text-sm font-semibold group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                    ${article.title}
                </h4>
            </a>
        `;
        trendingList.appendChild(li);
    });
}

function createNewsCard(article) {
    const div = document.createElement('div');
    div.className = 'border border-gray-200 dark:border-slate-800 p-0 group flex flex-col h-full bg-white dark:bg-slate-900 transition-colors';
    div.innerHTML = `
        <div class="w-full aspect-[16/10] overflow-hidden border-b border-gray-100 dark:border-slate-800 bg-gray-100 dark:bg-slate-800">
            <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[10%] group-hover:grayscale-0">
        </div>
        <div class="p-6 flex flex-col flex-grow">
            <h3 class="text-xl font-bold mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 dark:text-white">
                ${article.title}
            </h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                ${article.description}
            </p>
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
                <div class="flex items-center gap-4">
                    <button onclick="goToAds(event)" class="text-xs font-bold text-blue-600 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest transition-colors">
                        Read More
                    </button>
                    <button onclick="goToAds(event)" class="text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-blue-600 uppercase flex items-center gap-1">
                        <i class="fa-solid fa-file-pdf"></i>
                        PDF
                    </button>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                    ${new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
            </div>
        </div>
    `;
    return div;
}

function showError() {
    newsGrid.innerHTML = `
        <div class="col-span-full py-20 text-center border border-dashed border-gray-200">
            <p class="text-slate-400 text-sm font-medium">Unable to load news. Please check your API key or connection.</p>
        </div>
    `;
}

function showEmpty() {
    newsGrid.innerHTML = `
        <div class="col-span-full py-20 text-center border border-dashed border-gray-200">
            <p class="text-slate-400 text-sm font-medium">No valid articles found in this category.</p>
        </div>
    `;
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial Theme Check
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggleDarkIcon.classList.remove('hidden');
    }

    // Theme Toggle Handler
    themeToggleBtn.addEventListener('click', function() {
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');

        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }
    });

    fetchNews('general');
});
