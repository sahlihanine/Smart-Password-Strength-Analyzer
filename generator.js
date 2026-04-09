document.addEventListener('DOMContentLoaded', () => {
    const passwordEl = document.getElementById('generatedPassword');
    const lengthRange = document.getElementById('lengthRange');
    const lengthVal = document.getElementById('lengthVal');
    const includeUpper = document.getElementById('includeUpper');
    const includeLower = document.getElementById('includeLower');
    const includeNumbers = document.getElementById('includeNumbers');
    const includeSymbols = document.getElementById('includeSymbols');
    const refreshBtn = document.getElementById('refreshBtn');
    const copyBtn = document.getElementById('copyBtn');

    const charSets = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    function generatePassword() {
        let length = +lengthRange.value;
        let allowedChars = '';
        let password = '';

        if (includeUpper.checked) allowedChars += charSets.upper;
        if (includeLower.checked) allowedChars += charSets.lower;
        if (includeNumbers.checked) allowedChars += charSets.numbers;
        if (includeSymbols.checked) allowedChars += charSets.symbols;

        if (allowedChars === '') {
            passwordEl.innerText = 'Sélectionnez une option';
            return;
        }

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allowedChars.length);
            password += allowedChars[randomIndex];
        }

        passwordEl.innerText = password;
    }

    // Event listeners
    lengthRange.addEventListener('input', (e) => {
        lengthVal.innerText = e.target.value;
        generatePassword();
    });

    [includeUpper, includeLower, includeNumbers, includeSymbols].forEach(cb => {
        cb.addEventListener('change', generatePassword);
    });

    refreshBtn.addEventListener('click', generatePassword);

    copyBtn.addEventListener('click', () => {
        const password = passwordEl.innerText;
        if (password === '........' || password === 'Sélectionnez une option') return;
        
        navigator.clipboard.writeText(password).then(() => {
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
            }, 2000);
        });
    });

    // Initial generation
    generatePassword();
});
