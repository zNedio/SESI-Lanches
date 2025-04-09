// Dados do Cardápio Simplificado
const menuItems = [
    {
        id: 1,
        name: "Sanduíche Natural",
        description: "Pão integral com queijo branco, peito de peru e alface",
        price: 8.00,
        category: "lanches",
        image: "https://ibassets.com.br/ib.item.image.large/l-5ea34de3146c468390e8f997041cfeaf.jpeg"
    },
    {
        id: 2,
        name: "Pão de Queijo",
        description: "Pão de queijo caseiro, crocante por fora e macio por dentro",
        price: 3.50,
        category: "lanches",
        image: "https://cloudfront-us-east-1.images.arcpublishing.com/estadao/4KY3G2SXOBJPJDNFACJREWJE7M.jpg"
    },
    {
        id: 3,
        name: "Coxinha",
        description: "Coxinha de frango com catupiry, massa crocante",
        price: 5.00,
        category: "salgados",
        image: "https://nutrimassasesalgados.com/wp-content/uploads/2020/05/MG_6472-copiar-1.jpg"
    },
    {
        id: 4,
        name: "Salgado Assado",
        description: "Opções: Queijo, Presunto e Queijo ou Frango",
        price: 4.50,
        category: "salgados",
        image: "https://www.tiaeliana.com.br/alimentacao-salgados/imagens/salgados-assados.jpg"
    },
    {
        id: 5,
        name: "Suco Natural",
        description: "Laranja, Maracujá ou Abacaxi com Hortelã (300ml)",
        price: 6.00,
        category: "bebidas",
        image: "https://cantinagoodlanche.com.br/wp-content/uploads/2020/07/beneficios-dos-sucos-naturais-1-alfa-hotel.jpg"
    },
    {
        id: 6,
        name: "Água Mineral",
        description: "Água mineral sem gás 500ml",
        price: 3.00,
        category: "bebidas",
        image: "https://www.imigrantesbebidas.com.br/bebida/images/products/full/2893-agua-mineral-crystal-sem-gas-500ml.jpg"
    },
    {
        id: 7,
        name: "Café",
        description: "Café expresso ou com leite",
        price: 2.50,
        category: "bebidas",
        image: "https://media.istockphoto.com/id/1143290013/pt/foto/coffee-cup-isolated.jpg?s=612x612&w=0&k=20&c=h6Nrjz6v2FWhptDJwL3ZJLdYjrcV-K6eK7vh6vAonn8="
    },
    {
        id: 8,
        name: "Combo Lanche + Suco",
        description: "Sanduíche Natural + Suco Natural 300ml",
        price: 12.00,
        category: "combos",
        image: "https://previews.123rf.com/images/seralexvi/seralexvi1209/seralexvi120900045/15465227-sanduíche-e-suco-no-fundo-branco.jpg"
    }
];

// Variáveis globais
let cart = [];
let currentCategory = 'all';

// Elementos DOM
const menuItemsContainer = document.getElementById('menu-items-container');
const orderItemsContainer = document.getElementById('order-items-container');
const orderTotalElement = document.getElementById('order-total');
const emptyOrderMessage = document.getElementById('empty-order-message');
const studentNameInput = document.getElementById('student-name');
const reserveBtn = document.getElementById('reserve-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const categoryButtons = document.querySelectorAll('.category-btn');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const modal = document.getElementById('confirmation-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const closeModal = document.getElementById('close-modal');

// Funções
function renderMenuItems() {
    menuItemsContainer.innerHTML = '';
    
    const filteredItems = currentCategory === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === currentCategory);
    
    if (filteredItems.length === 0) {
        menuItemsContainer.innerHTML = '<p>Nenhum item encontrado nesta categoria.</p>';
        return;
    }
    
    filteredItems.forEach(item => {
        const menuCard = document.createElement('div');
        menuCard.className = 'menu-card';
        menuCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="menu-img">
            <div class="menu-details">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-price">R$ ${item.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${item.id}">Adicionar ao Pedido</button>
            </div>
        `;
        menuItemsContainer.appendChild(menuCard);
    });
    
    // Adiciona eventos aos botões
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function addToCart(e) {
    const itemId = parseInt(e.target.getAttribute('data-id'));
    const item = menuItems.find(item => item.id === itemId);
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    renderCart();
}

function renderCart() {
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p id="empty-order-message">Seu pedido está vazio. Adicione itens do cardápio.</p>';
        orderTotalElement.textContent = 'Total: R$ 0,00';
        return;
    }
    
    orderItemsContainer.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div>
                <p>R$ ${itemTotal.toFixed(2)}</p>
                <button class="remove-item" data-id="${item.id}">Remover</button>
            </div>
        `;
        orderItemsContainer.appendChild(orderItem);
    });
    
    orderTotalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
    
    // Adiciona eventos aos botões de remover
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

function removeFromCart(e) {
    const itemId = parseInt(e.target.getAttribute('data-id'));
    
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
    }
    
    renderCart();
}

function reserveOrder() {
    const studentName = studentNameInput.value.trim();
    
    if (!studentName) {
        alert('Por favor, digite seu nome para reservar o pedido.');
        return;
    }
    
    if (cart.length === 0) {
        alert('Seu pedido está vazio. Adicione itens antes de reservar.');
        return;
    }
    
    // Simulação de envio para o servidor
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    modalTitle.textContent = 'Pedido Reservado!';
    modalMessage.textContent = `Obrigado, ${studentName}! Seu pedido foi reservado com sucesso. Total: R$ ${total.toFixed(2)}`;
    modal.style.display = 'flex';
    
    // Limpa o carrinho
    cart = [];
    studentNameInput.value = '';
    renderCart();
}

function checkoutOrder() {
    const studentName = studentNameInput.value.trim();
    
    if (!studentName) {
        alert('Por favor, digite seu nome para finalizar o pedido.');
        return;
    }
    
    if (cart.length === 0) {
        alert('Seu pedido está vazio. Adicione itens antes de finalizar.');
        return;
    }
    
    // Simulação de envio para o servidor
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    modalTitle.textContent = 'Pedido Finalizado!';
    modalMessage.textContent = `Obrigado, ${studentName}! Seu pedido foi finalizado com sucesso. Total: R$ ${total.toFixed(2)}`;
    modal.style.display = 'flex';
    
    // Limpa o carrinho
    cart = [];
    studentNameInput.value = '';
    renderCart();
}

// Event Listeners
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentCategory = button.getAttribute('data-category');
        renderMenuItems();
    });
});

reserveBtn.addEventListener('click', reserveOrder);
checkoutBtn.addEventListener('click', checkoutOrder);
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Fechar modal clicando fora
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Inicialização
renderMenuItems();
renderCart();