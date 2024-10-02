const containerJogo = document.getElementById('containerJogo');
const jogador = document.getElementById('jogador');
const piso = document.getElementById('piso');
const pontosExibidos = document.getElementById('pontos');
const nomeInput = document.getElementById('nomeJogador');
const iniciarJogoBtn = document.getElementById('iniciarJogo');
const reiniciarBtn = document.getElementById('reiniciar');
const pontuacaoFinal = document.getElementById('pontuacaoFinal');
let isJumping = false;
let pontos = 0;
let gameStarted = false;
let jogadorNome = '';
let circuloInterval; // Intervalo para criar círculos

// Função para reiniciar o jogo
function reiniciarJogo() {
    const circulos = document.querySelectorAll('.circulo');
    circulos.forEach(circulo => circulo.remove());

    jogador.style.bottom = '20px'; // Posição inicial
    jogador.style.left = '50px'; // Posição inicial
    pontos = 0; // Reseta a pontuação
    pontosExibidos.textContent = `Pontos: ${pontos}`; // Atualiza exibição de pontos
    gameStarted = true;
    reiniciarBtn.style.display = 'none'; // Oculta botão de reiniciar
    pontuacaoFinal.style.display = 'none'; // Oculta pontuação final
    iniciarCirculo(); // Começa a criar círculos continuamente
}

// Função para iniciar a criação de círculos
function iniciarCirculo() {
    if (circuloInterval) clearInterval(circuloInterval); // Limpa o intervalo existente
    circuloInterval = setInterval(criarCirculo, 1000); // Gera bolinhas a cada segundo
}

// Função para criar um círculo no jogo
function criarCirculo() {
    const circulo = document.createElement('div');
    circulo.className = 'circulo';
    circulo.style.left = Math.random() * (containerJogo.clientWidth - 20) + 'px'; // Posição aleatória
    circulo.style.top = '0px'; // Começa do topo
    containerJogo.appendChild(circulo);

    let cair = setInterval(() => {
        if (parseInt(circulo.style.top) < containerJogo.clientHeight) {
            circulo.style.top = (parseInt(circulo.style.top) + 5) + 'px'; // Aumenta a velocidade da queda
        } else {
            clearInterval(cair);
            reiniciarBtn.style.display = 'block'; // Exibe botão de reiniciar
            pontuacaoFinal.textContent = `Pontuação Final: ${pontos}`; // Exibe a pontuação
            pontuacaoFinal.style.display = 'block'; // Mostra a pontuação final
            gameStarted = false; // Para o jogo
            clearInterval(circuloInterval); // Para de criar novos círculos
            circulo.remove(); // Remove o círculo
        }

        if (verificarColisao(circulo)) {
            clearInterval(cair);
            circulo.remove(); // Remove o círculo
            pontos++; // Incrementa a pontuação
            pontosExibidos.textContent = `Pontos: ${pontos}`; // Atualiza exibição de pontos
        }
    }, 50); // Velocidade ajustada
}

// Função para verificar colisão
function verificarColisao(circulo) {
    const jogadorRect = jogador.getBoundingClientRect();
    const circuloRect = circulo.getBoundingClientRect();
    return !(
        jogadorRect.right < circuloRect.left ||
        jogadorRect.left > circuloRect.right ||
        jogadorRect.bottom < circuloRect.top ||
        jogadorRect.top > circuloRect.bottom
    );
}

// Controle do jogador
document.addEventListener('keydown', (event) => {
    if (!gameStarted) {
        return; // Se o jogo não começou, não faz nada
    }
    switch (event.key) {
        case 'ArrowLeft':
        case 'a':
            if (parseInt(jogador.style.left) > 0) { // Previne que saia do contêiner
                jogador.style.left = (parseInt(jogador.style.left) - 7) + 'px'; // Aumenta a velocidade
            }
            break;
        case 'ArrowRight':
        case 'd':
            if (parseInt(jogador.style.left) < containerJogo.clientWidth - 30) { // Previne que saia do contêiner
                jogador.style.left = (parseInt(jogador.style.left) + 7) + 'px'; // Aumenta a velocidade
            }
            break;
        case ' ':
        case 'ArrowUp':
        case 'w':
            if (parseInt(jogador.style.bottom) < containerJogo.clientHeight - 20 && !isJumping) {
                isJumping = true;
                jump(); // Executa o pulo
            }
            break;
    }
});

// Função de pulo
function jump() {
    let altura = 0;
    const jumpInterval = setInterval(() => {
        if (altura >= 100) { // Altura máxima do pulo
            clearInterval(jumpInterval);
            const fallInterval = setInterval(() => {
                if (altura <= 0) {
                    clearInterval(fallInterval);
                    isJumping = false; // Permite pular novamente
                } else {
                    altura -= 5; // Altura de queda
                    jogador.style.bottom = (parseInt(jogador.style.bottom) - 5) + 'px'; // Atualiza a posição
                }
            }, 20);
        } else {
            altura += 5; // Altura do pulo
            jogador.style.bottom = (parseInt(jogador.style.bottom) + 5) + 'px'; // Atualiza a posição
        }
    }, 20); // Controla a velocidade do pulo
}

// Inicia o jogo ao clicar no botão
iniciarJogoBtn.addEventListener('click', () => {
    jogadorNome = nomeInput.value || 'Jogador'; // Captura nome do jogador ou usa padrão
    reiniciarJogo(); // Reinicia o jogo
});

// Reinicia o jogo ao clicar no botão de reiniciar
reiniciarBtn.addEventListener('click', reiniciarJogo);
