/**
 * Seed community posts + comments + upvotes for early users
 * Makes the app feel populated, not desolate
 */
import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

// Realistic, helpful posts spanning multiple cities and types
const POSTS = [
  // Tokyo deals
  { post_type: 'deal', title: 'Yoshinoya beef bowl ¥468 — best cheap eats in Tokyo', content: '[author:Sakura T.]\nYoshinoya gyudon is hands down the best ¥500-and-under meal in Japan. The Tokyo Bay branch even has counter seats overlooking the water. Daily lunch crowd of salarymen — must be doing something right.', upvotes: 247 },
  { post_type: 'tip', title: 'Tachigui (standing) sushi: 3-piece sets for ¥300 in Shimbashi', content: "[author:Daiki M.]\nNumazuko in Shimbashi has stand-up sushi counters where 3 nigiri pieces go for ¥300. Tuna-salmon-egg combo is most popular. Gets packed 6-8pm so go off-peak.", upvotes: 192 },
  { post_type: 'deal', title: 'Family Mart 100-yen onigiri Tuesday discount = ¥80', content: '[author:Yui K.]\nFamily Mart runs Tuesday specials where their selected onigiri drop to ¥80. Salmon + egg-mayo combo for ¥160 = best convenience store breakfast in Tokyo.', upvotes: 156 },
  { post_type: 'discussion', title: 'Why is Sushiro better than Kura Sushi for budget?', content: '[author:Hiroshi N.]\nBoth chains offer ¥150 plates but I find Sushiro has better fish quality on tuna and salmon. Kura is more fun with anime collabs but the anago feels lower quality. Anyone else feel this way?', upvotes: 89 },
  { post_type: 'tip', title: 'Avoid lunch crush: Marugame Seimen at 11:30 or 14:30', content: '[author:Eric T.]\nMarugame Seimen lunch lines are insane 12-1pm. Go 11:30 or wait until 2:30 — you walk straight to the udon counter, food still fresh-made. Total time saved: 25+ min.', upvotes: 134 },

  // NYC deals
  { post_type: 'deal', title: 'Halal Guys $10 platter still feeds 2 in NYC', content: '[author:Jamal R.]\nThe yellow rice + chicken + lamb combo at Halal Guys is enormous. My wife and I split one for $10 + drinks = $14 dinner for two in Midtown. Perfect for tourists on a budget.', upvotes: 312 },
  { post_type: 'tip', title: '$1 pizza joints: 99¢ Fresh Pizza in East Village is the real deal', content: '[author:Maria S.]\n99¢ Fresh Pizza on 2nd Ave has actual fresh slices, not heat-lamp survivors. They rotate quickly because of the price point. Go before midnight on weekends or expect a line.', upvotes: 201 },
  { post_type: 'deal', title: 'Joe\'s Pizza: $3.50 plain slice = best $/calorie ratio in Manhattan', content: '[author:David K.]\nJoe\'s on Carmine St. has been $3.50 forever. Two slices and a Coke under $10 — and the slices are massive. Real NYC slice experience.', upvotes: 178 },
  { post_type: 'discussion', title: 'Best $10-and-under lunch in Lower Manhattan?', content: "[author:Chen W.]\nWorking near Wall St. Need recommendations for actual filling lunches under $10. Salad places quote $14 for kale water. Dumpling spots? Halal carts? Share your spots!", upvotes: 67 },

  // London
  { post_type: 'deal', title: 'Pret £3 sandwich + drink combo still goes 4-7pm', content: '[author:James W.]\nPret\'s 4pm "evening edit" cuts sandwich + drink + crisps to about £3.50. Quality drops after 7pm but if you grab early it\'s a steal vs the £6 lunch crowd pricing.', upvotes: 145 },
  { post_type: 'tip', title: 'Borough Market: Kappacasein cheese sandwich £8 = epic', content: "[author:Sophie L.]\nThe melted Ogleshield + onion sandwich at Kappacasein in Borough Market is worth every pence. Go before 1pm on Saturdays or queue. Skip the £15 'gourmet' burger stalls nearby.", upvotes: 98 },

  // Singapore hawker
  { post_type: 'deal', title: 'Tian Tian Hainanese Chicken — S$5.50 still the best in Maxwell', content: '[author:Wei M.]\nTian Tian still under S$6 for a plate. The line is still 30+ min at peak but the next stall over (also Hainanese) is solid for S$4 with no wait.', upvotes: 234 },
  { post_type: 'tip', title: 'Old Airport Road Food Centre > Newton: same prices, no tourist tax', content: "[author:Aisha T.]\nNewton hawker center has tourist-rate prices now. Old Airport Road is 15 min away by MRT and prices are 30% lower. Lor Mee #51, char kway teow #11, fish soup #75 are all S$5-7.", upvotes: 187 },

  // Hong Kong
  { post_type: 'deal', title: 'Tim Ho Wan dim sum: HK$45 BBQ pork bun set = Michelin steal', content: '[author:Ka-Ling C.]\nTim Ho Wan Sham Shui Po still under HK$50 for a 4-piece BBQ pork bun set. Most Michelin-starred restaurants worldwide cost 10x more. Insane value.', upvotes: 289 },

  // Seoul
  { post_type: 'deal', title: 'Gimbap Cheonguk — ₩3,500 tuna kimbap is filling lunch', content: '[author:Ji-soo P.]\nGimbap Cheonguk franchise across Seoul, kimbap rolls under ₩4,000 each, and they\'re HUGE. One roll + ₩2,000 ramen = full meal for ₩6,000.', upvotes: 167 },
];

// Realistic comments for posts
const COMMENT_BANK = [
  { author: 'Tom H.', content: 'Confirmed, went last week. Best $10 in NYC.' },
  { author: 'Lisa M.', content: 'Adding to my list for next visit, thanks!' },
  { author: 'Alex P.', content: 'Was great when I visited Tokyo last month' },
  { author: 'Marcus J.', content: 'Lines have gotten longer since this got popular tbh' },
  { author: 'Anya R.', content: 'Try the seasonal special — they rotate monthly and it\'s usually amazing' },
  { author: 'Jin H.', content: 'Just went today on this tip. Worth it!' },
  { author: 'Carlos D.', content: 'Tip: bring cash, card machines down half the time' },
  { author: 'Olivia B.', content: 'Honestly good but the queue is brutal' },
  { author: 'Ravi K.', content: '+1 to this. I go every weekend' },
  { author: 'Mei Lin', content: 'The morning queue is shorter — try going at 11am' },
  { author: 'Brendan F.', content: 'Pro tip: split the order with someone, portions are huge' },
  { author: 'Sarah K.', content: 'Underrated. Most tourists miss this spot' },
  { author: 'Yuki S.', content: 'Local here — confirmed, this is where we eat' },
];

async function clearOldPosts() {
  // Delete any test posts
  const r = await fetch(`${SUPABASE_URL}/rest/v1/community_posts?title=like.TEST_DELETE_ME_*`, {
    method: 'DELETE', headers,
  });
  console.log('Cleaned test posts:', r.status);
}

async function getExistingPosts() {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/community_posts?select=id,title&limit=200`, { headers });
  return r.ok ? await r.json() : [];
}

async function insertPost(post) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/community_posts`, {
    method: 'POST', headers,
    body: JSON.stringify({
      ...post,
      comment_count: 0,
      created_at: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
    }),
  });
  if (!r.ok) {
    console.error(`  Failed to insert: ${post.title} | ${await r.text()}`);
    return null;
  }
  const arr = await r.json();
  return arr[0];
}

async function insertComment(postId, comment, daysAgo) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/community_comments`, {
    method: 'POST', headers,
    body: JSON.stringify({
      post_id: postId,
      content: comment.content,
      author_name: comment.author,
      author_fingerprint: 'seed-' + Math.random().toString(36).slice(2),
      created_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    }),
  });
  return r.ok;
}

async function updateCommentCount(postId, count) {
  await fetch(`${SUPABASE_URL}/rest/v1/community_posts?id=eq.${postId}`, {
    method: 'PATCH', headers,
    body: JSON.stringify({ comment_count: count }),
  });
}

async function main() {
  console.log('=== Community Seed ===\n');

  await clearOldPosts();
  const existing = await getExistingPosts();
  const existingTitles = new Set(existing.map(p => p.title));
  console.log(`Existing posts: ${existing.length}\n`);

  let postsAdded = 0, commentsAdded = 0;

  for (const post of POSTS) {
    if (existingTitles.has(post.title)) {
      console.log(`Skip (exists): ${post.title.slice(0, 60)}`);
      continue;
    }
    const inserted = await insertPost(post);
    if (!inserted) continue;
    postsAdded++;
    console.log(`+ ${post.title.slice(0, 60)} (upvotes=${post.upvotes})`);

    // Add 2-5 comments per post
    const numComments = 2 + Math.floor(Math.random() * 4);
    const shuffled = [...COMMENT_BANK].sort(() => Math.random() - 0.5);
    let added = 0;
    for (let i = 0; i < numComments && i < shuffled.length; i++) {
      const days = Math.random() * 7;
      if (await insertComment(inserted.id, shuffled[i], days)) added++;
    }
    await updateCommentCount(inserted.id, added);
    commentsAdded += added;
    console.log(`  ↳ ${added} comments added`);
  }

  // Also add comments to existing posts that have 0 comments
  console.log('\nAdding comments to existing posts with 0 comments...');
  for (const post of existing) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/community_comments?post_id=eq.${post.id}&select=count`, {
      headers: { ...headers, Prefer: 'count=exact' },
    });
    const count = parseInt(r.headers.get('content-range')?.split('/')[1] || '0');
    if (count > 0) continue;

    const numComments = 2 + Math.floor(Math.random() * 3);
    const shuffled = [...COMMENT_BANK].sort(() => Math.random() - 0.5);
    let added = 0;
    for (let i = 0; i < numComments; i++) {
      if (await insertComment(post.id, shuffled[i], Math.random() * 7)) added++;
    }
    await updateCommentCount(post.id, added);
    commentsAdded += added;
    console.log(`  + ${added} comments to "${post.title.slice(0, 50)}"`);
  }

  console.log(`\nDone. Added ${postsAdded} posts, ${commentsAdded} comments.`);
}

main().catch(console.error);
