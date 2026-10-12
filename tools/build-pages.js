#!/usr/bin/env node
/*
 * Builds the inner pages of the site (privacy, terms, about, routes hub, Kadapa city page,
 * one page per popular route, 404) and sitemap.xml from the data in this file.
 *
 *   node tools/build-pages.js
 *
 * No dependencies. Edit the text below, run the command, commit the generated .html files.
 * The home page (index.html) is edited by hand.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const SITE = 'https://www.svrpackersandmovers.info';
const NAME = 'SVR Packers &amp; Movers';
const PHONE = '+91 85558 82980';
const TEL = '+918555882980';
const WA_NUMBER = '918555882980';
const EMAIL = 'chinnirakesh9955@gmail.com';
const GSTIN = '37DURPR1470K1ZV';
const GST_VERIFY = 'https://services.gst.gov.in/services/searchtp';
const ADDRESS = 'Near YSR Grand Inn, SLB Enclave, Y.S. Nagar, Kadapa, Andhra Pradesh — 516004';
const MAP_Q = '14.4624871,78.8312649';
const TODAY = new Date().toISOString().slice(0, 10);

// ───────────────────────────── helpers ─────────────────────────────
const plain = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&rsquo;/g, '’').replace(/\s+/g, ' ').trim();
const wa = text => `https://api.whatsapp.com/send?phone=${WA_NUMBER}&amp;text=${encodeURIComponent(text)}`;
const R = Math.PI / 180;
function haversine(a, b, c, d) { const x = Math.sin((c - a) * R / 2) ** 2 + Math.cos(a * R) * Math.cos(c * R) * Math.sin((d - b) * R / 2) ** 2; return 12742 * Math.asin(Math.sqrt(x)); }
const KADAPA = [14.4674, 78.8241];
const approxKm = (lat, lon) => Math.round(haversine(KADAPA[0], KADAPA[1], lat, lon) * 1.25 / 50) * 50;

// ───────────────────────────── data ─────────────────────────────
const ROUTES = [
  { slug: 'hyderabad', name: 'Hyderabad', state: 'Telangana', lat: 17.385, lon: 78.4867, bg: 'hyderabad-skyline-md',
    intro: 'Whether you are joining a new job in Hyderabad, shifting your family or moving an office, SVR Packers &amp; Movers plans the whole Kadapa to Hyderabad move with you: packing, loading, transport on our All India Permit vehicles, and unloading at your new place.',
    areas: 'Gachibowli, Kondapur, Madhapur, Hitec City, Kukatpally, Secunderabad, Uppal and nearby areas',
    tips: ['Many apartment communities in areas like Gachibowli, Kondapur and Madhapur ask movers to register in advance and book the lift or parking. Check your community\'s rules and tell us the allowed timings.',
      'Traffic in the city is lighter early in the morning and late in the evening, so we plan the unloading time with you.',
      'Keep the full address, a nearby landmark and a contact number ready for our driver on delivery day.'] },
  { slug: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946, bg: 'cargo-truck-md',
    intro: 'Moving from Kadapa to Bengaluru is one of the most common shifts for people changing jobs or studying. We handle the packing in Kadapa, the road transport, and the careful unloading at your flat or house in Bengaluru.',
    areas: 'Whitefield, Electronic City, HSR Layout, Marathahalli, Koramangala, Hebbal, Yelahanka and nearby areas',
    tips: ['Gated communities in Bengaluru often fix moving-in hours and may ask for prior intimation to the association. Please confirm the timings and any deposit before the move day.',
      'Large vehicles may not be allowed on some inner roads at peak hours. Tell us your exact address so we can plan the last stretch of the delivery.',
      'If your new flat is on a higher floor, tell us whether the lift can take furniture so we can plan the manpower.'] },
  { slug: 'chennai', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, bg: 'tata-truck-md',
    intro: 'We move households and offices from Kadapa to Chennai with proper packing and covered transport. Share your pick-up and drop addresses and we will confirm the plan and the estimate.',
    areas: 'OMR, Velachery, Tambaram, Anna Nagar, Adyar, Porur, Guindy and nearby areas',
    tips: ['During the northeast monsoon (roughly October to December), good wrapping matters more than ever. We use stretch film and sturdy cartons to protect furniture and electronics from damp.',
      'Many apartments in Chennai ask you to book the lift and inform the association before a move. Check the rules at your new address.',
      'Keep the new house keys and a contact person at the Chennai end, so unloading can start on arrival.'] },
  { slug: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lon: 83.2185, bg: 'vizag-coast-md',
    intro: 'Shifting from Kadapa to Visakhapatnam means a long run along the Andhra coast. We pack your goods carefully, move them in a covered vehicle and unload them where you want them in Vizag.',
    areas: 'Madhurawada, MVP Colony, Gajuwaka, Seethammadhara, Dwaraka Nagar, Rushikonda and nearby areas',
    tips: ['Vizag is humid and close to the sea. Wrapped furniture and well-sealed cartons help keep moisture away from wood, mattresses and electronics.',
      'Because it is a long route, book at least 5–7 days ahead, as we recommend for all long-distance moves.',
      'Tell us if the new place is on a hill or a narrow lane, so we can plan how the vehicle reaches the door.'] },
  { slug: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lon: 72.8777, bg: 'cargo-truck-md',
    intro: 'Kadapa to Mumbai is a long-distance move, and good planning matters. We pack in Kadapa, transport on our All India Permit vehicles and deliver in Mumbai, Thane, Navi Mumbai and nearby areas.',
    areas: 'Andheri, Powai, Thane, Navi Mumbai, Borivali, Dadar, Chembur and nearby areas',
    tips: ['Many societies in Mumbai have fixed moving hours and may ask for an intimation or a deposit. Please check with your society office before the move.',
      'Parking space near buildings can be limited, so share the exact access details and we will plan the unloading accordingly.',
      'Monsoon months need extra care. Ask us about waterproof wrapping for sofas, mattresses and electronics.'] },
  { slug: 'pune', name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567, bg: 'tata-truck-md',
    intro: 'People often move from Kadapa to Pune for work or education. SVR Packers &amp; Movers takes care of the packing, transport and unloading, so you can focus on settling in.',
    areas: 'Hinjewadi, Kharadi, Wakad, Baner, Hadapsar, Viman Nagar, Pimpri-Chinchwad and nearby areas',
    tips: ['Housing societies in Pune often have rules for moving days. Confirm the permitted timings and lift booking before you fix your date.',
      'Keep important documents, laptops and valuables with you rather than in the truck.',
      'If you are joining a job on a fixed date, share it with us when booking so we can plan the schedule around it.'] },
  { slug: 'delhi', name: 'Delhi', state: 'Delhi NCR', lat: 28.6139, lon: 77.209, bg: 'cargo-truck-md',
    intro: 'A move from Kadapa to Delhi NCR crosses several states, which is exactly what an All India Permit vehicle is for. We handle the packing, the long road journey and the delivery to your home or office.',
    areas: 'Delhi, Gurugram, Noida, Ghaziabad, Faridabad, Dwarka and nearby areas',
    tips: ['Heavy vehicles often face entry timings in Delhi NCR, so delivery may need to be planned for the permitted hours. Tell us your exact address and we will plan the final stretch with you.',
      'This is a long-distance route, so book early. We recommend 5–7 days ahead or more for peak dates.',
      'Pack a bag with essentials, such as clothes, chargers and medicines, to keep with you until the goods arrive.'] },
  { slug: 'kolkata', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639, bg: 'tata-truck-md',
    intro: 'We move homes and offices from Kadapa to Kolkata along the east coast route. Share your details and we will plan the packing, the long haul and the delivery.',
    areas: 'Salt Lake, New Town, Howrah, Behala, Garia, Dum Dum and nearby areas',
    tips: ['Some older neighbourhoods in Kolkata have narrow lanes where a large vehicle cannot reach the door. Tell us the access so we can plan the unloading.',
      'Check your building\'s rules for moving hours and lift use, and let us know in advance.',
      'On long routes it helps to keep a clear inventory list of your boxes. Label each box by room.'] },
];
ROUTES.forEach(r => { r.km = approxKm(r.lat, r.lon); r.path = `/packers-movers-kadapa-to-${r.slug}`; });

// ───────────────────────────── layout ─────────────────────────────
function jsonld(obj) { return `  <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n  </script>\n`; }
function breadcrumbLd(items) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: plain(c[0]), item: SITE + c[1] })) };
}
function faqLd(faqs) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: plain(f[0]), acceptedAnswer: { '@type': 'Answer', text: plain(f[1]) } })) };
}
const providerLd = { '@type': 'MovingCompany', name: plain(NAME), url: SITE + '/', telephone: TEL, taxID: GSTIN,
  address: { '@type': 'PostalAddress', streetAddress: 'Near YSR Grand Inn, SLB Enclave, Y.S. Nagar', addressLocality: 'Kadapa', addressRegion: 'Andhra Pradesh', postalCode: '516004', addressCountry: 'IN' } };

function page({ file, path: p, title, desc, crumbs, hero, body, schema = [], noindex = false, bodyClass = '' }) {
  const url = SITE + p;
  const ld = schema.map(jsonld).join('');
  const crumbHtml = crumbs ? `  <nav class="crumbs" aria-label="Breadcrumb"><div class="wrap"><ol>${crumbs.map((c, i) => i === crumbs.length - 1 ? `<li aria-current="page">${c[0]}</li>` : `<li><a href="${c[1]}">${c[0]}</a></li>`).join('')}</ol></div></nav>\n` : '';
  const routeLinks = ROUTES.map(r => `<li><a href="${r.path}">Kadapa to ${r.name}</a></li>`).join('\n          ');
  const html = `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <meta name="theme-color" content="#0D0D0D" />
  <meta name="robots" content="${noindex ? 'noindex' : 'index, follow, max-image-preview:large'}" />
${noindex ? '' : `  <link rel="canonical" href="${url}" />\n`}  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}/og-image.jpg" />
  <meta property="og:locale" content="en_IN" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="preload" href="/fonts/space-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/page.css" />
${ld}</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
  <a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-header">
    <div class="wrap">
      <a href="/" aria-label="${NAME} — home"><img src="/Logo-New-White.avif" alt="${NAME}" width="826" height="372" /></a>
      <nav class="site-nav" aria-label="Main">
        <a href="/">Home</a>
        <a href="/#services">Services</a>
        <a href="/routes">Routes</a>
        <a href="/about">About</a>
        <a class="btn" href="tel:${TEL}">Call ${PHONE}</a>
      </nav>
    </div>
  </header>
${crumbHtml}  <main id="main" tabindex="-1">
${hero || ''}${body}
  </main>
  <footer class="site-footer">
    <div class="wrap">
      <div class="cols">
        <div>
          <h2 class="fh">${NAME}</h2>
          <p>${ADDRESS}</p>
          <p><a href="tel:${TEL}">${PHONE}</a><br /><a href="mailto:${EMAIL}">${EMAIL}</a></p>
          <p>GSTIN: ${GSTIN} · <a href="${GST_VERIFY}" target="_blank" rel="noopener noreferrer">Verify on GST portal</a></p>
        </div>
        <div>
          <h2 class="fh">Pages</h2>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About us</a></li>
            <li><a href="/packers-and-movers-in-kadapa">Packers &amp; Movers in Kadapa</a></li>
            <li><a href="/routes">All routes</a></li>
            <li><a href="/#contact">Request a quote</a></li>
          </ul>
        </div>
        <div>
          <h2 class="fh">Popular routes</h2>
          <ul>
          ${routeLinks}
          </ul>
        </div>
        <div>
          <h2 class="fh">Legal</h2>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms &amp; Conditions</a></li>
          </ul>
        </div>
      </div>
      <div class="legal"><span>© ${new Date().getFullYear()} ${NAME}. All rights reserved.</span><a href="/">Back to home</a></div>
    </div>
  </footer>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, file), html);
  return { file, loc: p, noindex };
}

const heroBlock = ({ eyebrow, h1, lead, bg, actions }) => `    <section class="page-hero" style="--bg:url('/stock_images/${bg}.webp')">
      <div class="wrap">
        <span class="eyebrow">${eyebrow}</span>
        <h1>${h1}</h1>
        <p class="lead">${lead}</p>
        <div class="hero-actions">${actions}</div>
      </div>
    </section>
`;
const ctaBlock = (waText, heading = 'Ready to plan your move?') => `    <section class="cta">
      <div class="wrap">
        <h2>${heading}</h2>
        <p>Tell us what you are moving and where. We will reply with a clear estimate.</p>
        <div class="hero-actions">
          <a class="btn wa" href="${wa(waText)}" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
          <a class="btn ghost" href="tel:${TEL}">Call ${PHONE}</a>
        </div>
      </div>
    </section>
`;
const faqHtml = faqs => `<div class="faq">${faqs.map(f => `<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}</div>`;

const generated = [];

// ───────────────────────────── route pages ─────────────────────────────
for (const r of ROUTES) {
  const waText = `Hello, I need a quote for house shifting from Kadapa to ${r.name}.`;
  const faqs = [
    [`How much does it cost to move from Kadapa to ${r.name}?`, `The cost depends on how much you are moving, the floor and lift access at both ends, the packing materials needed and the type of vehicle. Share your details on WhatsApp and we will reply with a clear estimate before you decide.`],
    [`How long does a Kadapa to ${r.name} move take?`, `It depends on the distance of about ${r.km} km, the size of the load, and road and weather conditions. We tell you the expected delivery date when your booking is confirmed.`],
    [`Do I need permission from my society or building for the move?`, `Many apartment communities in ${r.name} ask for prior intimation or a booking for the lift and parking. Please check with your society or landlord at both ends and tell us the timings, so we can plan around them.`],
    [`Can you also move my car or bike from Kadapa to ${r.name}?`, `Yes. We handle car and bike transport along with household goods. Mention it when you ask for a quote.`],
  ];
  const title = `Packers and Movers Kadapa to ${r.name} | SVR Packers &amp; Movers`;
  const desc = `House shifting, office shifting and car &amp; bike transport from Kadapa to ${r.name} with SVR Packers &amp; Movers. All India Permit. Call ${PHONE}.`;
  const steps = [
    ['Share your details', `Call or WhatsApp us with your pick-up address in Kadapa, your drop address in ${r.name}, the items to move and your preferred date.`],
    ['Get a clear estimate', 'We prepare an estimate based on your actual move, with no surprises later.'],
    ['We pack and load', 'Our crew arrives with bubble wrap, stretch film, corrugated sheets and sturdy cartons, packs every item and loads it carefully.'],
    ['Transport and delivery', `Your goods travel on an All India Permit vehicle to ${r.name}. We unload and place items in the right rooms.`],
  ];
  const body = `    <section class="section">
      <div class="wrap">
        <div class="facts">
          <div class="fact"><span>Route</span><strong>Kadapa → ${r.name}</strong><small>${r.state}</small></div>
          <div class="fact"><span>Approx. distance</span><strong>About ${r.km} km</strong><small>Approximate road distance</small></div>
          <div class="fact"><span>Services</span><strong>Home &amp; office</strong><small>Car &amp; bike transport too</small></div>
          <div class="fact"><span>Vehicle</span><strong>All India Permit</strong><small>Move across states</small></div>
        </div>
      </div>
    </section>
    <section class="section alt">
      <div class="wrap prose">
        <h2>House shifting from Kadapa to ${r.name}</h2>
        <p>${r.intro}</p>
        <p>We deliver across ${r.name}, including ${r.areas}. Tell us your exact drop address when you ask for a quote.</p>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <h2>How your Kadapa to ${r.name} move works</h2>
        <p class="sub">Four simple steps, from your first call to settling in.</p>
        <div class="grid c4">${steps.map((s, i) => `<div class="card"><span class="num">${i + 1}</span><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('')}</div>
      </div>
    </section>
    <section class="section alt">
      <div class="wrap">
        <div class="grid c2">
          <div>
            <h2>What we can move for you</h2>
            <p class="sub">Everything from a few boxes to a full house or office.</p>
            <ul class="ticks">
              <li>House shifting: furniture, appliances, kitchen and clothes</li>
              <li>Office shifting: desks, files and IT equipment</li>
              <li>Packing and unpacking with quality materials</li>
              <li>Loading and unloading by trained hands</li>
              <li>Car and bike transport with your household goods</li>
              <li>Short-term storage between homes, on request</li>
            </ul>
          </div>
          <div>
            <h2>Tips for moving to ${r.name}</h2>
            <p class="sub">A few things worth knowing before you fix your date.</p>
            <ul class="ticks">${r.tips.map(t => `<li>${t}</li>`).join('')}</ul>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <h2>Questions about moving from Kadapa to ${r.name}</h2>
        <p class="sub">Not finding your answer? Call or WhatsApp us and we will help.</p>
        ${faqHtml(faqs)}
      </div>
    </section>
    <section class="section alt">
      <div class="wrap">
        <h2>Other routes from Kadapa</h2>
        <p class="sub">We move across India. Here are some of our popular routes.</p>
        <div class="grid c4">${ROUTES.filter(x => x !== r).map(x => `<a class="card" href="${x.path}"><h3>Kadapa → ${x.name}</h3><p>About ${x.km} km · ${x.state}</p><span class="go">View route →</span></a>`).join('')}</div>
      </div>
    </section>
${ctaBlock(waText, `Moving from Kadapa to ${r.name}?`)}`;
  generated.push(page({
    file: `packers-movers-kadapa-to-${r.slug}.html`, path: r.path, title, desc,
    crumbs: [['Home', '/'], ['Routes', '/routes'], [`Kadapa to ${r.name}`, r.path]],
    hero: heroBlock({ eyebrow: `Kadapa → ${r.name}`, h1: `Packers and Movers from Kadapa to ${r.name}`, lead: `Safe house shifting, office shifting and car &amp; bike transport from Kadapa to ${r.name}, with packing, loading, transport and unloading handled by one team.`, bg: r.bg,
      actions: `<a class="btn wa" href="${wa(waText)}" target="_blank" rel="noopener noreferrer">Get a quote on WhatsApp</a><a class="btn ghost" href="tel:${TEL}">Call ${PHONE}</a>` }),
    body,
    schema: [
      breadcrumbLd([['Home', '/'], ['Routes', '/routes'], [`Kadapa to ${r.name}`, r.path]]),
      { '@context': 'https://schema.org', '@type': 'Service', serviceType: 'Packers and movers', name: `Packers and movers from Kadapa to ${r.name}`, url: SITE + r.path, provider: providerLd,
        areaServed: [{ '@type': 'City', name: 'Kadapa' }, { '@type': 'City', name: r.name }], description: plain(desc) },
      faqLd(faqs),
    ],
  }));
}

// ───────────────────────────── Kadapa city page ─────────────────────────────
{
  const faqs = [
    ['Do you handle house shifting within Kadapa?', 'Yes. Local shifting within Kadapa and nearby areas is one of our core services. We handle packing, loading, transport, unloading and placing your items.'],
    ['Which areas around Kadapa do you cover?', 'Besides Kadapa city, we move households from nearby towns of Kadapa district such as Proddatur, Pulivendula, Rayachoty and Jammalamadugu. Call us with your location and we will confirm.'],
    ['Can I visit your office in Kadapa?', `Yes. Our office is at ${ADDRESS}. You are welcome to visit, or you can call ${PHONE} before you come.`],
    ['How early should I book a local move in Kadapa?', 'We recommend booking at least 2–3 days in advance for local moves. We also try to accommodate last-minute requests, so please call us.'],
  ];
  const waText = 'Hello, I need a quote for house shifting in Kadapa.';
  const body = `    <section class="section">
      <div class="wrap prose">
        <h2>Local and long-distance moves from Kadapa</h2>
        <p>SVR Packers &amp; Movers is based in Y.S. Nagar, Kadapa. We help families, students, professionals and businesses move homes and offices within Kadapa, across Andhra Pradesh and to any city in India with our All India Permit.</p>
        <p>Every move includes careful packing with quality materials, loading by trained hands, safe transport, and unloading at your new place.</p>
      </div>
    </section>
    <section class="section alt">
      <div class="wrap">
        <h2>Our services in Kadapa</h2>
        <p class="sub">Choose what you need, or ask us for a complete move.</p>
        <div class="grid c4">
          <div class="card"><h3>Local shifting</h3><p>Fast, reliable shifting within Kadapa and nearby areas.</p></div>
          <div class="card"><h3>Long distance shifting</h3><p>Household and office goods delivered safely to other states.</p></div>
          <div class="card"><h3>Packing &amp; unpacking</h3><p>Bubble wrap, stretch film and sturdy cartons for every item.</p></div>
          <div class="card"><h3>Car &amp; bike transport</h3><p>Your vehicle moves together with your household goods.</p></div>
          <div class="card"><h3>Office shifting</h3><p>Desks, files and IT equipment with minimal downtime.</p></div>
          <div class="card"><h3>Loading &amp; unloading</h3><p>Trained hands for heavy furniture and appliances.</p></div>
          <div class="card"><h3>Storage</h3><p>Short-term storage between homes, on request.</p></div>
          <div class="card"><h3>All India Permit</h3><p>Authorised to move goods across state borders.</p></div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <h2>Popular routes from Kadapa</h2>
        <p class="sub">Moving out of Kadapa? See the routes we handle most often.</p>
        <div class="grid c4">${ROUTES.map(x => `<a class="card" href="${x.path}"><h3>Kadapa → ${x.name}</h3><p>About ${x.km} km · ${x.state}</p><span class="go">View route →</span></a>`).join('')}</div>
      </div>
    </section>
    <section class="section alt">
      <div class="wrap">
        <h2>Visit our Kadapa office</h2>
        <p class="sub">${ADDRESS}</p>
        <p><a class="btn line" href="https://www.google.com/maps?q=${MAP_Q}" target="_blank" rel="noopener noreferrer">Get directions</a></p>
        <div class="map-embed"><iframe title="Map showing ${plain(NAME)} in Y.S. Nagar, Kadapa" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${MAP_Q}&amp;z=15&amp;output=embed"></iframe></div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <h2>Questions about packers and movers in Kadapa</h2>
        ${faqHtml(faqs)}
      </div>
    </section>
${ctaBlock(waText, 'Need packers and movers in Kadapa?')}`;
  generated.push(page({
    file: 'packers-and-movers-in-kadapa.html', path: '/packers-and-movers-in-kadapa',
    title: 'Packers and Movers in Kadapa | House Shifting | SVR Packers &amp; Movers',
    desc: `Trusted packers and movers in Kadapa, Andhra Pradesh. House shifting, office shifting, car &amp; bike transport and All India Permit. Call ${PHONE}.`,
    crumbs: [['Home', '/'], ['Packers and Movers in Kadapa', '/packers-and-movers-in-kadapa']],
    hero: heroBlock({ eyebrow: 'Kadapa, Andhra Pradesh', h1: 'Packers and Movers in Kadapa', lead: 'Safe packing, careful loading and on-time delivery for local and long-distance house shifting from Kadapa.', bg: 'vijayawada-bridge-md',
      actions: `<a class="btn wa" href="${wa(waText)}" target="_blank" rel="noopener noreferrer">Get a quote on WhatsApp</a><a class="btn ghost" href="tel:${TEL}">Call ${PHONE}</a>` }),
    body,
    schema: [breadcrumbLd([['Home', '/'], ['Packers and Movers in Kadapa', '/packers-and-movers-in-kadapa']]),
      { '@context': 'https://schema.org', '@type': 'Service', serviceType: 'Packers and movers', name: 'Packers and movers in Kadapa', url: SITE + '/packers-and-movers-in-kadapa', provider: providerLd, areaServed: [{ '@type': 'City', name: 'Kadapa' }, { '@type': 'AdministrativeArea', name: 'Andhra Pradesh' }] },
      faqLd(faqs)],
  }));
}

// ───────────────────────────── routes hub ─────────────────────────────
generated.push(page({
  file: 'routes.html', path: '/routes',
  title: 'Packers and Movers Routes from Kadapa | SVR Packers &amp; Movers',
  desc: `See the popular routes SVR Packers &amp; Movers handles from Kadapa: Hyderabad, Bengaluru, Chennai, Visakhapatnam, Mumbai, Pune, Delhi and Kolkata. Call ${PHONE}.`,
  crumbs: [['Home', '/'], ['Routes', '/routes']],
  hero: heroBlock({ eyebrow: 'Routes', h1: 'Packers and Movers Routes from Kadapa', lead: 'With an All India Permit we move households and offices across states. These are the routes people ask for most often.', bg: 'tata-truck-md',
    actions: `<a class="btn wa" href="${wa('Hello, I need a quote for shifting from Kadapa.')}" target="_blank" rel="noopener noreferrer">Get a quote on WhatsApp</a><a class="btn ghost" href="tel:${TEL}">Call ${PHONE}</a>` }),
  body: `    <section class="section">
      <div class="wrap">
        <h2>All routes</h2>
        <p class="sub">Choose a route to see how your move works, with tips and answers to common questions.</p>
        <div class="grid c4">${ROUTES.map(x => `<a class="card" href="${x.path}"><h3>Kadapa → ${x.name}</h3><p>About ${x.km} km · ${x.state}</p><span class="go">View route →</span></a>`).join('')}</div>
        <div class="prose"><p>Do not see your city? Call us on <a href="tel:${TEL}">${PHONE}</a>. If we can reach it, we will move you there.</p></div>
      </div>
    </section>
${ctaBlock('Hello, I need a quote for shifting from Kadapa.')}`,
  schema: [breadcrumbLd([['Home', '/'], ['Routes', '/routes']]),
    { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Routes from Kadapa', itemListElement: ROUTES.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: `Kadapa to ${x.name}`, url: SITE + x.path })) }],
}));

// ───────────────────────────── about ─────────────────────────────
generated.push(page({
  file: 'about.html', path: '/about',
  title: 'About SVR Packers &amp; Movers | Packers and Movers in Kadapa',
  desc: `About SVR Packers &amp; Movers, a GST-registered packers and movers company in Kadapa, Andhra Pradesh, with an All India Permit. Call ${PHONE}.`,
  crumbs: [['Home', '/'], ['About us', '/about']],
  hero: heroBlock({ eyebrow: 'About us', h1: 'About SVR Packers &amp; Movers', lead: 'A packers and movers company in Kadapa, Andhra Pradesh, helping families and businesses move safely, locally and across India.', bg: 'vizag-sunset-md',
    actions: `<a class="btn wa" href="${wa('Hello, I want to know more about your services.')}" target="_blank" rel="noopener noreferrer">Talk to us on WhatsApp</a><a class="btn ghost" href="tel:${TEL}">Call ${PHONE}</a>` }),
  body: `    <section class="section">
      <div class="wrap prose">
        <h2>Who we are</h2>
        <p>SVR Packers &amp; Movers is a packers and movers company based in Y.S. Nagar, Kadapa. We handle house shifting, office shifting, car and bike transport, packing and unpacking, loading and unloading, and short-term storage, within Kadapa, across Andhra Pradesh and to any city in India.</p>
        <!-- OWNER: add the founding year, team size, fleet and your story here. -->
        <h2>How we work</h2>
        <ul>
          <li>A clear estimate before we start, based on your actual move.</li>
          <li>Quality packing materials: bubble wrap, stretch film, corrugated sheets and sturdy cartons.</li>
          <li>Trained hands for loading and unloading, and vehicles with an All India Permit.</li>
          <li>Direct support by phone and WhatsApp, from the first quote to delivery.</li>
        </ul>
      </div>
    </section>
    <section class="section alt">
      <div class="wrap">
        <h2>Registration and credentials</h2>
        <p class="sub">You can check our business details yourself.</p>
        <div class="grid c3">
          <div class="card"><h3>GST registered</h3><p>GSTIN ${GSTIN}. <a href="${GST_VERIFY}" target="_blank" rel="noopener noreferrer">Verify on the GST portal</a> (search by GSTIN).</p></div>
          <div class="card"><h3>All India Permit</h3><p>Our vehicles are authorised to carry goods across state borders.</p></div>
          <div class="card"><h3>A real office you can visit</h3><p>${ADDRESS}</p></div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <h2>Find us</h2>
        <p class="sub">${ADDRESS}</p>
        <p><a class="btn line" href="https://www.google.com/maps?q=${MAP_Q}" target="_blank" rel="noopener noreferrer">Get directions</a></p>
        <div class="map-embed"><iframe title="Map showing ${plain(NAME)} in Y.S. Nagar, Kadapa" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${MAP_Q}&amp;z=15&amp;output=embed"></iframe></div>
      </div>
    </section>
${ctaBlock('Hello, I want to know more about your services.', 'Planning a move?')}`,
  schema: [breadcrumbLd([['Home', '/'], ['About us', '/about']]),
    { '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About SVR Packers & Movers', url: SITE + '/about', mainEntity: providerLd }],
}));

// ───────────────────────────── privacy ─────────────────────────────
generated.push(page({
  file: 'privacy.html', path: '/privacy',
  title: 'Privacy Policy | SVR Packers &amp; Movers',
  desc: 'How SVR Packers &amp; Movers, Kadapa, collects, uses and protects the personal information you share when you request a quote or contact us.',
  crumbs: [['Home', '/'], ['Privacy Policy', '/privacy']],
  body: `    <section class="section">
      <div class="wrap prose">
        <h1 style="font-size:clamp(2rem,5vw,2.8rem);line-height:1.1;letter-spacing:-.02em">Privacy Policy</h1>
        <p class="updated">Last updated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <!-- Template written in plain language to reflect India's Digital Personal Data Protection Act, 2023. Have the owner or a legal adviser review it. -->
        <p>This notice explains what personal data ${NAME} ("we", "us") collects when you use this website or contact us, why we need it, and the choices and rights you have. We keep it simple: this website has no accounts, does not store your quote details on a server, and we do not sell your information.</p>

        <h2>1. Who is responsible</h2>
        <div class="box"><p><strong>${NAME}</strong><br />${ADDRESS}<br />Phone: <a href="tel:${TEL}">${PHONE}</a><br />Email: <a href="mailto:${EMAIL}">${EMAIL}</a><br />GSTIN: ${GSTIN}</p></div>

        <h2>2. What personal data we handle</h2>
        <ul>
          <li><strong>Details you share to get a quote or book a move:</strong> your name, phone number, pick-up and drop locations, type of service, preferred date, and anything you write in the details box, such as the items to be moved.</li>
          <li><strong>Records of calls, WhatsApp messages and emails</strong> you exchange with us.</li>
          <li><strong>Basic visit statistics</strong> about how the website is used, collected in aggregate through Vercel Web Analytics. We do not use this to identify you.</li>
        </ul>

        <h2>3. Why we use it</h2>
        <ul>
          <li>To prepare your quote and plan your move.</li>
          <li>To carry out the move, and to contact you about pick-up, delivery and any changes.</li>
          <li>To keep business, tax and accounting records that the law requires.</li>
          <li>To understand how many people visit the website, so we can improve it.</li>
        </ul>
        <p>We use your data only for these purposes.</p>

        <h2>4. How the quote form works</h2>
        <p>When you fill in the "Request a Quote" form, the website does not send your details to a server. It opens WhatsApp with a message already written from what you typed. Nothing reaches us until you press send in WhatsApp. WhatsApp is provided by Meta and handles messages under <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">its own privacy policy</a>.</p>

        <h2>5. Your consent, and withdrawing it</h2>
        <p>You choose what to share with us, and by sending us your details you agree that we may use them for the purposes above. You can withdraw that consent at any time by telling us on the phone number or email above. If you withdraw it, we will stop using your details for your enquiry, except where we must keep records by law or to finish a move already booked.</p>

        <h2>6. Cookies and third-party services</h2>
        <ul>
          <li>We do not set advertising or tracking cookies, and the website's fonts and images are served from the site itself.</li>
          <li><strong>Google Maps.</strong> The contact section and some pages show an embedded Google map. When it loads, Google may receive technical information such as your IP address, under <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's privacy policy</a>.</li>
          <li><strong>Vercel</strong> hosts this website and provides the aggregate analytics mentioned above.</li>
          <li>Links to other websites, such as the GST portal, are governed by those websites' own policies.</li>
        </ul>

        <h2>7. Who we share it with</h2>
        <p>Only the people who need it to complete your move, such as our packing crew and drivers, and authorities where the law requires. We do not sell your data or share it with others for their own marketing.</p>

        <h2>8. How we protect it</h2>
        <p>We keep your details to the people who need them and take reasonable steps to prevent loss or misuse. No method of storage or transmission is completely secure, so please avoid sending highly sensitive information such as bank passwords.</p>

        <h2>9. How long we keep it</h2>
        <p>We keep move-related details for as long as needed to serve you and to meet our legal and accounting obligations. After that, we delete or anonymise them.</p>

        <h2>10. Your rights</h2>
        <p>Under the Digital Personal Data Protection Act, 2023, you may ask us to:</p>
        <ul>
          <li>tell you what personal data of yours we hold and how we use it;</li>
          <li>correct or complete inaccurate data;</li>
          <li>erase your data, unless we need to keep it by law;</li>
          <li>address a grievance about how we handle your data; and</li>
          <li>nominate another person to exercise these rights if you are unable to.</li>
        </ul>
        <p>To use any of these rights, contact us using the details in section 1. We will respond as soon as we reasonably can.</p>

        <h2>11. If you are not satisfied</h2>
        <p>Please contact us first so we can try to resolve the matter. If you are still not satisfied, you can make a complaint to the Data Protection Board of India, as provided in the Act.</p>

        <h2>12. Children</h2>
        <p>This website is for adults arranging a move. We do not knowingly collect personal data of children. If you think a child has shared data with us, please contact us and we will delete it.</p>

        <h2>13. Changes to this notice</h2>
        <p>If we change this notice, we will update the date at the top of this page.</p>
      </div>
    </section>`,
  schema: [breadcrumbLd([['Home', '/'], ['Privacy Policy', '/privacy']])],
}));

// ───────────────────────────── terms ─────────────────────────────
generated.push(page({
  file: 'terms.html', path: '/terms',
  title: 'Terms &amp; Conditions | SVR Packers &amp; Movers',
  desc: 'Terms and conditions for moves booked with SVR Packers &amp; Movers, Kadapa: quotations, payment, cancellation, items we cannot carry, damage claims and website use.',
  crumbs: [['Home', '/'], ['Terms &amp; Conditions', '/terms']],
  body: `    <section class="section">
      <div class="wrap prose">
        <h1 style="font-size:clamp(2rem,5vw,2.8rem);line-height:1.1;letter-spacing:-.02em">Terms &amp; Conditions</h1>
        <p class="updated">Last updated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <!-- Template based on common packers-and-movers practice in India. Have the owner or a legal adviser review it, and adjust payment, cancellation and claim terms to match how the business actually works. -->
        <p>These terms apply when you book a move or any other service with ${NAME} ("we", "us"), and when you use this website. Please read them together with your quotation. If your written quotation says something different, the quotation applies.</p>

        <h2>1. Quotations and booking</h2>
        <ul>
          <li>We prepare a quotation from the details you give us: items, addresses, floors, lift access, distance and date. Please be accurate. If the actual load or conditions are different, the price may change, and we will tell you before we proceed.</li>
          <li>A booking is confirmed when we confirm the date with you, and any advance agreed in the quotation is paid.</li>
        </ul>

        <h2>2. Payment</h2>
        <ul>
          <li>Payment terms, including any advance and the balance due on delivery, are stated in your quotation.</li>
          <li>Please ask for a receipt or bill for every payment. Our GSTIN is ${GSTIN}.</li>
        </ul>

        <h2>3. Packing, loading and transport</h2>
        <ul>
          <li>We pack with materials such as bubble wrap, stretch film, corrugated sheets and cartons, and load your goods carefully.</li>
          <li>Please be present, or have someone you trust present, to check the items as they are packed and loaded.</li>
          <li>Goods are transported on our vehicles, which carry an All India Permit for moves between states.</li>
        </ul>

        <h2>4. Items we cannot carry</h2>
        <p>For safety and legal reasons we cannot carry perishable food, flammable or hazardous goods such as gas cylinders, chemicals and fuel, illegal items, or cash, jewellery and important documents. Please keep these with you. If you want us to carry any unusual or very valuable item, tell us in advance.</p>

        <h2>5. Access, permissions and your responsibilities</h2>
        <ul>
          <li>You are responsible for arranging permission from your society, building or landlord for the move, including lift and parking, at both addresses.</li>
          <li>Please make sure our crew and vehicle can reach the premises at the agreed time. Delays, extra waiting or extra carrying caused by access problems may attract additional charges.</li>
          <li>Disconnecting and reconnecting appliances such as air conditioners needs a technician, which you should arrange unless we have agreed otherwise in writing.</li>
        </ul>

        <h2>6. Delivery</h2>
        <p>We give an expected delivery date when your booking is confirmed. Delivery times depend on distance, road and weather conditions, permits and other factors, so they are estimates. We will keep you informed if there is a delay.</p>

        <h2>7. Cancellation and rescheduling</h2>
        <p>Please tell us as early as possible if you need to cancel or change your date. Any charges for cancellation or rescheduling, and whether an advance is refundable, are as stated in your quotation or agreed with you in writing.</p>

        <h2>8. Damage, loss and claims</h2>
        <ul>
          <li>Please check your goods when they are delivered, and tell us about any damage or missing items as soon as possible, ideally the same day, with photographs.</li>
          <li>Please do not discard damaged packing or items until we have had the chance to inspect them.</li>
          <li>We will look into every claim fairly. Our responsibility is limited as set out in your quotation or agreement, and any goods-in-transit insurance applies only if it has been arranged and the policy terms are met.</li>
        </ul>

        <h2>9. Events beyond our control</h2>
        <p>We are not responsible for delay or failure caused by things outside our reasonable control, such as natural disasters, floods, strikes, road closures, accidents on the route, or government orders.</p>

        <h2>10. Using this website</h2>
        <ul>
          <li>The content, photos and logo on this website belong to us or are used with permission. Please do not copy them without our permission.</li>
          <li>We try to keep the website accurate, but it is provided as general information and is not a binding quotation.</li>
          <li>We are not responsible for the content of other websites we link to.</li>
        </ul>

        <h2>11. Governing law</h2>
        <p>These terms are governed by the laws of India. Any dispute that cannot be settled by discussion is subject to the courts at Kadapa, Andhra Pradesh.</p>

        <h2>12. Contact</h2>
        <div class="box"><p><strong>${NAME}</strong><br />${ADDRESS}<br />Phone: <a href="tel:${TEL}">${PHONE}</a><br />Email: <a href="mailto:${EMAIL}">${EMAIL}</a></p></div>
        <p>See also our <a href="/privacy">Privacy Policy</a>.</p>
      </div>
    </section>`,
  schema: [breadcrumbLd([['Home', '/'], ['Terms & Conditions', '/terms']])],
}));

// ───────────────────────────── 404 ─────────────────────────────
generated.push(page({
  file: '404.html', path: '/404', noindex: true,
  title: 'Page not found | SVR Packers &amp; Movers',
  desc: `The page you are looking for could not be found. Visit the SVR Packers &amp; Movers home page or call ${PHONE}.`,
  body: `    <section class="nf">
      <div class="code" aria-hidden="true">404</div>
      <h1>This page took a wrong turn</h1>
      <p>We could not find the page you were looking for. Head back home, or call us and we will help you with your move.</p>
      <div class="hero-actions"><a class="btn" href="/">Go to home page</a><a class="btn ghost" href="tel:${TEL}">Call ${PHONE}</a></div>
    </section>`,
}));

// ───────────────────────────── sitemap ─────────────────────────────
const urls = [{ loc: '/', priority: '1.0' }, ...generated.filter(g => !g.noindex).map(g => ({ loc: g.loc, priority: g.loc.startsWith('/packers-movers-kadapa-to') ? '0.8' : (g.loc === '/privacy' || g.loc === '/terms') ? '0.3' : '0.7' }))];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url>\n    <loc>${SITE}${u.loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}\n</urlset>\n`);

console.log(`built ${generated.length} pages + sitemap (${urls.length} urls)`);
console.log(ROUTES.map(r => `${r.name}: ~${r.km} km`).join(' | '));
