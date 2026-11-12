/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Article } from '../types';

const STORAGE_KEY_ARTICLES = 'jyotishwala_articles_v2';
const REMOVED_DUMMY_IDS = new Set(['art_3']);

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art_1',
    title: 'कुंडली में गजकेसरी योग: अर्थ, फल एवं अचूक लाभ',
    slug: 'gajakesari-yoga-significance',
    category: 'Kundli',
    categoryHindi: 'कुंडली योग',
    excerpt: 'बृहस्पति और चंद्रमा की युति या केंद्र संबंध से निर्मित होने वाला यह राजयोग जातक को मान, पद और अखंड यश प्रदान करता है।',
    content: `वैदिक ज्योतिष में 'गजकेसरी योग' को अत्यंत मंगलकारी और दुर्लभ राजयोगों में गिना जाता है। संस्कृत में 'गज' का अर्थ हाथी और 'केसरी' का अर्थ सिंह होता है। जिस प्रकार गज और सिंह अपनी शक्ति और निर्भीकता के लिए जाने जाते हैं, उसी प्रकार यह योग जातक को अदम्य साहस, समाज में उच्च प्रतिष्ठा और बौद्धिक संपदा देता है।

कैसे बनता है गजकेसरी योग?
जब जन्म कुंडली में देवगुरु बृहस्पति, चंद्रमा से केंद्र भावों (प्रथम, चतुर्थ, सप्तम अथवा दशम भाव) में स्थित हों, तब गजकेसरी योग का निर्माण होता है।

प्रमुख फल:
1. बौद्धिक दक्षता: जातक नीतिवान, उच्च कोटि का सलाहकार अथवा विद्वान बनता है।
2. स्थिर संपत्ति: भूमि, भवन एवं वाहनों का अखंड सुख प्राप्त होता है।
3. शत्रु शमन: विरोधी जातक के सम्मुख प्रभावहीन हो जाते हैं।`,
    author: 'पं. राधेश्याम शास्त्री',
    authorAvatar: 'https://ui-avatars.com/api/?name=%E0%A4%B0%E0%A4%BE%E0%A4%A7%E0%A5%87%E0%A4%B6%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%AE+%E0%A4%B6%E0%A4%BE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%8D%E0%A4%B0%E0%A5%80&background=008080&color=fff&size=128',
    authorBio: 'पं. राधेश्याम शास्त्री — काशी हिन्दू विश्वविद्यालय से ज्योतिष एवं व्याकरण में स्नातकोत्तर। 18 वर्षों से वैदिक ज्योतिष एवं पंचांग शोध में संलग्न।',
    authorRole: 'वैदिक ज्योतिषाचार्य',
    publishedAt: '2026-10-28',
    readTime: '4 मिनट',
    imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'गजकेसरी योग ज्योतिष विश्लेषण',
    tags: ['कुंडली', 'गजकेसरी योग', 'राजयोग', 'गुरु', 'चन्द्रमा'],
    shloka: {
      sanskrit: 'केन्द्रे देवगुरौ लग्नाच्चन्द्राद्वापि शुभेक्षिते। नीचारिहीने विपुलो गजकेसरिसंज्ञकः॥',
      meaning: 'यदि चंद्रमा से केंद्र में गुरु स्थित हों और किसी नीच या शत्रु राशि में न हों, तो वह गजकेसरी योग जातक को राजा समान प्रतिष्ठा देता है।'
    },
    views: 1420,
    seo: {
      metaTitle: 'कुंडली में गजकेसरी योग: अर्थ, फल एवं अचूक लाभ | JyotishWala',
      metaDescription: 'जानिए जन्म कुंडली में गजकेसरी योग कैसे बनता है और इसके जातक को क्या-क्या राजयोग फल प्राप्त होते हैं।',
      focusKeyword: 'गजकेसरी योग',
      canonicalUrl: 'https://jyotishwala.com/articles/gajakesari-yoga-significance',
      internalLinks: [
        { anchorText: 'अपनी जन्म कुंडली बनाएं', url: '#kundli' },
        { anchorText: 'कुंडली मिलान करें', url: '#milan' }
      ],
      externalLinks: [
        { anchorText: 'JyotishWala आधिकारिक पोर्टल', url: 'https://jyotishwala.com' }
      ]
    }
  },
  {
    id: 'art_2',
    title: 'दैनिक जीवन में वास्तु शास्त्र के 10 सरल एवं अचूक नियम',
    slug: 'daily-vastu-shastra-principles',
    category: 'Vastu',
    categoryHindi: 'वास्तु शास्त्र',
    excerpt: 'घर में सकारात्मक ऊर्जा, सुख-शांति एवं आर्थिक समृद्धि बनाए रखने के लिए ईशान कोण, मुख्य द्वार और रसोई की सही दिशा।',
    content: `वास्तु शास्त्र प्राचीन भारतीय स्थापत्य कला और प्राकृतिक पंचतत्वों (पृथ्वी, जल, अग्नि, वायु, आकाश) के सामंजस्य का विज्ञान है।

1. मुख्य द्वार:
घर का मुख्य द्वार हमेशा उत्तर, पूर्व अथवा ईशान कोण में होना सर्वाधिक शुभ माना जाता है। प्रवेश द्वार पर सदैव स्वच्छता रखें और स्वास्तिक का प्रतीक लगाएं।

2. रसोई घर:
रसोई आग्नेय कोण में श्रेष्ठ मानी गई है। भोजन बनाते समय मुख पूर्व दिशा की ओर होना चाहिए।

3. पूजा स्थल:
ईशान कोण में पूजा घर की स्थापना करें। यहां भारी वस्तुएं अथवा कबाड़ कदापि न रखें।

4. शयनकक्ष:
गृहस्वामी का शयनकक्ष नैऋत्य कोण में होना चाहिए। सोते समय सिर दक्षिण या पूर्व दिशा में रखना स्वास्थ्यवर्धक होता है।`,
    author: 'आचार्य देवकीनंदन जोशी',
    authorAvatar: 'https://ui-avatars.com/api/?name=%E0%A4%A6%E0%A5%87%E0%A4%B5%E0%A4%95%E0%A5%80%E0%A4%A8%E0%A4%82%E0%A4%A6%E0%A4%A8+%E0%A4%9C%E0%A5%8B%E0%A4%B6%E0%A5%80&background=008080&color=fff&size=128',
    authorBio: 'आचार्य देवकीनंदन जोशी — ऋषिकेश एवं हरिद्वार क्षेत्र के सुप्रसिद्ध वैदिक वास्तु विशेषज्ञ तथा पंचांग-मुहूर्त विश्लेषक।',
    authorRole: 'वास्तु विशेषज्ञ',
    publishedAt: '2026-10-25',
    readTime: '5 मिनट',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'वास्तु शास्त्र दिशा नियम',
    tags: ['वास्तु शास्त्र', 'घर', 'सकारात्मक ऊर्जा', 'ईशान कोण'],
    views: 980,
    seo: {
      metaTitle: 'वास्तु शास्त्र के 10 सरल नियम | JyotishWala',
      metaDescription: 'घर की सुख-समृद्धि के लिए ईशान कोण, मुख्य द्वार, रसोई और शयनकक्ष के प्रमुख वास्तु नियम।',
      focusKeyword: 'वास्तु शास्त्र के नियम',
      canonicalUrl: 'https://jyotishwala.com/articles/daily-vastu-shastra-principles',
      internalLinks: [
        { anchorText: 'वास्तु दिशा कैलकुलेटर देखें', url: '#calculators' }
      ],
      externalLinks: [
        { anchorText: 'JyotishWala वास्तु ज्ञान', url: 'https://jyotishwala.com' }
      ]
    }
  }
];

export function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)));
}

export function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export function transformWordPressPostToArticle(post: any): Article {
  const title = decodeHtmlEntities(post.title?.rendered || 'ज्योतिष लेख');
  const rawExcerpt = decodeHtmlEntities(stripHtmlTags(post.excerpt?.rendered || ''));
  const rawContent = post.content?.rendered || '';
  const cleanContent = decodeHtmlEntities(
    rawContent
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '')
  ).trim();

  const featuredImg =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url ||
    post.featured_image_url ||
    'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80';

  const authorObj = post._embedded?.['author']?.[0];
  const authorName = decodeHtmlEntities(authorObj?.name || post.author_name || 'ज्योतिषवाला संपादकीय');
  const authorAvatar =
    authorObj?.avatar_urls?.['96'] ||
    authorObj?.avatar_urls?.['48'] ||
    authorObj?.avatar_urls?.['24'] ||
    post.author_avatar_urls?.['96'] ||
    post.author_avatar_urls?.['48'] ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=008080&color=fff&size=128`;
  const authorBio = decodeHtmlEntities(authorObj?.description || '');

  const wordCount = cleanContent.split(/\s+/).length;
  const readTime = `${Math.max(2, Math.round(wordCount / 180))} मिनट`;
  // Format real publish date from WordPress post.date
  let dateStr = '2026-11-01';
  if (post.date) {
    try {
      const d = new Date(post.date);
      if (!isNaN(d.getTime())) {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        dateStr = `${dd}/${mm}/${yyyy}`;
      } else {
        dateStr = post.date.split('T')[0];
      }
    } catch {
      dateStr = post.date.split('T')[0];
    }
  }

  return {
    id: `wp_${post.id}`,
    title,
    slug: post.slug || `post-${post.id}`,
    category: 'Kundli',
    categoryHindi: 'वैदिक ज्योतिष',
    excerpt: rawExcerpt || cleanContent.slice(0, 160) + '...',
    content: cleanContent,
    rawHtml: rawContent,
    author: authorName,
    authorAvatar: authorAvatar,
    authorBio: authorBio,
    authorRole: 'संपादक एवं लेखक, JyotishWala',
    publishedAt: dateStr,
    readTime,
    imageUrl: featuredImg,
    imageAlt: title,
    tags: ['ज्योतिष', 'सनातन धर्म', 'कुंडली', 'राशि', 'वेबसाइट'],
    views: Math.floor(Math.random() * 500) + 1200,
    sourceUrl: post.link,
    isWordPressPost: true,
    seo: {
      metaTitle: `${title} | JyotishWala`,
      metaDescription: rawExcerpt.slice(0, 155),
      focusKeyword: 'ज्योतिष',
      canonicalUrl: post.link || 'https://jyotishwala.com',
      internalLinks: [],
      externalLinks: []
    }
  };
}

let isSyncingWp = false;

export async function syncWordPressArticles(): Promise<Article[]> {
  if (isSyncingWp) return getArticles();
  isSyncingWp = true;
  try {
    let posts: any[] = [];
    // Fetch via server-side API Vault proxy endpoint (/api/wp-articles)
    try {
      const res = await fetch('/api/wp-articles');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.posts) && json.posts.length > 0) {
          posts = json.posts;
        }
      }
    } catch {
      // Server proxy offline or disabled in API Vault
    }

    if (Array.isArray(posts) && posts.length > 0) {
      const wpArticles = posts.map(transformWordPressPostToArticle);
      const current = getArticles();
      const customArticles = current.filter((a) => !a.id.startsWith('wp_') && !REMOVED_DUMMY_IDS.has(a.id));
      const merged = [...wpArticles, ...customArticles];
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(merged));
      notifyArticlesUpdated();
      return merged;
    }
  } catch (err) {
    console.warn('WordPress API sync notice:', err);
  } finally {
    isSyncingWp = false;
  }
  return getArticles();
}

function notifyArticlesUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('jw-articles-updated'));
  }
}

export function getArticles(): Article[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(INITIAL_ARTICLES));
      void syncWordPressArticles();
      return INITIAL_ARTICLES;
    }
    const parsed: Article[] = JSON.parse(data);
    const cleaned = parsed.filter((a) => !REMOVED_DUMMY_IDS.has(a.id));
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return INITIAL_ARTICLES;
  }
}

export async function syncArticlesFromServer(): Promise<Article[]> {
  return syncWordPressArticles();
}

async function pushArticlesToServer(articles: Article[]) {
  try {
    await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles })
    });
  } catch {
    // Ignore network error
  }
}

export function saveArticle(article: Article): Article {
  const articles = getArticles();
  const index = articles.findIndex((a) => a.id === article.id);
  if (index >= 0) {
    articles[index] = article;
  } else {
    articles.unshift(article);
  }
  localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
  notifyArticlesUpdated();
  void pushArticlesToServer(articles);
  return article;
}

export function deleteArticle(articleId: string) {
  let articles = getArticles();
  articles = articles.filter((a) => a.id !== articleId);
  localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
  notifyArticlesUpdated();
  void pushArticlesToServer(articles);
}

export function getArticleById(id: string): Article | undefined {
  return getArticles().find((a) => a.id === id);
}

// Background auto-sync timer for fresh website posts
if (typeof window !== 'undefined') {
  setTimeout(() => {
    void syncWordPressArticles();
  }, 1000);

  setInterval(() => {
    void syncWordPressArticles();
  }, 60000);

  window.addEventListener('focus', () => {
    void syncWordPressArticles();
  });
}


