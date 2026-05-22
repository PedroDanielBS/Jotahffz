
document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('produtos-dinamicos');
    
    // Recupera os mods salvos no localStorage
    const savedMods = JSON.parse(localStorage.getItem('jotah_store_mods')) || [];

    // Se não houver nenhum mod cadastrado pelo painel, exibe um aviso amigável
    if (savedMods.length === 0) {
        gridContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: rgba(255,255,255,0.4);">
                <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 15px; color: #ff1a1a;"></i>
                <p>Nenhum produto cadastrado no painel administrativo ainda.</p>
            </div>
        `;
        return;
    }

    // Inverte a ordem para que os produtos mais novos apareçam primeiro na vitrine
    // Inverte a ordem para que os produtos mais novos apareçam primeiro na vitrine
    savedMods.reverse().forEach(mod => {
        const isGratis = mod.price.toLowerCase().includes('grátis') || mod.price === '0';
        const btnClass = isGratis ? 'btn-mod-download gratis' : 'btn-mod-download';
        const btnIcon = isGratis ? 'fas fa-download' : 'fab fa-whatsapp'; // Ícone do WhatsApp para pagos
        const btnText = isGratis ? 'Baixar' : 'Comprar';

        // --- CONFIGURAÇÃO DO WHATSAPP ---
        // Digite seu número com DDD (Apenas números, ex: 5511999999999)
        const SEU_NUMERO_WHATSAPP = "5577998025597"; 
        
        // Mensagem automática personalizada que você vai receber
        const textoMensagem = `Olá! Gostaria de comprar o seguinte produto:\n\n` +
                              `📦 *Produto:* ${mod.name}\n` +
                              `🏷️ *Categoria:* ${mod.category}\n` +
                              `📌 *Versão:* ${mod.version}\n` +
                              `💰 *Valor:* R$ ${mod.price}\n\n` +
                              `Como faço para realizar o pagamento e receber o acesso?`;

        // encodeURIComponent serve para converter espaços e quebras de linha em formato de URL de forma segura
        const linkFinal = isGratis ? mod.downloadLink : `https://wa.me/${5577998025597}?text=${encodeURIComponent(textoMensagem)}`;
        // --------------------------------

        // Estrutura HTML do card
        const cardHTML = `
            <div class="mod-card" onclick="void(0)">
                <div class="mod-badge">NOVO</div>
                <div class="mod-image-wrapper">
                    <img src="${mod.image}" alt="${mod.name}" class="mod-img" onerror="this.src='https://placehold.co/600x400/111/fff?text=Erro+na+Imagem'">
                    <div class="mod-image-overlay">
                        <span class="view-details">VER DETALHES</span>
                    </div>
                </div>
                <div class="mod-info">
                    <div class="mod-meta">
                        <span class="mod-category"><i class="fas fa-cube"></i> ${mod.category}</span>
                        <span class="mod-version">${mod.version}</span>
                    </div>
                    <h3>${mod.name}</h3>
                    <p>${mod.desc}</p>
                    
                    <div class="mod-specs">
                        <div class="spec-item"><i class="fas fa-check-circle"></i> <span>${mod.spec1}</span></div>
                        <div class="spec-item"><i class="fas fa-shield-alt"></i> <span>${mod.spec2}</span></div>
                    </div>

                    <div class="mod-footer">
                        <div class="mod-price">
                            <span>Acesso</span>
                            <strong>${isGratis ? 'Grátis' : 'R$ ' + mod.price}</strong>
                        </div>
                        <!-- O link agora aponta para a variável dinamicamente -->
                        <a href="${linkFinal}" target="_blank" class="${btnClass}">
                            <i class="${btnIcon}"></i> ${btnText}
                        </a>
                    </div>
                </div>
            </div>
        `;

        gridContainer.innerHTML += cardHTML;
        gridContainer.addEventListener('click', function(e) {
    const btnCompra = e.target.closest('.btn-mod-download:not(.gratis)');
    if (btnCompra) {
        // Encontra o card do produto correspondente ao botão clicado
        const card = btnCompra.closest('.mod-card');
        const nomeProduto = card.querySelector('h3').innerText;
        const precoProduto = card.querySelector('.mod-price strong').innerText;
        
        // Cria o registro do clique com data e hora atualizada
        const novoClique = {
            nome: nomeProduto,
            preco: precoProduto,
            data: new Date().toLocaleString('pt-BR')
        };
        
        // Salva na memória do localStorage compartilhada
        let logsAtuais = JSON.parse(localStorage.getItem('jotah_store_cliques')) || [];
        logsAtuais.push(novoClique);
        localStorage.setItem('jotah_store_cliques', JSON.stringify(logsAtuais));
    }
});
    });
});

// --- SISTEMA DE LOGIN ADMIN ---
const modal = document.getElementById('admin-login-modal');
const errorMsg = document.getElementById('login-error-msg');

// Abre o modal ao clicar no botão flutuante
function abrirLoginAdmin() {
    modal.classList.add('active');
    document.getElementById('admin-password').focus();
}

// Fecha o modal ao clicar no X ou após logar
function fecharLoginAdmin() {
    modal.classList.remove('active');
    errorMsg.style.display = 'none';
    document.getElementById('admin-login-form').reset();
}

// Verifica a senha enviada
document.getElementById('admin-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const senhaDigitada = document.getElementById('admin-password').value;

    // Defina sua chave aqui
    const SENHA_MESTRA = 'jotah123';

    if (senhaDigitada === SENHA_MESTRA) {
        errorMsg.style.display = 'none';
        fecharLoginAdmin();
        window.location.href = 'mods-painel-admin.html'; // Redireciona para o painel administrativo
    } else {
        errorMsg.style.display = 'block';
        document.getElementById('admin-password').value = '';
    }
});

// Captura os cliques nos botões de compra para gerar os dados na aba "Vendas" do painel admin
gridContainer.addEventListener('click', function(e) {
    const btnCompra = e.target.closest('.btn-mod-download:not(.gratis)');
    if (btnCompra) {
        // Encontra o card do produto correspondente ao botão clicado
        const card = btnCompra.closest('.mod-card');
        const nomeProduto = card.querySelector('h3').innerText;
        const precoProduto = card.querySelector('.mod-price strong').innerText;
        
        // Cria o registro do clique com data e hora atualizada
        const novoClique = {
            nome: nomeProduto,
            preco: precoProduto,
            data: new Date().toLocaleString('pt-BR')
        };
        
        // Salva na memória do localStorage compartilhada
        let logsAtuais = JSON.parse(localStorage.getItem('jotah_store_cliques')) || [];
        logsAtuais.push(novoClique);
        localStorage.setItem('jotah_store_cliques', JSON.stringify(logsAtuais));
    }
});
