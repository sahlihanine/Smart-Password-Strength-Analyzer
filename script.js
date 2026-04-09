document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const scoreText = document.getElementById('score-text');
    const crackTimeText = document.getElementById('crack-time');
    const recommendationsList = document.getElementById('recommendations-list');
    const entropyVal = document.getElementById('entropy-val');
    const charsetVal = document.getElementById('charset-val');
    const securityStatus = document.getElementById('security-status');

    // Liste des mots de passe les plus communs (Top 20)
    const commonPasswords = [
        "123456", "password", "123456789", "qwerty", "12345678", "111111", 
        "12345", "123123", "000000", "admin", "password123", "azerty", 
        "bonjour", "soleil", "loulou", "marseille", "doudou", "chouchou"
    ];

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.querySelector('i').classList.toggle('fa-eye');
        togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Analyze password on input
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        if (password.length === 0) {
            resetUI();
            return;
        }
        
        const analysis = analyzePassword(password);
        updateUI(analysis);
    });

    function analyzePassword(password) {
        let score = 0;
        const recommendations = [];

        // 0. Common Password Check (CRITICAL)
        const isCommon = commonPasswords.includes(password.toLowerCase());
        if (isCommon) {
            score = 5; // Note minimale car très dangereux
            recommendations.push({ text: "DANGER : Ce mot de passe est extrêmement commun et facile à deviner !", type: "warning" });
        }

        // 1. Length Check
        if (password.length >= 12) {
            score += 25;
            recommendations.push({ text: "Longueur excellente (12+ caractères).", type: "check" });
        } else if (password.length >= 8) {
            score += 15;
            recommendations.push({ text: "Longueur acceptable, mais visez 12 caractères.", type: "warning" });
        } else {
            recommendations.push({ text: "Trop court ! Utilisez au moins 8 caractères.", type: "warning" });
        }

        // 2. Uppercase Check
        if (/[A-Z]/.test(password)) {
            score += 20;
            recommendations.push({ text: "Contient des majuscules.", type: "check" });
        } else {
            recommendations.push({ text: "Ajoutez des lettres majuscules (A-Z).", type: "warning" });
        }

        // 3. Lowercase Check
        if (/[a-z]/.test(password)) {
            score += 15;
            recommendations.push({ text: "Contient des minuscules.", type: "check" });
        } else {
            recommendations.push({ text: "Ajoutez des lettres minuscules (a-z).", type: "warning" });
        }

        // 4. Numbers Check
        if (/[0-9]/.test(password)) {
            score += 20;
            recommendations.push({ text: "Contient des chiffres.", type: "check" });
        } else {
            recommendations.push({ text: "Ajoutez des chiffres (0-9).", type: "warning" });
        }

        // 5. Special Characters Check
        if (/[^A-Za-z0-9]/.test(password)) {
            score += 20;
            recommendations.push({ text: "Contient des caractères spéciaux.", type: "check" });
        } else {
            recommendations.push({ text: "Ajoutez des caractères spéciaux (ex: @, #, $).", type: "warning" });
        }

        // Cap score at 100
        score = Math.min(score, 100);

        // Determine level
        let level = "Faible";
        let colorClass = "weak";
        if (score >= 80 && !isCommon) {
            level = "Fort";
            colorClass = "strong";
        } else if (score >= 50 && !isCommon) {
            level = "Moyen";
            colorClass = "medium";
        }

        // Estimate Crack Time (Brute Force)
        const crackTime = estimateCrackTime(password);

        // Entropy Calculation
        const entropy = calculateEntropy(password);

        return { score, level, colorClass, recommendations, crackTime, entropy };
    }

    function calculateEntropy(password) {
        let charsetSize = 0;
        if (/[a-z]/.test(password)) charsetSize += 26;
        if (/[A-Z]/.test(password)) charsetSize += 26;
        if (/[0-9]/.test(password)) charsetSize += 10;
        if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32;

        if (password.length === 0 || charsetSize === 0) return { bits: 0, charset: 0 };
        
        // E = L * log2(R)
        const bits = Math.floor(password.length * Math.log2(charsetSize));
        return { bits, charset: charsetSize };
    }

    function estimateCrackTime(password) {
        let charsetSize = 0;
        if (/[a-z]/.test(password)) charsetSize += 26;
        if (/[A-Z]/.test(password)) charsetSize += 26;
        if (/[0-9]/.test(password)) charsetSize += 10;
        if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32;

        const combinations = Math.pow(charsetSize, password.length);
        const hashesPerSecond = 1e10; // 10 milliards de tentatives/sec (PC puissant)
        const seconds = combinations / hashesPerSecond;

        if (seconds < 1) return "Instantané";
        if (seconds < 60) return Math.floor(seconds) + " sec";
        if (seconds < 3600) return Math.floor(seconds / 60) + " min";
        if (seconds < 86400) return Math.floor(seconds / 3600) + " heures";
        if (seconds < 31536000) return Math.floor(seconds / 86400) + " jours";
        if (seconds < 3153600000) return Math.floor(seconds / 31536000) + " ans";
        return "Des siècles";
    }

    function updateUI(analysis) {
        // Update bar
        strengthBar.style.width = `${analysis.score}%`;
        strengthBar.className = `bar ${analysis.colorClass}`;

        // Update texts
        strengthText.innerText = analysis.level;
        strengthText.className = `value text-${analysis.colorClass}`;
        scoreText.innerText = `${analysis.score}/100`;
        crackTimeText.innerText = analysis.crackTime;
        
        // Update crack time color
        crackTimeText.className = `value text-${analysis.colorClass}`;

        // Update Tech Details
        entropyVal.innerText = `${analysis.entropy.bits} bits`;
        charsetVal.innerText = analysis.entropy.charset;
        securityStatus.innerText = analysis.entropy.bits > 60 ? 'HAUTE' : (analysis.entropy.bits > 30 ? 'MOYENNE' : 'BASSE');
        securityStatus.style.color = analysis.colorClass === 'strong' ? '#2ecc71' : (analysis.colorClass === 'medium' ? '#ffa500' : '#ff4d4d');

        // Update recommendations
        recommendationsList.innerHTML = '';
        analysis.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.innerText = rec.text;
            li.className = rec.type;
            recommendationsList.appendChild(li);
        });
    }

    function resetUI() {
        strengthBar.style.width = '0%';
        strengthBar.className = 'bar';
        strengthText.innerText = 'En attente...';
        strengthText.className = 'value';
        scoreText.innerText = '0/100';
        crackTimeText.innerText = 'Inconnu';
        crackTimeText.className = 'value';
        entropyVal.innerText = '0 bits';
        charsetVal.innerText = '0';
        securityStatus.innerText = 'N/A';
        recommendationsList.innerHTML = '<li>Entrez un mot de passe pour voir les conseils.</li>';
    }
});
