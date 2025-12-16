// Simple name picker for dog or cat, with optional region-based additions
(function(){
  const names = {
    dog: {
      male: ['Max','Charlie','Cooper','Rocky','Duke','Bear','Toby','Milo'],
      female: ['Bella','Lucy','Molly','Daisy','Lola','Sadie','Rosie','Ruby']
    },
    cat: {
      male: ['Oliver','Leo','Simba','Milo','Oscar','Charlie'],
      female: ['Luna','Bella','Mittens','Chloe','Nala','Lily']
    }
  };

  const regional = {
    us: { dog: ['Ranger','Scout'], cat: ['Pumpkin'] },
    uk: { dog: ['Teddy','Pippa'], cat: ['Poppy'] },
    jp: { dog: ['Hachi','Sora'], cat: ['Hana','Mochi'] },
    au: { dog: ['Bluey','Banjo'], cat: ['Matilda'] }
  };

  function detectRegion(input) {
    if(!input) return null;
    const s = input.toLowerCase();
    if(/\b(us|usa|america|united states)\b/.test(s)) return 'us';
    if(/\b(uk|england|britain|scotland|wales|northern ireland)\b/.test(s)) return 'uk';
    if(/\b(japan|jp|tokyo|osaka|kyoto)\b/.test(s)) return 'jp';
    if(/\b(australia|au|sydney|melbourne)\b/.test(s)) return 'au';
    return null;
  }

  function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function buildPool(type, location, gender){
    let pool = [];
    const n = names[type] || {};
    if(gender === 'male') pool = (n.male || []).slice();
    else if(gender === 'female') pool = (n.female || []).slice();
    else pool = ((n.male || []).concat(n.female || [])).slice();

    const reg = detectRegion(location);
    if(reg && regional[reg] && regional[reg][type]) pool.push(...regional[reg][type]);

    // fallback to all names if none matched
    if(pool.length === 0) pool = ((n.male || []).concat(n.female || []));
    return pool;
  }

  function showResult(text){
    const el = document.getElementById('result');
    el.innerHTML = text;
  }

  function saveName(obj){
    try{
      const key = 'savedPetNames';
      const saved = JSON.parse(localStorage.getItem(key) || '[]');
      saved.push(obj);
      localStorage.setItem(key, JSON.stringify(saved));
      renderSaved();
    }catch(e){ console.warn(e); }
  }

  function renderSaved(){
    const key = 'savedPetNames';
    const list = document.getElementById('savedList');
    list.innerHTML = '';
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    saved.slice().reverse().forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} — ${item.type}${item.gender ? ' ('+item.gender+')' : ''} (${item.location || 'unknown'})`;
      list.appendChild(li);
    });
  }

  function init(){
    const form = document.getElementById('nameForm');
    const randomize = document.getElementById('randomize');
    let last = null;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = form.elements['type'].value;
      const gender = form.elements['gender'] ? form.elements['gender'].value : 'any';
      const loc = (document.getElementById('location').value || '').trim();
      const pool = buildPool(type, loc, gender);
      if(pool.length === 0){ showResult('No names available for that selection.'); return; }
      const name = pickRandom(pool);
      last = { name, type, gender, location: loc };
      showResult(`<p>How about: <strong>${name}</strong>?</p><p><button id="saveBtn" class="btn">Save</button></p>`);
      const saveBtn = document.getElementById('saveBtn');
      saveBtn.addEventListener('click', ()=> saveName(last));
    });

    randomize.addEventListener('click', ()=>{
      form.dispatchEvent(new Event('submit', {cancelable: true}));
    });

    renderSaved();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
