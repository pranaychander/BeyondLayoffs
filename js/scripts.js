async function fetchRedditLayoffs() {
    try {
        const response = await fetch('/api/reddit');
        const data = await response.json();
        const posts = data.items;

        const createCard = (post) => {
            let author = post.author || "Anonymous";
            if (author.startsWith('/u/')) author = author.substring(3);
            
            const initials = author.substring(0, 2).toUpperCase();
            let content = post.title;
            
            // Escape html to prevent XSS
            const div = document.createElement('div');
            div.innerText = content;
            const safeContent = div.innerHTML;

            return `
            <div class="comment-card w-[450px] bg-surface-container-high/20 backdrop-blur-sm border border-white/5 p-8 rounded-[2rem] shrink-0 flex flex-col justify-between">
                <p class="text-on-surface-variant text-lg leading-relaxed mb-8">${safeContent}</p>
                <div class="flex items-center gap-3 mt-auto">
                    <div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/10 text-[10px] font-bold uppercase tracking-tighter shrink-0">${initials}</div>
                    <div class="flex flex-col gap-0.5 overflow-hidden">
                        <span class="text-white font-semibold text-sm truncate">u/${author}</span>
                        <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider flex items-center gap-1"><span class="material-symbols-outlined text-[10px]">forum</span> r/layoffs</span>
                    </div>
                </div>
            </div>
            `;
        };

        const row1 = document.getElementById('marquee-row-1');
        const row2 = document.getElementById('marquee-row-2');
        const row3 = document.getElementById('marquee-row-3');

        let html1 = '', html2 = '', html3 = '';
        for (let i = 0; i < posts.length; i++) {
            const cardHtml = createCard(posts[i]);
            if (i % 3 === 0) html1 += cardHtml;
            else if (i % 3 === 1) html2 += cardHtml;
            else html3 += cardHtml;
        }

        row1.innerHTML = html1 + html1;
        row2.innerHTML = html2 + html2;
        row3.innerHTML = html3 + html3;

    } catch (error) {
        console.error("Failed to fetch reddit data:", error);
        // Optionally, fallback to some default cards here
    }
}

async function fetchNewsLayoffs() {
    try {
        const response = await fetch('/api/news');
        const data = await response.json();
        const articles = data.items.slice(0, 4);

        const container = document.getElementById('news-container');
        container.innerHTML = '';

        const placeholderImages = [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ18OUi1idDl1NiVmMqbIq16MTIrhJnpsUrcjcFuxEjgVyEpUlbf0Mo-Y5ivp9uOvWEpi_fVf1AvoqwkC0wUGdNwdfIIH8J6Xkv0pTpV2LmneYQ26ONp-u80YJkCG3XEbSOPSsGjjgnl-gRNhFOScf53YLm-nvq9b2-GTCXYpvNq7d5ReX_x6dYDd5LoROdKafYCG7tlxWyuOfUXCSShoHz4ry9hwNs1WlQvl9LHlrs4qhKJOabt5viSHlYfvzYyzDVX33AD_53dkR",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAJhVdq2SJFhBV7zlE0L4mafLGvypkkk85koZUtyHqgM4UFHbxs5sj_p_F1jPRHgowBg08zfBsn3PdAHQf5vs1YcxTYKWDttMpxhu7DiSqwLTKfYHzE8KdpQ1gaJSUiqcHOxALFe1QqWqLBcjdFP7vYKQopQ09_THr0oq3jK14WofiImBG-PN-NA90LzJOuSLqe3eZ0psG9rCDj6R2ka2AVlm-FN723n7O4BKwlHkTnhnVaMKxtAnjWe5uJINJ2Zw33jxMQOL5iz0Iz",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuC7Gm3LTtVFPi3ER7pj767PT8_85oCFX-SYMmnOW-5nYOVSf9jqTVCkSL3adsdX5YS6S5fKi9fhAvl-hjULOY4s0W_J6SFdbruYedihXrBkHwoS25o6qd5KjKERV5LjHr6kITl06n0nedXn2Pyke13gFb_2VcDT_s8ajap4omCSFbMf8LKaRXywynL8euHrHre6dn_ZPT75PdW4EMZMeMfHI2RJq6NONtCW1IF1nr8vqD14G3_rTBkxtMJTgwqHqVljwFMTWm9cUZ7D",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBBJKJb-ZGktgvNcX4n2UcAgeCGjIPW9yHq6AtnzwXaUonCsiQQtb1ws_XeOaXX3Nsd5HNoyQXqvWfQfjMbhHpR-M5-are4ns2q9r5kMDxkRwmJXeLa5BAyfG9SIpRuxCKa2jffV-Rbj12Vy0uPE11DUtmz823jgmyIWHBY0nwkx5Z1-QXVKu70sDWv8xUjApuyPnsXC1AqqgOG_pUx3iLlAn9th8ZZj1yl_rTW8nTAz8MvF03L408Js4gTQKkm4CUS2luDTesrigq-"
        ];

        articles.forEach((article, index) => {
            const date = new Date(article.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const imageUrl = article.thumbnail || placeholderImages[index % placeholderImages.length];
            let source = article.source || "News";
            
            // Decode HTML entities from title
            const div = document.createElement('div');
            div.innerHTML = article.title;
            const cleanTitle = div.textContent || div.innerText || "";
            
            // Strip source from title if it's there (Google News format is "Title - Source")
            let displayTitle = cleanTitle;
            const lastDash = cleanTitle.lastIndexOf(" - ");
            if (lastDash > 0) {
                displayTitle = cleanTitle.substring(0, lastDash);
                source = cleanTitle.substring(lastDash + 3); // Update source to actual publisher
            }

            const cardHtml = `
            <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="group cursor-pointer transition-transform duration-300 hover:scale-[1.02] block">
                <div class="aspect-[16/10] overflow-hidden rounded-2xl mb-6 bg-surface-container-highest relative">
                    <img class="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110" src="${imageUrl}">
                    <div class="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
                    ${index === 0 ? '<div class="absolute top-4 left-4"><span class="px-2 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-wider rounded-sm">Latest</span></div>' : ''}
                </div>
                <div class="flex items-center gap-3 mb-3">
                    <span class="px-2 py-0.5 bg-primary/10 border border-primary/20 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-primary rounded-sm">${source}</span>
                    <div class="flex items-center gap-1.5 text-on-surface-variant text-[0.6rem] font-semibold uppercase tracking-wider">
                        <span>${date}</span>
                    </div>
                </div>
                <h3 class="text-xl font-extrabold text-white leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-3">${displayTitle}</h3>
            </a>
            `;
            container.insertAdjacentHTML('beforeend', cardHtml);
        });

    } catch (error) {
        console.error("Failed to fetch news data:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchRedditLayoffs();
    fetchNewsLayoffs();
});
