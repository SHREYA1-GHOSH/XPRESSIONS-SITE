const artists = [
  { name: 'Artist 1', genre: 'Live music · Headliner', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85' },
  { name: 'Artist 2', genre: 'Independent music · Live set', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85' },
  { name: 'Artist 3', genre: 'Dance · Movement ensemble', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=85' },
  { name: 'Artist 4', genre: 'Singer-songwriter · Acoustic', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85' },
  { name: 'Artist 5', genre: 'Electronic · Late-night set', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=85' },
  { name: 'Artist 6', genre: 'Theatre · Spoken word', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&q=85' },
];

const artistList = document.querySelector('[data-artist-list]');
if (artistList) {
  const visibleArtists = artistList.dataset.artistList === 'featured' ? artists.slice(0, 3) : artists;
  artistList.innerHTML = visibleArtists.map((artist) => `<article class="artist-card"><div class="star-frame"><img class="star-image" src="${artist.image}" alt="Placeholder portrait for ${artist.name}" loading="lazy" /></div><h3>${artist.name}</h3><p>${artist.genre}</p></article>`).join('');
  const lineupCount = document.querySelector('[data-lineup-count]');
  if (lineupCount) lineupCount.textContent = `${artists.length} acts announced`;
}

const gallery = document.querySelector('[data-gallery-list]');
if (gallery) gallery.innerHTML = artists.slice(0, 3).map((artist, index) => `<a class="gallery-tile" href="artists.html" aria-label="See ${artist.name} in the artist lineup"><img src="${artist.image}" alt="${artist.name} festival placeholder portrait" loading="lazy" /><span>${['The voices', 'The movement', 'The moments'][index]}</span></a>`).join('');

const eventTarget = new Date('2027-01-15T00:00:00+05:30');
const progressStart = new Date('2026-09-17T00:00:00+05:30');
function updateCountdown() {
  const now = new Date();
  const remaining = Math.max(0, eventTarget - now);
  const elapsedPercent = Math.max(0, Math.min(100, ((now - progressStart) / (eventTarget - progressStart)) * 100));
  const values = { days: Math.floor(remaining / 86400000), hours: Math.floor((remaining / 3600000) % 24), minutes: Math.floor((remaining / 60000) % 60), seconds: Math.floor((remaining / 1000) % 60) };
  Object.entries(values).forEach(([unit, value]) => { const element = document.querySelector(`[data-time="${unit}"]`); if (element) element.textContent = String(value).padStart(unit === 'days' ? 3 : 2, '0'); });
  const fill = document.querySelector('.progress-fill');
  const track = document.querySelector('.progress-track');
  if (fill) fill.style.width = `${elapsedPercent}%`;
  if (track) track.setAttribute('aria-valuenow', String(Math.round(elapsedPercent)));
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

const dateStart = new Date(2026, 9, 13);
const dateEnd = new Date(2027, 0, 20);
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const yearFilter = document.querySelector('#year-filter');
const monthFilter = document.querySelector('#month-filter');
const dayFilter = document.querySelector('#day-filter');
const scheduleGrid = document.querySelector('#schedule-grid');
const artistEvents = new Map();
const festivalEvents = new Map([
  ['2026-10-31:18', 'Campus open mic'], ['2026-11-14:17', 'Battle of the bands'], ['2026-12-05:19', 'Street dance showcase'], ['2026-12-19:16', 'Short-film screening'], ['2027-01-10:18', 'Xpressions preview night'],
]);
[['2027-01-15', ['Artist 1', 'Artist 2', 'Artist 3']], ['2027-01-16', ['Artist 2', 'Artist 3', 'Artist 1']], ['2027-01-17', ['Artist 3', 'Artist 1', 'Artist 2']]].forEach(([date, acts]) => acts.forEach((act, index) => artistEvents.set(`${date}:${18 + index}`, act)));
function dateKey(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
function fillSelect(select, options, selected) { select.innerHTML = options.map(({ value, label }) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`).join(''); }
function updateDays(preferredDay) {
  const year = Number(yearFilter.value); const month = Number(monthFilter.value);
  const first = year === 2026 && month === 9 ? 13 : 1; const last = year === 2027 && month === 0 ? 20 : new Date(year, month + 1, 0).getDate();
  const options = Array.from({ length: last - first + 1 }, (_, index) => ({ value: String(first + index), label: String(first + index).padStart(2, '0') }));
  fillSelect(dayFilter, options, options.some(({ value }) => Number(value) === preferredDay) ? String(preferredDay) : options[0].value); renderSchedule();
}
function formatHour(hour) { const suffix = hour < 12 ? 'AM' : 'PM'; return `${String(hour % 12 || 12).padStart(2, '0')}:00 ${suffix}`; }
function renderSchedule() {
  if (!scheduleGrid) return;
  const selected = new Date(Number(yearFilter.value), Number(monthFilter.value), Number(dayFilter.value));
  document.querySelector('#selected-date').textContent = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(selected);
  const key = dateKey(selected);
  scheduleGrid.innerHTML = Array.from({ length: 24 }, (_, hour) => {
    const artist = artistEvents.get(`${key}:${hour}`); const event = festivalEvents.get(`${key}:${hour}`);
    return `<div class="hour-slot ${artist ? 'has-artist' : event ? 'has-event' : ''}"><time>${formatHour(hour)}</time><span>${artist || event || 'Open'}</span></div>`;
  }).join('');
}
if (yearFilter && monthFilter && dayFilter && scheduleGrid) {
  fillSelect(yearFilter, [2026, 2027].map((year) => ({ value: String(year), label: String(year) })), '2027');
  yearFilter.addEventListener('change', () => {
    const year = Number(yearFilter.value);
    const validMonths = months.map((label, value) => ({ value: String(value), label })).filter(({ value }) => new Date(year, Number(value) + 1, 0) >= dateStart && new Date(year, Number(value), 1) <= dateEnd);
    fillSelect(monthFilter, validMonths, year === 2026 ? '9' : '0'); updateDays(15);
  });
  monthFilter.addEventListener('change', () => updateDays(Number(dayFilter.value)));
  dayFilter.addEventListener('change', renderSchedule);
  yearFilter.dispatchEvent(new Event('change'));
}

document.querySelectorAll('[data-registration]').forEach((form) => form.addEventListener('submit', (event) => {
  event.preventDefault(); form.querySelector('.form-status').textContent = 'Thanks! Your details are ready. Registration submissions will open soon.'; form.reset();
}));
const loginForm = document.querySelector('[data-login-form]');
if (loginForm) loginForm.addEventListener('submit', (event) => { event.preventDefault(); loginForm.querySelector('.form-status').textContent = 'Account access will be available when registration opens.'; loginForm.reset(); });