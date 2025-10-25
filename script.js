document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando script...');
    
    /* ========================================
       CONFIGURAÇÕES DO POPUP - FÁCIL DE CONTROLAR
    ======================================== */
    const POPUP_CONFIG = {
        // TEMPO PARA O POPUP APARECER (em milissegundos)
        tempoParaAparecer: 20000, // Imediatamente
        
        // TEMPO PARA O BOTÃO APARECER APÓS O POPUP (em milissegundos)
        tempoParaBotaoAparecer: 5000, // Botão aparece junto com o popup
        
        // INTERVALO DE REDUÇÃO DAS VAGAS (em milissegundos)
        intervaloVagas: 10000, // 5 segundos (5000ms)
        
        // LINK DE REDIRECIONAMENTO
        linkRedirecionamento: 'https://quiz.cakto.com.br/ebook-quiropraxia-hoNDsM',
        
        // VAGAS INICIAIS
        vagasIniciais: 19,
        
        // CONFIGURAÇÃO DO CONTADOR DE PESSOAS
        pessoasIniciais: 478, // Número inicial de pessoas que fizeram
        incrementoPessoas: 1, // Quantas pessoas aumentam a cada vaga que diminui
    };
    
    console.log('⚙️ Configurações carregadas:', POPUP_CONFIG);
    
    /* ========================================
       HELPER FUNCTIONS - VERIFICAÇÃO SEGURA DE ELEMENTOS
    ======================================== */
    const safeElementUpdate = (elementId, value, logPrefix = '') => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
            console.log(`✅ ${logPrefix}${elementId} atualizado para: ${value}`);
            return true;
        } else {
            console.warn(`⚠️ ${logPrefix}Elemento #${elementId} não encontrado - operação ignorada`);
            return false;
        }
    };

    const safeElementExists = (elementId) => {
        const element = document.getElementById(elementId);
        const exists = !!element;
        console.log(`🔍 Elemento #${elementId}: ${exists ? '✅ encontrado' : '❌ não encontrado'}`);
        return { exists, element };
    };
    
    /* ========================================
       LÓGICA DA BARRA DE PROGRESSO
    ======================================== */
    const progressBar = document.getElementById('quiz-progress-bar');
    console.log('📊 Barra de progresso encontrada:', !!progressBar);

    window.updateProgressBar = function(percentage) {
        if (progressBar) {
            if (percentage >= 0 && percentage <= 100) {
                progressBar.style.width = `${percentage}%`;
                console.log(`📊 Barra atualizada para: ${percentage}%`);
            } else {
                console.warn('Porcentagem inválida para a barra de progresso. Use valores entre 0 e 100.');
            }
        } else {
            console.warn('⚠️ Barra de progresso não encontrada - updateProgressBar ignorado');
        }
    };

    // Inicia a barra em 10%
    if (progressBar) {
        updateProgressBar(10);
    }

    /* ========================================
       LÓGICA DO CARROSSEL
    ======================================== */
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselSlides = document.querySelector('.carousel-slides');
    const carouselImages = document.querySelectorAll('.carousel-slides img');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    console.log('🎠 Elementos do carrossel:');
    console.log('- Container:', !!carouselContainer);
    console.log('- Slides:', !!carouselSlides);
    console.log('- Imagens:', carouselImages.length);
    console.log('- Botão anterior:', !!prevButton);
    console.log('- Botão próximo:', !!nextButton);
    console.log('- Dots:', !!dotsContainer);

    let currentSlide = 0;
    const totalSlides = carouselImages.length;

    function createDots() {
        if (dotsContainer) {
            dotsContainer.innerHTML = ''; // Limpa dots existentes
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.dataset.index = i;
                dotsContainer.appendChild(dot);

                dot.addEventListener('click', () => {
                    moveToSlide(i);
                });
            }
            console.log(`🔘 ${totalSlides} dots criados`);
        }
    }

    function updateCarousel() {
        if (carouselSlides) {
            const offset = -currentSlide * 100;
            carouselSlides.style.transform = `translateX(${offset}%)`;
        }

        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot) => {
            dot.classList.remove('active');
        });
        
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }

    function moveToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }

    function showNextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function showPrevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Event listeners do carrossel
    if (prevButton) {
        prevButton.addEventListener('click', showPrevSlide);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', showNextSlide);
    }

    // Inicializa o carrossel apenas se houver imagens
    if (totalSlides > 0) {
        createDots();
        updateCarousel();
        
        // Auto-slide do carrossel
        let autoSlideInterval;
        
        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(showNextSlide, 5000);
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
        }

        if (carouselContainer) {
            startAutoSlide();
            carouselContainer.addEventListener('mouseenter', stopAutoSlide);
            carouselContainer.addEventListener('mouseleave', startAutoSlide);
        }
        console.log('🎠 Carrossel inicializado com sucesso');
    } else {
        console.warn("⚠️ Nenhuma imagem encontrada para o carrossel.");
        if (carouselContainer) {
            carouselContainer.style.display = 'none';
        }
    }

    /* ========================================
       LÓGICA DO POPUP COM TRATAMENTO DE ERROS
    ======================================== */
    
    // Verifica elementos do popup com função segura
    const popupElements = {
        overlay: safeElementExists('popup-overlay'),
        button: safeElementExists('popup-button'),
        vagasCount: safeElementExists('vagas-count'),
        alertMessage: safeElementExists('alert-message'),
        pessoasCount: safeElementExists('pessoas-count')
    };
    
    console.log('🎯 Verificação completa dos elementos do popup:');
    Object.entries(popupElements).forEach(([name, {exists}]) => {
        console.log(`- ${name}: ${exists ? '✅' : '❌'}`);
    });
    
    // Variáveis de controle
    let vagasDisponiveis = POPUP_CONFIG.vagasIniciais;
    let pessoasQueColheram = POPUP_CONFIG.pessoasIniciais;
    let popupTimer;
    let countdownInterval;
    let buttonTimer;

    // Funções de atualização seguras
    const updateVagasDisplay = () => {
        const success = safeElementUpdate('vagas-count', vagasDisponiveis, '📊 ');
        if (!success) {
            console.log(`📊 Vagas atuais: ${vagasDisponiveis} (elemento não encontrado no DOM)`);
        }
    };

    const updatePessoasDisplay = () => {
        const success = safeElementUpdate('pessoas-count', pessoasQueColheram, '👥 ');
        if (!success) {
            console.log(`👥 Pessoas atuais: ${pessoasQueColheram} (elemento não encontrado no DOM)`);
        }
    };

    const updateAlertMessage = (message) => {
        const success = safeElementUpdate('alert-message', message, '⚠️ ');
        if (!success) {
            console.log(`⚠️ Alerta: ${message} (elemento não encontrado no DOM)`);
        }
    };

    const showPopup = () => {
        console.log('🎯 Executando showPopup...');
        
        if (!popupElements.overlay.exists) {
            console.error('❌ ERRO: popup-overlay não encontrado - popup não pode ser exibido!');
            return;
        }
        
        const popupOverlay = popupElements.overlay.element;
        
        // Mostra o overlay
        popupOverlay.style.display = 'block';
        document.body.classList.add('popup-active');
        console.log('✅ Popup overlay exibido');

        // Adiciona classe show após um pequeno delay para animação
        setTimeout(() => {
            popupOverlay.classList.add('show');
            console.log('✅ Classe show adicionada ao popup');
        }, 50);

        // Prepara o botão se existir
        if (popupElements.button.exists) {
            const popupButton = popupElements.button.element;
            popupButton.style.display = 'block';
            popupButton.style.opacity = '0';
            popupButton.style.visibility = 'hidden';
            popupButton.classList.remove('show');
            console.log('✅ Botão preparado (invisível)');
        } else {
            console.warn('⚠️ Botão do popup não encontrado - continuando sem botão');
        }

        console.log(`⏳ Botão aparecerá em ${POPUP_CONFIG.tempoParaBotaoAparecer/1000} segundos...`);

        // Timer para mostrar o botão
        buttonTimer = setTimeout(() => {
            if (popupElements.button.exists) {
                const popupButton = popupElements.button.element;
                console.log('🔘 Mostrando botão...');
                popupButton.style.visibility = 'visible';
                popupButton.style.opacity = '1';
                popupButton.classList.add('show');
                console.log('✅ Botão exibido com sucesso');
            } else {
                console.warn('⚠️ Botão não encontrado para exibir - continuando sem botão');
            }
        }, POPUP_CONFIG.tempoParaBotaoAparecer);

        // Inicia contador de vagas
        startVagasCountdown();
    };

    const startVagasCountdown = () => {
        console.log('🔄 Iniciando countdown das vagas...');
        
        // Limpa interval anterior se existir
        if (countdownInterval) {
            clearInterval(countdownInterval);
            console.log('🧹 Interval anterior limpo');
        }

        // Atualiza displays iniciais
        updateVagasDisplay();
        updatePessoasDisplay();

        console.log(`📊 Estado inicial - Vagas: ${vagasDisponiveis}, Pessoas: ${pessoasQueColheram}`);

        countdownInterval = setInterval(() => {
            console.log('⏰ Executando interval do countdown...');
            
            if (vagasDisponiveis > 0) {
                // Reduz vagas e aumenta pessoas
                vagasDisponiveis--;
                pessoasQueColheram += POPUP_CONFIG.incrementoPessoas;
                
                console.log(`📉 Vagas reduzidas para: ${vagasDisponiveis}`);
                console.log(`📈 Pessoas aumentadas para: ${pessoasQueColheram}`);
                
                // Atualiza displays
                updateVagasDisplay();
                updatePessoasDisplay();

                // Verifica alertas
                if (vagasDisponiveis <= 5 && vagasDisponiveis > 0) {
                    updateAlertMessage('Você corre o risco de perder essa chance!');
                } else if (vagasDisponiveis <= 0) {
                    updateAlertMessage('As vagas se esgotaram!');
                    
                    // Esconde o botão quando as vagas acabam
                    if (popupElements.button.exists) {
                        const popupButton = popupElements.button.element;
                        popupButton.classList.remove('show');
                        popupButton.style.opacity = '0';
                        popupButton.style.visibility = 'hidden';
                        console.log('🚫 Botão escondido - vagas esgotadas');
                    }
                    
                    console.log('❌ Vagas esgotadas - parando countdown');
                    clearInterval(countdownInterval);
                }
            } else {
                console.log('⏹️ Countdown finalizado');
                clearInterval(countdownInterval);
            }
        }, POPUP_CONFIG.intervaloVagas);
        
        console.log(`✅ Countdown iniciado com intervalo de ${POPUP_CONFIG.intervaloVagas}ms`);
    };

    // Inicia o timer do popup
    console.log(`🚀 Popup será exibido em ${POPUP_CONFIG.tempoParaAparecer/1000} segundos...`);
    popupTimer = setTimeout(showPopup, POPUP_CONFIG.tempoParaAparecer);

    // Event listener do botão de redirecionamento
    if (popupElements.button.exists) {
        const popupButton = popupElements.button.element;
        
        popupButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔗 Clique no botão detectado!');
            console.log('🔗 Redirecionando para:', POPUP_CONFIG.linkRedirecionamento);
            
            // Limpa todos os timers antes de redirecionar
            if (popupTimer) clearTimeout(popupTimer);
            if (buttonTimer) clearTimeout(buttonTimer);
            if (countdownInterval) clearInterval(countdownInterval);
            
            window.location.href = POPUP_CONFIG.linkRedirecionamento;
        });

        // Efeitos de hover
        popupButton.addEventListener('mouseenter', function() {
            this.style.animationDuration = '0.5s';
            console.log('🖱️ Mouse sobre o botão');
        });
        
        popupButton.addEventListener('mouseleave', function() {
            this.style.animationDuration = '1.2s';
            console.log('🖱️ Mouse saiu do botão');
        });
        
        console.log('✅ Event listeners do botão adicionados');
    } else {
        console.warn('⚠️ Botão popup não encontrado - event listeners não adicionados');
    }

    // FUNÇÃO DE DEBUG EXPANDIDA E MELHORADA
    window.debugPopup = {
        // Mostra popup imediatamente
        showNow: () => {
            console.log('🛠️ DEBUG: Forçando exibição do popup');
            clearTimeout(popupTimer);
            showPopup();
        },
        
        // Controles do botão
        showButton: () => {
            console.log('🛠️ DEBUG: Forçando exibição do botão');
            if (popupElements.button.exists) {
                const popupButton = popupElements.button.element;
                popupButton.style.visibility = 'visible';
                popupButton.style.opacity = '1';
                popupButton.classList.add('show');
                console.log('✅ Botão exibido via debug');
            } else {
                console.warn('⚠️ Botão não encontrado para debug');
            }
        },
        
        hideButton: () => {
            console.log('🛠️ DEBUG: Escondendo botão');
            if (popupElements.button.exists) {
                const popupButton = popupElements.button.element;
                popupButton.style.visibility = 'hidden';
                popupButton.style.opacity = '0';
                popupButton.classList.remove('show');
                console.log('✅ Botão escondido via debug');
            } else {
                console.warn('⚠️ Botão não encontrado para debug');
            }
        },
        
        // Força atualização dos contadores
        updateCounters: () => {
            console.log('🛠️ DEBUG: Atualizando contadores');
            updateVagasDisplay();
            updatePessoasDisplay();
        },
        
        // Simula redução de vaga
        reduceVaga: () => {
            console.log('🛠️ DEBUG: Simulando redução de vaga');
            if (vagasDisponiveis > 0) {
                vagasDisponiveis--;
                pessoasQueColheram += POPUP_CONFIG.incrementoPessoas;
                updateVagasDisplay();
                updatePessoasDisplay();
                console.log(`🛠️ Nova situação - Vagas: ${vagasDisponiveis}, Pessoas: ${pessoasQueColheram}`);
            } else {
                console.log('🛠️ Não há mais vagas para reduzir');
            }
        },
        
        // Configurações e status
        config: POPUP_CONFIG,
        
        status: () => {
            return {
                vagas: vagasDisponiveis,
                pessoas: pessoasQueColheram,
                timers: {
                    popup: !!popupTimer,
                    button: !!buttonTimer,
                    countdown: !!countdownInterval
                },
                elementos: Object.fromEntries(
                    Object.entries(popupElements).map(([key, {exists}]) => [key, exists])
                )
            };
        },
        
        // Verifica elementos atualizados
        checkElements: () => {
            console.log('🔍 VERIFICAÇÃO ATUAL DOS ELEMENTOS:');
            const currentCheck = {
                'popup-overlay': !!document.getElementById('popup-overlay'),
                'popup-button': !!document.getElementById('popup-button'),
                'vagas-count': !!document.getElementById('vagas-count'),
                'pessoas-count': !!document.getElementById('pessoas-count'),
                'alert-message': !!document.getElementById('alert-message')
            };
            
            Object.entries(currentCheck).forEach(([id, exists]) => {
                console.log(`- #${id}: ${exists ? '✅' : '❌'}`);
            });
            
            return currentCheck;
        },
        
        // Cria elementos ausentes dinamicamente (útil para testes)
        createMissingElements: () => {
            console.log('🛠️ DEBUG: Criando elementos ausentes...');
            
            const elementsToCreate = [
                { id: 'vagas-count', tag: 'span', text: vagasDisponiveis },
                { id: 'pessoas-count', tag: 'span', text: pessoasQueColheram },
                { id: 'alert-message', tag: 'div', text: 'Sistema funcionando' }
            ];
            
            elementsToCreate.forEach(({id, tag, text}) => {
                if (!document.getElementById(id)) {
                    const element = document.createElement(tag);
                    element.id = id;
                    element.textContent = text;
                    element.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #333; color: white; padding: 5px; z-index: 9999; margin: 5px;';
                    document.body.appendChild(element);
                    console.log(`✅ Elemento #${id} criado dinamicamente`);
                } else {
                    console.log(`ℹ️ Elemento #${id} já existe`);
                }
            });
            
            // Atualiza a verificação dos elementos
            Object.assign(popupElements, {
                vagasCount: safeElementExists('vagas-count'),
                pessoasCount: safeElementExists('pessoas-count'),
                alertMessage: safeElementExists('alert-message')
            });
        }
    };

    console.log('🚀 Sistema inicializado com sucesso!');
    console.log('📋 Resumo da inicialização:');
    console.log(`📊 Popup aparecerá em ${POPUP_CONFIG.tempoParaAparecer/1000} segundos`);
    console.log(`🔘 Botão aparecerá ${POPUP_CONFIG.tempoParaBotaoAparecer/1000} segundos após o popup`);
    console.log(`🔗 Link de redirecionamento: ${POPUP_CONFIG.linkRedirecionamento}`);
    console.log(`👥 Pessoas iniciais: ${POPUP_CONFIG.pessoasIniciais} | Incremento: +${POPUP_CONFIG.incrementoPessoas} por vaga`);
    console.log('🛠️ Use window.debugPopup no console para testes e diagnósticos');
    
    // Diagnóstico final melhorado
    console.log('🔍 DIAGNÓSTICO FINAL:');
    Object.entries(popupElements).forEach(([nome, {exists}]) => {
        console.log(`- ${nome}: ${exists ? '✅' : '❌'}`);
    });
    
    // Aviso sobre elementos ausentes
    const missingElements = Object.entries(popupElements)
        .filter(([, {exists}]) => !exists)
        .map(([name]) => name);
    
    if (missingElements.length > 0) {
        console.warn('⚠️ ATENÇÃO: Elementos ausentes detectados:', missingElements);
        console.log('💡 DICA: Use window.debugPopup.createMissingElements() para criar elementos de teste');
        console.log('💡 DICA: Use window.debugPopup.checkElements() para verificar elementos novamente');
    }

});
