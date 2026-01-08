/**
 * Plagiarism Detector - Frontend Logic
 * Algo Avengers Team
 * ENHANCED FOR SMOOTH UI EXPERIENCE
 */

// Configuration
const API_BASE_URL = 'https://plagiarism-backend-ubde.onrender.com/api';

// DOM Elements
const elements = {
    // Mode toggle
    toggleBtns: document.querySelectorAll('.toggle-btn'),
    sourceModeContent: document.getElementById('source-mode'),
    textModeContent: document.getElementById('text-mode'),
    
    // Input fields
    program1: document.getElementById('program1'),
    program2: document.getElementById('program2'),
    textInput: document.getElementById('text-input'),
    
    // Buttons
    checkSourceBtn: document.getElementById('check-source-btn'),
    checkTextBtn: document.getElementById('check-text-btn'),
    
    // Output
    loader: document.getElementById('loader'),
    results: document.getElementById('results'),
    initialState: document.getElementById('initial-state'),
    statusIndicator: document.getElementById('status-indicator')
};

// State management
let isProcessing = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    addInputEnhancements();
    preloadStates();
});

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Mode toggle with debouncing
    elements.toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!isProcessing) {
                handleModeToggle(btn);
            }
        });
    });
    
    // Check buttons with loading state protection
    elements.checkSourceBtn.addEventListener('click', () => {
        if (!isProcessing) {
            handleSourceCheck();
        }
    });
    
    elements.checkTextBtn.addEventListener('click', () => {
        if (!isProcessing) {
            handleTextCheck();
        }
    });
    
    // Keyboard shortcuts for better UX
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to submit
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (elements.sourceModeContent.classList.contains('active') && !isProcessing) {
                handleSourceCheck();
            }
        }
    });
}

/**
 * Add smooth input enhancements
 */
function addInputEnhancements() {
    const codeInputs = [elements.program1, elements.program2, elements.textInput];
    
    codeInputs.forEach(input => {
        // Smooth focus effects
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
            this.parentElement.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        
        // Auto-resize textarea smoothly
        input.addEventListener('input', function() {
            this.style.transition = 'height 0.2s ease';
        });
    });
}

/**
 * Preload states for smoother transitions
 */
function preloadStates() {
    // Force browser to cache animations
    elements.loader.style.display = 'block';
    elements.loader.offsetHeight; // Force reflow
    elements.loader.style.display = 'none';
}

/**
 * Handle mode toggle with smooth transition
 */
function handleModeToggle(btn) {
    const mode = btn.dataset.mode;
    
    // Update button states with smooth transition
    elements.toggleBtns.forEach(b => {
        b.classList.remove('active');
        b.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    btn.classList.add('active');
    
    // Smooth content transition
    const currentContent = document.querySelector('.mode-content.active');
    const targetContent = mode === 'source' ? elements.sourceModeContent : elements.textModeContent;
    
    if (currentContent !== targetContent) {
        // Fade out current
        currentContent.style.opacity = '0';
        currentContent.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            currentContent.classList.remove('active');
            targetContent.classList.add('active');
            
            // Fade in new
            targetContent.style.opacity = '0';
            targetContent.style.transform = 'translateY(10px)';
            
            // Force reflow
            targetContent.offsetHeight;
            
            targetContent.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            targetContent.style.opacity = '1';
            targetContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Reset output smoothly
    resetOutput();
}

/**
 * Handle source code plagiarism check with smooth loading
 */
async function handleSourceCheck() {
    const program1 = elements.program1.value.trim();
    const program2 = elements.program2.value.trim();
    
    // Validation with smooth feedback
    if (!program1 || !program2) {
        showError('Please provide both programs');
        shakeElement(elements.checkSourceBtn);
        return;
    }
    
    // Prevent multiple clicks
    isProcessing = true;
    disableButton(elements.checkSourceBtn);
    
    // Show loader with smooth transition
    showLoader();
    
    try {
        const response = await fetch(`${API_BASE_URL}/check-plagiarism`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                program1: program1,
                program2: program2
            })
        });
        
        const data = await response.json();
        
        // Small delay for smooth transition (UX enhancement)
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Hide loader and show results with animation
        hideLoader();
        displayResults(data);
        
    } catch (error) {
        hideLoader();
        showError(`Network error: ${error.message}. Make sure the backend server is running on port 5000.`);
        shakeElement(elements.results);
    } finally {
        isProcessing = false;
        enableButton(elements.checkSourceBtn);
    }
}

/**
 * Handle text plagiarism check
 */
function handleTextCheck() {
    showError('Text plagiarism detection is not yet implemented. Please use Source Code Detection.');
    shakeElement(elements.checkTextBtn);
}

/**
 * Display results with staggered animations
 */
function displayResults(data) {
    elements.statusIndicator.classList.add('active');
    
    if (!data.success) {
        showError(data.error);
        return;
    }
    
    const analysis = data.analysis;
    const isPlagiarized = analysis.verdict === 'PLAGIARIZED';
    
    const html = `
        <div class="verdict-banner ${isPlagiarized ? 'verdict-plagiarized' : 'verdict-original'}">
            ${isPlagiarized ? '🚨 PLAGIARISM DETECTED' : '✅ ORIGINAL CODE'}
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-label">Overall Similarity</div>
                <div class="metric-value ${getSimilarityClass(analysis.similarity_percentage)}">
                    ${analysis.similarity_percentage}%
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Structural Match</div>
                <div class="metric-value ${getSimilarityClass(analysis.ast_score * 100)}">
                    ${(analysis.ast_score * 100).toFixed(1)}%
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Semantic Match</div>
                <div class="metric-value ${getSimilarityClass(analysis.semantic_score * 100)}">
                    ${(analysis.semantic_score * 100).toFixed(1)}%
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Intent Match</div>
                <div class="metric-value ${analysis.intent_match ? 'high' : 'low'}">
                    ${analysis.intent_match ? 'YES' : 'NO'}
                </div>
            </div>
        </div>
        
        <div class="details-section">
            <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Detailed Analysis</h3>
            
            <div class="detail-row">
                <span class="detail-label">AST + CFG Similarity</span>
                <span class="detail-value">${analysis.ast_score.toFixed(4)}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Semantic Similarity</span>
                <span class="detail-value">${analysis.semantic_score.toFixed(4)}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Verdict</span>
                <span class="detail-value" style="color: ${isPlagiarized ? 'var(--danger)' : 'var(--success)'}">
                    ${analysis.verdict}
                </span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Reason</span>
                <span class="detail-value">${analysis.reason}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">AI-Generated Probability (P1)</span>
                <span class="detail-value">${analysis.ai_probability.program1}%</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">AI-Generated Probability (P2)</span>
                <span class="detail-value">${analysis.ai_probability.program2}%</span>
            </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--light); border-radius: 8px; font-size: 0.9rem; color: var(--text-secondary);">
            <strong>Note:</strong> This analysis uses AST structure, control flow graphs, call graphs, and CodeBERT semantic embeddings to detect code similarity.
        </div>
    `;
    
    elements.results.innerHTML = html;
    
    // Smooth reveal of results
    elements.results.style.opacity = '0';
    elements.results.classList.remove('hidden');
    elements.initialState.classList.add('hidden');
    
    // Force reflow
    elements.results.offsetHeight;
    
    // Fade in with animation
    requestAnimationFrame(() => {
        elements.results.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        elements.results.style.opacity = '1';
    });
    
    // Animate metric values (count up effect)
    animateMetricValues();
}

/**
 * Animate metric values for visual appeal
 */
function animateMetricValues() {
    const metricValues = document.querySelectorAll('.metric-value');
    
    metricValues.forEach((element, index) => {
        setTimeout(() => {
            const text = element.textContent.trim();
            const match = text.match(/[\d.]+/);
            
            if (match) {
                const finalValue = parseFloat(match[0]);
                animateNumber(element, 0, finalValue, 600, text.includes('%'));
            }
        }, index * 100);
    });
}

/**
 * Animate number counting up
 */
function animateNumber(element, start, end, duration, isPercentage) {
    const startTime = performance.now();
    const initialText = element.textContent;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        
        if (initialText.includes('%')) {
            element.textContent = current.toFixed(1) + '%';
        } else if (initialText === 'YES' || initialText === 'NO') {
            return;
        } else {
            element.textContent = current.toFixed(1) + '%';
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = initialText; // Restore original format
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Get CSS class based on similarity percentage
 */
function getSimilarityClass(percentage) {
    if (percentage >= 75) return 'high';
    if (percentage >= 40) return 'medium';
    return 'low';
}

/**
 * Show error message with smooth animation
 */
function showError(message) {
    elements.statusIndicator.classList.remove('active');
    
    const html = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
    
    elements.results.innerHTML = html;
    elements.results.style.opacity = '0';
    elements.results.classList.remove('hidden');
    elements.initialState.classList.add('hidden');
    
    // Smooth fade in
    requestAnimationFrame(() => {
        elements.results.style.transition = 'opacity 0.4s ease';
        elements.results.style.opacity = '1';
    });
}

/**
 * Show loader with smooth transition
 */
function showLoader() {
    elements.initialState.style.opacity = '0';
    elements.results.style.opacity = '0';
    
    setTimeout(() => {
        elements.loader.classList.remove('hidden');
        elements.results.classList.add('hidden');
        elements.initialState.classList.add('hidden');
        elements.statusIndicator.classList.remove('active');
        
        // Fade in loader
        elements.loader.style.opacity = '0';
        requestAnimationFrame(() => {
            elements.loader.style.transition = 'opacity 0.3s ease';
            elements.loader.style.opacity = '1';
        });
    }, 200);
}

/**
 * Hide loader with smooth transition
 */
function hideLoader() {
    elements.loader.style.opacity = '0';
    
    setTimeout(() => {
        elements.loader.classList.add('hidden');
    }, 300);
}

/**
 * Reset output to initial state smoothly
 */
function resetOutput() {
    const currentVisible = elements.results.classList.contains('hidden') ? 
                          elements.initialState : elements.results;
    
    currentVisible.style.transition = 'opacity 0.3s ease';
    currentVisible.style.opacity = '0';
    
    setTimeout(() => {
        elements.loader.classList.add('hidden');
        elements.results.classList.add('hidden');
        elements.initialState.classList.remove('hidden');
        elements.statusIndicator.classList.remove('active');
        
        // Fade in initial state
        elements.initialState.style.opacity = '0';
        requestAnimationFrame(() => {
            elements.initialState.style.transition = 'opacity 0.4s ease';
            elements.initialState.style.opacity = '1';
        });
    }, 300);
}

/**
 * Shake element for error feedback
 */
function shakeElement(element) {
    element.style.animation = 'none';
    
    // Force reflow
    element.offsetHeight;
    
    element.style.animation = 'shake 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

/**
 * Disable button during processing
 */
function disableButton(button) {
    button.disabled = true;
    button.style.opacity = '0.6';
    button.style.cursor = 'not-allowed';
    button.style.transform = 'none';
    
    // Add loading indicator
    const originalHTML = button.innerHTML;
    button.dataset.originalHTML = originalHTML;
    
    button.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            "></div>
            <span>Processing...</span>
        </div>
    `;
}

/**
 * Enable button after processing
 */
function enableButton(button) {
    button.disabled = false;
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
    
    // Restore original content
    if (button.dataset.originalHTML) {
        button.innerHTML = button.dataset.originalHTML;
        delete button.dataset.originalHTML;
    }
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}

// Add CSS for shake animation if not already present
if (!document.getElementById('shake-animation-style')) {
    const style = document.createElement('style');
    style.id = 'shake-animation-style';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
}