const URL_PROYECTO = 'https://ficomkoarjgstkrwzjsv.supabase.co';
const CLAVE_ANONIMA = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpY29ta29hcmpnc3Rrcnd6anN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDk1NTYsImV4cCI6MjA5NTAyNTU1Nn0.kNcQCNCniD5pjfS1riEXC5uweivKGOH_NbVGcB-kREk';

const dbNadia = supabase.createClient(URL_PROYECTO, CLAVE_ANONIMA);

// Imagen estética si el usuario no sube una
const FOTO_GENERICA = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=500&auto=format&fit=crop';

const muralGrid = document.getElementById('muralGrid');
const modal = document.getElementById('modalMural');

// --- CARGAR DATOS ---
async function loadMural() {
    try {
        const { data, error } = await dbNadia
            .from('wishes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        muralGrid.innerHTML = '';
        
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card fade-in';
            
            // Rotación aleatoria para efecto visual
            const rot = (Math.random() * 4 - 2) + 'deg';
            card.style.transform = `rotate(${rot})`;

            const imgToShow = item.image_url || FOTO_GENERICA;
            
            // Limpiamos saltos de línea solo para la vista previa (snippet)
            const cleanSnippet = item.message.replace(/\n/g, " ").substring(0, 45) + "...";

            card.innerHTML = `
                <div class="photo-frame">
                    <img src="${imgToShow}" loading="lazy">
                </div>
                <div class="card-text">
                    <strong>De: ${item.name || 'Anónimo'}</strong>
                    <p>${cleanSnippet}</p>
                </div>
            `;

            // Evento para abrir el modal
            card.onclick = () => openModal(item, imgToShow);
            
            muralGrid.appendChild(card);
        });
    } catch (err) {
        console.error("Error al cargar mural:", err.message);
    }
}

// --- LÓGICA DEL MODAL ---
function openModal(item, img) {
    document.getElementById('modalImg').src = img;
    
    // El CSS debe tener white-space: pre-wrap para que esto funcione bien
    document.getElementById('modalText').innerHTML = `
        <h3>De: ${item.name || 'Anónimo'}</h3>
        <p>${item.message}</p>
    `;
    
    modal.style.display = 'flex';
}

// Cerrar modal al tocar la X o fuera del cuadro
document.getElementById('closeModal').onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if(e.target == modal) modal.style.display = 'none'; };

// Iniciar carga
window.onload = loadMural;