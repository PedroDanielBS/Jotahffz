document.addEventListener('DOMContentLoaded', function() {
    // === 1. SISTEMA DE NAVEGAÇÃO ENTRE ABAS ===
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove a classe active de todos os links e adiciona no link clicado
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Esconde todas as seções e mostra apenas a correta
            const target = this.getAttribute('data-target');
            tabContents.forEach(tab => {
                if (tab.id === target) {
                    tab.style.display = 'block';
                } else {
                    tab.style.display = 'none';
                }
            });

            // Recarrega os dados dinâmicos quando a aba correspondente é aberta
            if (target === 'gerenciar-vitrine') carregarTabelaGerenciamento();
            if (target === 'vendas') carregarRelatorioVendas();
        });
    });

    // === 2. SALVAR NOVO PRODUTO COM UPLOAD LOCAL ===
    const formCadastro = document.getElementById('add-mod-form');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('mod-name').value;
            const categorySelect = document.getElementById('mod-category');
            const categoryText = categorySelect.options[categorySelect.selectedIndex].text;
            const version = document.getElementById('mod-version').value;
            const price = document.getElementById('mod-price').value;
            const spec1 = document.getElementById('mod-spec-1').value || 'Universal';
            const spec2 = document.getElementById('mod-spec-2').value || 'Seguro';
            const downloadLink = document.getElementById('mod-download').value;
            const desc = document.getElementById('mod-desc').value;
            const imageInput = document.getElementById('mod-image');
            const file = imageInput.files[0];

            if (!file) { 
                alert('Por favor, selecione uma imagem do seu computador!'); 
                return; 
            }

            const reader = new FileReader();
            reader.onloadend = function() {
                const newMod = {
                    id: Date.now(),
                    name, 
                    category: categoryText, 
                    version, 
                    price, 
                    spec1, 
                    spec2,
                    image: reader.result, // Código Base64 convertido da imagem
                    downloadLink, 
                    desc
                };

                try {
                    let currentMods = JSON.parse(localStorage.getItem('jotah_store_mods')) || [];
                    currentMods.push(newMod);
                    localStorage.setItem('jotah_store_mods', JSON.stringify(currentMods));
                    
                    alert('🔥 Produto publicado com sucesso na vitrine!');
                    formCadastro.reset();
                } catch (err) {
                    alert('⚠️ Erro de limite de armazenamento: A imagem escolhida é pesada demais. Use uma imagem com menos de 1MB.');
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // === 3. RENDERIZAR TABELA DE GERENCIAMENTO ===
    function carregarTabelaGerenciamento() {
        const tabelaCorpo = document.getElementById('tabela-produtos-corpo');
        if (!tabelaCorpo) return;

        const mods = JSON.parse(localStorage.getItem('jotah_store_mods')) || [];

        if (mods.length === 0) {
            tabelaCorpo.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:rgba(255,255,255,0.3);">Nenhum produto cadastrado na vitrine.</td></tr>`;
            return;
        }

        tabelaCorpo.innerHTML = '';
        mods.forEach(mod => {
            tabelaCorpo.innerHTML += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                    <td style="padding: 15px 20px;">
                        <img src="${mod.image}" style="width:50px; height:50px; object-fit:cover; border-radius:8px; border:1px solid rgba(255,255,255,0.1);" onerror="this.src='https://placehold.co/50x50'">
                    </td>
                    <td style="padding: 15px 20px; font-weight:700;">
                        ${mod.name} <span style="font-size:0.75rem; color:rgba(255,255,255,0.4); font-weight:400; margin-left:5px;">${mod.version}</span>
                    </td>
                    <td style="padding: 15px 20px; color:rgba(255,255,255,0.6);">${mod.category}</td>
                    <td style="padding: 15px 20px; color:#ff1a1a; font-weight:700;">
                        ${mod.price.toLowerCase().includes('grátis') || mod.price === '0' ? 'Grátis' : 'R$ ' + mod.price}
                    </td>
                    <td style="padding: 15px 20px; text-align: right;">
    <button onclick="deletarProduto(${mod.id})" title="Excluir produto" style="background:none; border:none; cursor:pointer; padding:5px 10px;">
        <i class="ri-delete-bin-6-fill" style="color: #ff1a1a; font-size: 1.2rem;"></i>
    </button>
</td>
                </tr>
            `;
        });
    }

    // === 4. RENDERIZAR HISTÓRICO DE VENDAS ===
    function carregarRelatorioVendas() {
        const tabelaVendas = document.getElementById('tabela-vendas-corpo');
        const contadorTotal = document.getElementById('stat-total-cliques');
        if (!tabelaVendas) return;

        const cliquesLog = JSON.parse(localStorage.getItem('jotah_store_cliques')) || [];
        
        if (contadorTotal) {
            contadorTotal.innerText = cliquesLog.length;
        }

        if (cliquesLog.length === 0) {
            tabelaVendas.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:30px; color:rgba(255,255,255,0.3);">Nenhum clique de interesse registrado até o momento.</td></tr>`;
            return;
        }

        tabelaVendas.innerHTML = '';
        // Inverte a lista para exibir as intenções mais recentes no topo
        [...cliquesLog].reverse().forEach(clique => {
            tabelaVendas.innerHTML += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.02);">
                    <td style="padding:14px 0; font-weight:600;">${clique.nome}</td>
                    <td style="padding:14px 0; color:#ff1a1a; font-weight:700;">${clique.preco}</td>
                    <td style="padding:14px 0; color:rgba(255,255,255,0.4); font-size:0.85rem;">${clique.data}</td>
                </tr>
            `;
        });
    }

    // Torna a função de renderização acessível para a troca de abas externa
    window.carregarRelatorioVendas = carregarRelatorioVendas;
    window.carregarTabelaGerenciamento = carregarTabelaGerenciamento;
});

// === FUNÇÃO GLOBAL DE EXCLUSÃO (Fica fora para o HTML com script externo encontrar) ===
// === FUNÇÃO GLOBAL DE EXCLUSÃO COM MODAL PERSONALIZADO ===
window.deletarProduto = function(id) {
    const modalConfirm = document.getElementById('custom-confirm-modal');
    const btnCancel = document.getElementById('btn-confirm-cancel');
    const btnDelete = document.getElementById('btn-confirm-delete');

    if (!modalConfirm) return;

    // Exibe o modal aplicando a classe active
    modalConfirm.classList.add('active');

    // Função para fechar o modal limpando os eventos antigos
    const fecharModal = () => {
        modalConfirm.classList.remove('active');
        // Remove os escutadores para evitar acúmulo de cliques duplicados na memória
        btnDelete.replaceWith(btnDelete.cloneNode(true));
        btnCancel.replaceWith(btnCancel.cloneNode(true));
    };

    // Caso clique em Cancelar
    btnCancel.addEventListener('click', fecharModal);

    // Caso clique fora do card (no fundo borrado)
    modalConfirm.addEventListener('click', function(e) {
        if (e.target === modalConfirm) fecharModal();
    });

    // Caso confirme a exclusão
    document.getElementById('btn-confirm-delete').addEventListener('click', function() {
        let mods = JSON.parse(localStorage.getItem('jotah_store_mods')) || [];
        
        // Remove da lista o produto correspondente ao ID informado
        mods = mods.filter(mod => mod.id !== id);
        
        localStorage.setItem('jotah_store_mods', JSON.stringify(mods));
        
        // Fecha o modal personalizado
        fecharModal();

        // Atualiza a tabela na tela imediatamente
        if (window.carregarTabelaGerenciamento) {
            window.carregarTabelaGerenciamento();
        } else {
            window.location.reload();
        }
    });
};