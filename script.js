const URL_PROYECTO = 'https://ficomkoarjgstkrwzjsv.supabase.co';
const CLAVE_ANONIMA = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpY29ta29hcmpnc3Rrcnd6anN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDk1NTYsImV4cCI6MjA5NTAyNTU1Nn0.kNcQCNCniD5pjfS1riEXC5uweivKGOH_NbVGcB-kREk';

const dbNadia = supabase.createClient(URL_PROYECTO, CLAVE_ANONIMA);

const muralGrid = document.getElementById('muralGrid');
const modal = document.getElementById('modalMural');

async function loadMural() {
    const { data, error } = await dbNadia
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return console.error(error);

    muralGrid.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Rotación aleatoria
        const rot = (Math.random() * 6 - 3) + 'deg';
        card.style.transform = `rotate(${rot})`;

        const snippet = item.message.substring(0, 50) + (item.message.length > 50 ? '...' : '');

        card.innerHTML = `
            ${item.image_url ? `<img src="${item.image_url}">` : '<div style="height:180px; background:#eee"></div>'}
            <p>${snippet}</p>
        `;

        card.onclick = () => {
            document.getElementById('modalImg').src = item.image_url || '';
            document.getElementById('modalImg').style.display = item.image_url ? 'block' : 'none';
            document.getElementById('modalText').innerText = item.message;
            modal.style.display = 'flex';
        };

        muralGrid.appendChild(card);
    });
}

document.getElementById('closeModal').onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if(e.target == modal) modal.style.display = 'none'; };

window.onload = loadMural;